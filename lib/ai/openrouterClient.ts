const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

/**
 * Header values must be byte strings, so anything non-ASCII in the env (an em
 * dash in SITE_NAME, say) would throw before the request is ever sent.
 */
function asciiOnly(value: string): string {
  return value.replace(/[^\x20-\x7E]/g, "").trim();
}

/**
 * OpenRouter ranks apps by referrer/title. Both headers are optional; they only
 * affect how this site shows up on openrouter.ai/rankings.
 */
function headers(): Record<string, string> {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  };
  const referer = asciiOnly(process.env.SITE_URL ?? "");
  const title = asciiOnly(process.env.SITE_NAME ?? "");
  if (referer) h["HTTP-Referer"] = referer;
  if (title) h["X-Title"] = title;
  return h;
}

export async function streamChat(
  messages: ChatMessage[],
  model: string,
  tools: unknown[],
): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: { ...headers(), Accept: "text/event-stream" },
    body: JSON.stringify({
      model,
      messages,
      tools: tools.length > 0 ? tools : undefined,
      tool_choice: tools.length > 0 ? "auto" : undefined,
      stream: true,
      max_tokens: 6000,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text}`);
  }

  return res.body!;
}
