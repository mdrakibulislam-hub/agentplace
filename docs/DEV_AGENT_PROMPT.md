# Suggested development-agent prompt

Use this in a new development session:

> Work in this existing Agentplace repository. Read `AGENTS.md`, `docs/DEVELOPMENT_CONTEXT.md`, and `docs/design-handoff/AGENT_CONTRACT.md`, then the component/flow guides relevant to the task. The approved product is the project-based AI agent builder in the linked Figma file. Reuse this Bun/React/Vite/Hono/tRPC/Better Auth/Drizzle app and its shared UI/Storybook. Inspect the current implementation, identify the gaps for the requested slice, and implement it using the saved product decisions, semantic tokens, SF Pro, Reicon, contextual cover rules, gentle shadows, motion presets and reduced-motion behavior. Keep real async state, permissions and draft/published data boundaries. Verify the changed flows and report what is implemented, tested and still missing. Do not treat Figma prototype timers, sample assets or example data as production logic.

Add the specific development slice you want after that paragraph. The saved context supplies the product history; you do not need to repeat the design conversation.
