import type { NextRequest } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/systemPrompt";
import { TOOL_DEFINITIONS, runTool } from "@/lib/ai/tools";
import { streamChat, type ChatMessage, type ToolCall } from "@/lib/ai/openrouterClient";
import { DEFAULT_MODEL, MODELS } from "@/lib/types";
import type { ModelId } from "@/lib/types";

export const runtime = "nodejs";

const MAX_TOOL_HOPS = 3;

export async function POST(req: NextRequest) {
  const { message, model, history } = (await req.json()) as {
    message: string;
    model: ModelId;
    history: ChatMessage[];
  };

  // Never forward an arbitrary client-supplied slug to OpenRouter.
  const resolvedModel =
    MODELS.find((m) => m.id === model)?.id ?? DEFAULT_MODEL;

  const systemPrompt = buildSystemPrompt();
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (data: string) =>
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));

      await runChatStream({
        systemPrompt,
        history,
        message,
        model: resolvedModel,
        enqueue,
        controller,
      });
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

async function runChatStream({
  systemPrompt,
  history,
  message,
  model,
  enqueue,
  controller,
}: {
  systemPrompt: string;
  history: ChatMessage[];
  message: string;
  model: ModelId;
  enqueue: (data: string) => void;
  controller: ReadableStreamDefaultController;
}) {
  let currentMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];
  let hops = 0;

  while (hops <= MAX_TOOL_HOPS) {
    let stream: ReadableStream<Uint8Array>;
    try {
      stream = await streamChat(currentMessages, model, TOOL_DEFINITIONS);
    } catch (err) {
      enqueue(JSON.stringify({ type: "content", token: `⚠ ${(err as Error).message}` }));
      enqueue("[DONE]");
      controller.close();
      return;
    }

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const toolCallsBuffer: Record<number, { id: string; name: string; args: string }> = {};
    let hasToolCalls = false;
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const dataLine = part.split("\n").find((l) => l.startsWith("data: "));
        if (!dataLine) continue;
        const raw = dataLine.slice(6).trim();
        // OpenRouter emits ": OPENROUTER PROCESSING" keep-alive comments, which
        // never reach here, and a final [DONE] sentinel.
        if (raw === "[DONE]") continue;

        try {
          const chunk = JSON.parse(raw);
          const delta = chunk.choices?.[0]?.delta;
          if (!delta) continue;

          if (delta.tool_calls) {
            hasToolCalls = true;
            for (const tc of delta.tool_calls as ToolCall[]) {
              const idx = (tc as { index?: number }).index ?? 0;
              if (!toolCallsBuffer[idx]) toolCallsBuffer[idx] = { id: "", name: "", args: "" };
              if (tc.id) toolCallsBuffer[idx].id = tc.id;
              if (tc.function?.name) toolCallsBuffer[idx].name = tc.function.name;
              if (tc.function?.arguments) toolCallsBuffer[idx].args += tc.function.arguments;
            }
          }

          if (!hasToolCalls) {
            // Reasoning models surface thinking as `reasoning` on OpenRouter.
            if (delta.reasoning) {
              enqueue(JSON.stringify({ type: "thinking", token: delta.reasoning }));
            }
            if (delta.content) {
              assistantContent += delta.content;
              enqueue(JSON.stringify({ type: "content", token: delta.content }));
            }
          }
        } catch {
          // skip malformed chunk
        }
      }
    }

    if (!hasToolCalls) {
      enqueue("[DONE]");
      controller.close();
      return;
    }

    hops++;
    const toolCalls: ToolCall[] = Object.values(toolCallsBuffer).map((tc) => ({
      id: tc.id,
      type: "function",
      function: { name: tc.name, arguments: tc.args },
    }));

    currentMessages = [
      ...currentMessages,
      { role: "assistant", content: assistantContent || null, tool_calls: toolCalls },
    ];

    for (const tc of toolCalls) {
      let result: unknown;
      try {
        result = await runTool(tc.function.name, JSON.parse(tc.function.arguments || "{}"));
      } catch (e) {
        result = { error: (e as Error).message };
      }
      currentMessages = [
        ...currentMessages,
        { role: "tool", content: JSON.stringify(result), tool_call_id: tc.id },
      ];
    }
  }

  enqueue(JSON.stringify({ type: "content", token: "⚠ max tool hops reached." }));
  enqueue("[DONE]");
  controller.close();
}
