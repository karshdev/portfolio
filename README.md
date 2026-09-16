# aakarsh-portfolio

Terminal-style developer portfolio for Aakarsh Sharma. Next.js 16 (App Router) +
React 19 + Tailwind 4, with an AI assistant in the terminal backed by OpenRouter.

## Setup

```bash
npm install
cp .env.example .env    # then fill in the values below
npm run dev             # http://localhost:3000
```

### Environment

| Variable | Required | What it does |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | yes | Powers the terminal AI chat. Get one at [openrouter.ai/keys](https://openrouter.ai/keys). Without it the terminal still resolves slash commands but can't answer free-form questions. |
| `RESEND_API_KEY` | no | Lets the assistant send contact emails. Without it the `send_email` tool replies "email service not configured". |
| `CONTACT_EMAIL` | no | Inbox that visitor messages are delivered to. Required alongside `RESEND_API_KEY`. |
| `SITE_URL` | no | Public URL. Used for OG metadata and OpenRouter attribution. Falls back to `http://localhost:3000`. |
| `SITE_NAME` | no | Attribution label on openrouter.ai/rankings. ASCII only; quote values with spaces. |

`.env` is gitignored. Never commit real keys.

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build
npm start         # serve the production build
npm test          # vitest (command resolver suite)
npm run lint      # eslint
npm run format    # prettier --write
```

## Where the content lives

All personal content is centralized — you should rarely need to touch a component
to update the site.

| File | Contains |
| --- | --- |
| [`lib/copy.ts`](lib/copy.ts) | Name, handle, tagline, headline, bio, tech stack, experience, pillars, honors, education, job preferences, contact links, pull-quote |
| [`lib/projects.ts`](lib/projects.ts) | Project cards: titles, URLs, video walkthroughs, screenshots, blurbs, stack tags |
| [`lib/chat.ts`](lib/chat.ts) | Canned answers for `/whoami`, `/projects`, `/experience`, `/contact`, `/ls` |
| [`lib/commands.ts`](lib/commands.ts) | Slash commands, natural-language patterns, keywords |
| [`lib/ai/systemPrompt.ts`](lib/ai/systemPrompt.ts) | Builds the assistant's system prompt from the two files above |
| [`public/images/`](public/images/) | Project screenshots, referenced by `image` in `lib/projects.ts` |

Adding a project means adding one entry to `projects` in `lib/projects.ts` plus its
image — the grid, command palette, `/open` command, resolver tests, and AI system
prompt all derive from that list.

## Architecture

```
app/
  layout.tsx          root layout, fonts, metadata
  page.tsx            renders <Shell />
  api/chat/route.ts   SSE streaming endpoint + tool-calling loop
components/
  shell/              ConsoleProvider (state), TopBar, Shell layout
  terminal/           the chat terminal: prompt, history, typed lines
  sections/           whoami, projects, quote, experience, contact, project modal
  sidebar/            nav menu, process bars, ambient log stream
  palette/            ⌘K command palette
lib/
  ai/                 OpenRouter client, system prompt, tools
  hooks/              command resolver, iframe probe, shortcuts, clock
  resolver.ts         input → command matching (slash → regex → keywords → prefix)
```

### The AI terminal

Free-form input goes to `/api/chat`, which streams Server-Sent Events back to the
client. The route runs a tool-calling loop (max 3 hops) over the OpenRouter chat
completions API. Two tools are available to the model:

- `browse_projects` — looks up project and role detail from `lib/copy.ts` / `lib/projects.ts`
- `send_email` — sends a contact email via Resend, only after explicit user confirmation

Models are declared in [`lib/types.ts`](lib/types.ts) and switchable at runtime with
`/model`:

| Alias | Model |
| --- | --- |
| `sonnet` | `anthropic/claude-sonnet-5` (default) |
| `fable` | `anthropic/claude-fable-5.1` |
| `gemini` | `google/gemini-3.5-flash` |

The client can only select from this list — the route validates the requested
model against it before calling OpenRouter.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | command palette |
| `/` | focus the terminal prompt |
| `↑` `↓` | input history |
| `Tab` | complete a slash command |
| `Ctrl+L` | clear scrollback |
| `Esc` | close the project panel |
| `F` | fullscreen the project panel |
| `⌘↵` | visit the current project's site |
