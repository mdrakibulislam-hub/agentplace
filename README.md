# Agentplace

A foundation for AI agents that answer questions, book appointments, handle customer service, and deliver services online.

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

In another terminal:

```sh
bun run storybook
```

Storybook opens at http://localhost:6006. The web server uses a fixed port so auth origins stay consistent. If you change ports, update `apps/web/vite.config.ts`, `PORT` and the origins in `apps/server/.env`, and `VITE_SERVER_URL` in `apps/web/.env` together.

## Workspace

| Path              | Purpose                                                                          |
| ----------------- | -------------------------------------------------------------------------------- |
| `apps/web`        | React application, file routes, login/signup, protected dashboard, and Storybook |
| `apps/server`     | Hono API, Better Auth endpoints, and tRPC transport                              |
| `packages/api`    | Shared tRPC router, context, and authenticated procedures                        |
| `packages/auth`   | Better Auth configuration and Drizzle adapter                                    |
| `packages/db`     | SQLite client, authentication schema, and migrations                             |
| `packages/ui`     | Shared UI components, styles, and light/dark design tokens                       |
| `packages/config` | Shared TypeScript configuration                                                  |

## Design system

Edit semantic color and base radius values in `packages/ui/src/styles/tokens.css`. Tailwind mappings and typography live in `packages/ui/src/styles/globals.css`. Both the app and Storybook import these styles; Storybook is the inspection and documentation surface, and these source files remain the source of truth.

Stories live in `apps/web/src/stories`. The foundation page shows semantic colors, typography, spacing, and radii. Button, Input, and AgentCard stories demonstrate variants and states. The toolbar switches light/dark themes. Accessibility checks and a button interaction example are included.

## Commands

| Command                   | Purpose                                                          |
| ------------------------- | ---------------------------------------------------------------- |
| `bun run dev`             | Start web and API through Turborepo                              |
| `bun run storybook`       | Start the component library                                      |
| `bun run check`           | Check formatting, imports, and lint rules without changing files |
| `bun run check:fix`       | Apply safe Biome fixes                                           |
| `bun run check-types`     | Type-check all workspaces                                        |
| `bun run build`           | Build web and API                                                |
| `bun run build-storybook` | Build a static Storybook                                         |
| `bun run db:generate`     | Generate migrations after changing the schema                    |
| `bun run db:migrate`      | Apply committed migrations                                       |
| `bun run db:push`         | Sync a disposable development database directly                  |
| `bun run db:studio`       | Open Drizzle Studio                                              |

Husky runs lint-staged on commits. Database files and local secrets are ignored by Git. `.env.example` files document the configuration; `.env.schema` files validate it and generate types through Varlock. The scaffold currently uses the matching Drizzle ORM and Drizzle Kit `1.0.0-rc.5` versions; keep them aligned when upgrading.

The environment includes working email/password authentication, a protected dashboard, and a tRPC health check. AI providers, agent execution, calendar booking, support integrations, payments, and service delivery workflows still need implementation. Public deployment also needs production origins, secrets, durable database storage, and an email verification/recovery setup.
