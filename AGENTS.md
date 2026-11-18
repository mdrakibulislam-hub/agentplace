# Agentplace development context

## Read first

1. [Current development context](docs/DEVELOPMENT_CONTEXT.md)
2. [Agent implementation contract](docs/design-handoff/AGENT_CONTRACT.md)
3. Relevant portions of [components](docs/design-handoff/COMPONENTS.md) and [flows](docs/design-handoff/FLOWS.md)
4. [Conversation context](docs/CONVERSATION_CONTEXT.md) when checking the origin or order of a decision

Current user instructions supersede the handoff. Within the saved context, the latest explicit correction wins. The current product is a project-based AI agent builder; `docs/project-brief.md` is the earlier scaffold brief.

## Existing repository

Reuse Bun workspaces/Turborepo, React/Vite/TanStack Router, Hono, tRPC, Better Auth, Drizzle/SQLite, `packages/ui`, and Storybook. Inspect the relevant source before implementation. Extend this app instead of scaffolding a second app or replacing the stack to fit a reference snippet.

Keep application and Storybook tokens synchronized through `packages/ui/src/styles/tokens.css` and `globals.css`. Reconcile these existing scaffold values with the latest AP Figma tokens. The snapshot lives in `docs/design-handoff/tokens.json`; do not blindly paste every exported primitive into every component.

## Product constraints

- After login, show project home without a sidebar. A project opens the chat-based builder, which has project navigation and an agent preview.
- Use SF Pro for product UI and Reicon SVGs from https://reicon.dev/icons. Preserve original brand/client logos and mascot artwork. Existing scaffold Lucide dependencies are not the approved product icon source.
- Keep semantic foreground/background/card/muted/action/border tokens and shared component variants. Inputs have soft resting borders; only the focused field receives focus treatment.
- Keep project, draft, published version, workspace permissions, and real asynchronous task state distinct. Do not hardcode example project IDs, OTPs, credits, live URLs, upload outcomes, or prototype timers.
- Cover behavior is context dependent. Read `docs/design-handoff/cover-presentation.json`: home without a cover uses `Default-mascot`; branding without a cover uses `Empty`; uploaded covers use `Added`. Editable hover/focus temporarily shows `Empty` and never deletes the asset.
- Use the restrained physical spring presets, reduced-motion behavior, 32-second ambient drift, and layered Resting/Panel/Overlay shadows in the handoff. Ambient motion is not a spring or a loading indicator.
- Home/auth/OTP use the decorative bottom gradient. Builder/settings/visitor preview do not inherit it automatically.
- Preserve the small spacing/alignment refinements described in the context; do not substitute an oversized generic dashboard treatment.

## Evidence and implementation boundaries

Figma prototypes, screenshots, reference CSS/JS, and native animation previews are design evidence, not implemented backend features. The inspected scaffold has email/password auth and starter routes/API; Google auth, OTP delivery, project persistence, generation, publishing, billing, uploads, staff roles, and integrations still require work. Verify current source rather than assuming this snapshot is a live implementation inventory.

Keep keyboard/focus/touch behavior, loading/error recovery, reduced motion, and server-side permissions in the implementation plan. Dark/mobile tokens or guidance do not establish verified dark/mobile layouts.

For code changes, run appropriate existing checks from `README.md` and focused validation of changed flows. Do not claim unrun checks or infer passing behavior from a static design. Keep reference samples outside the application's source tree until deliberately adapted. Report implemented, verified, and missing behavior separately.

This handoff update itself changes documentation and reference assets only. No application runtime was integrated by copying the bundle.

`docs/design-handoff/` contains raw design snapshots and standalone reference snippets and is excluded from Biome's application-source checks. `MANIFEST.json` verifies the original copied files. Once reference code is adapted into `apps/` or `packages/`, normal repository checks apply to it.
