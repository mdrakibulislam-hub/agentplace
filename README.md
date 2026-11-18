# Agentplace

A foundation for AI agents that answer questions, book appointments, handle customer service, and deliver services online.

## Current product and design handoff

The approved experience is a **project-based AI agent builder**. Before development, read [AGENTS.md](AGENTS.md) and [the current development context](docs/DEVELOPMENT_CONTEXT.md). They connect the existing scaffold to the latest Figma flows, product decisions, cover behavior, motion, shadows, and implementation requirements.

The complete [design handoff](docs/design-handoff/README.md) is copied into this repository, including human/agent guides, token and component exports, interaction contracts, and motion references. [Conversation context](docs/CONVERSATION_CONTEXT.md) records the decisions and corrections in order. The original project brief predates these builder decisions.

The raw handoff snapshot is excluded from Biome's application-source checks to preserve exported metadata and standalone examples. Its `MANIFEST.json` records source-file hashes. Application code adapted from those examples remains subject to normal checks.

## Stack

TanStack Router and React on Vite, Hono on the Bun runtime, tRPC, SQLite, Drizzle ORM, Better Auth, Bun workspaces, Turborepo, Biome, and Husky. Storybook documents the shared UI library and design tokens. Tailwind CSS styles the components.

## Local development

Use Bun **1.4.2 or newer** and Node.js **22.12 or newer** for Storybook and Vite. Dependencies are pinned by `bun.lock`.

```sh
bun install --frozen-lockfile
bun run setup
bun run dev
```

Setup creates local environment files with a random authentication secret and an absolute SQLite path, generates environment types, and applies the committed database migration. It preserves existing environment files. If you move the repository, update `DATABASE_URL` in `apps/server/.env` to the new absolute path.

- Web: http://localhost:4101
- API: http://localhost:4100

To run the product prototype without the API after setup, use `bun run dev:web`. Start at the web URL and sign in to explore sample projects, or create an account to see an empty workspace. Verification accepts any six digits locally. Projects, saved drafts, published snapshots, and workspace settings are scoped to this browser. Published links are for reviewing that browser's saved prototype data.

In another terminal:

```sh
bun run storybook
```

Storybook opens at http://localhost:6006. The web server uses a fixed port so auth origins stay consistent. If you change ports, update `apps/web/vite.config.ts`, `PORT` and the origins in `apps/server/.env`, and `VITE_SERVER_URL` in `apps/web/.env` together.

## Workspace

| Path              | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `apps/web`        | React product prototype, TanStack Router routes, and Storybook |
| `apps/server`     | Hono API, Better Auth endpoints, and tRPC transport            |
| `packages/api`    | Shared tRPC router, context, and authenticated procedures      |
| `packages/auth`   | Better Auth configuration and Drizzle adapter                  |
| `packages/db`     | SQLite client, authentication schema, and migrations           |
| `packages/ui`     | Shared UI components, styles, and light/dark design tokens     |
| `packages/config` | Shared TypeScript configuration                                |

## Design system

The shared AP library implements the Figma foundation and component definitions. Semantic colors, primitives, metrics, typography, and the three elevation stacks live in `packages/ui/src/styles`; both the app and Storybook use these same sources. The typed token catalog is exported from `@agentplace/ui/foundations`.

Storybook includes **401 variables, 25 typography styles, 97 component definitions, and 169 authored variants**, with original SVG artwork, interaction guides, light/dark modes, and reduced-motion inspection. `Guides/Start here` explains navigation and keyboard/async contracts. Source links are available beside the live component docs. Historical Figma QA boards are reference material, not extra component masters.

For local SF Pro design review, run `bun run setup:fonts`; see [the font setup and usage terms](docs/storybook-fonts.md). Font binaries are ignored by Git. A static build can contain a locally prepared font, so review its usage terms before publishing that output.

Reusable components live in `packages/ui/src/components`. The Storybook **Product** group presents the Figma screens using the same React compositions as the app, with isolated demo state for each scene. Component stories live in `apps/web/src/stories`, and product stories also live alongside their code in `apps/web/src/product`. `bun run audit:storybook` verifies the component source mapping and asset provenance. See the [component coverage audit](docs/storybook-coverage-audit.md) and the [prototype design audit](docs/prototype-design-audit.md) for rendered comparisons and interaction checks.

## Commands

| Command                   | Purpose                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| `bun run dev`             | Start web and API through Turborepo                                       |
| `bun run storybook`       | Start the component library                                               |
| `bun run check`           | Check formatting, imports, and lint rules without changing files          |
| `bun run check:fix`       | Apply safe Biome fixes                                                    |
| `bun run check-types`     | Type-check all workspaces                                                 |
| `bun run build`           | Build web and API                                                         |
| `bun run build-storybook` | Build a static Storybook                                                  |
| `bun run audit:storybook` | Verify all Figma definitions, variants, token/style IDs, and local assets |
| `bun run setup:fonts`     | Prepare the original SF Pro face locally for design review                |
| `bun run db:generate`     | Generate migrations after changing the schema                             |
| `bun run db:migrate`      | Apply committed migrations                                                |
| `bun run db:push`         | Sync a disposable development database directly                           |
| `bun run db:studio`       | Open Drizzle Studio                                                       |

Husky runs lint-staged on commits. Database files and local secrets are ignored by Git. `.env.example` files document the configuration; `.env.schema` files validate it and generate types through Varlock. The scaffold currently uses the matching Drizzle ORM and Drizzle Kit `1.0.0-rc.5` versions; keep them aligned when upgrading.

The product routes simulate authentication, agent creation and testing, publishing, credits, plugin connections, and staff workflows. The existing Better Auth scaffold and tRPC health check remain available on the API. Live agent execution and workspace services require backend integration.
