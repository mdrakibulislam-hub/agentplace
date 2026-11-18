# Agentplace: current product and development context

Saved 18 November 2026 from the design conversation and the verified handoff artifacts. This is the starting context for a developer or coding agent taking over the existing repository.

## Start with the existing app

This Git repository is nested inside the user's `Agentplace` workspace. It already contains a Bun/Turborepo monorepo:

| Location          | Existing responsibility                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `apps/web`        | React/Vite, TanStack Router/Query/Form, auth forms, protected route, Storybook |
| `apps/server`     | Bun/Hono, Better Auth endpoints and tRPC transport                             |
| `packages/api`    | Shared tRPC procedures, context and starter router                             |
| `packages/auth`   | Better Auth with Drizzle adapter                                               |
| `packages/db`     | SQLite/Drizzle schema and migrations                                           |
| `packages/ui`     | Shared components and theme tokens                                             |
| `packages/config` | Shared TypeScript configuration                                                |

Source inspection at handoff found email/password auth enabled, an empty Better Auth plugin list, starter routes (`/`, `/login`, protected dashboard), and a starter API router. README reports functioning local auth/setup. Application runtime checks were not rerun as part of this documentation task.

Reuse this foundation. The design conversation does not authorize replacing the application stack or starting another repository. The initial `project-brief.md` describes agent discovery and service capabilities; the later, approved primary experience is the **project-based agent builder** described below. Scheduling, support and service delivery are capabilities agents may provide, not a reason to turn the builder home into a discovery marketplace.

## Read the handoff in this order

1. This document: decisions, source map, repo fit and remaining work.
2. [Agent contract](design-handoff/AGENT_CONTRACT.md): implementation behavior and constraints.
3. [Component guide](design-handoff/COMPONENTS.md): foundations, component APIs, covers, motion and elevation.
4. [Flow guide](design-handoff/FLOWS.md): auth, projects, builder, branding, publish, workspace and accessibility.
5. [Conversation record](CONVERSATION_CONTEXT.md): requirement history and original reference nodes.
6. Read only relevant parts of the JSON exports for the component/flow being implemented.

The current user request takes priority. Later explicit corrections supersede earlier iterations. Historical “before” exports and review boards are not current implementation targets. Current Figma is the visual reference; saved specs explain behavior. When the scaffold differs, the approved product decisions define the target while the existing architecture remains the integration base.

## Figma source and navigation

File: https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace

| Resource                        | Node                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| Foundations                     | [29:397](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=29-397)     |
| Organized components            | [32:2](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-2)         |
| Organized high fidelity screens | [50:2](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=50-2)         |
| Human component spec            | [209:1916](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-1916) |
| Product flow spec               | [209:7141](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-7141) |
| Agent spec                      | [213:2020](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=213-2020) |
| Cover variants                  | [130:1323](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323) |
| Spring recipes                  | [214:2034](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=214-2034) |
| Ambient gradient                | [237:1980](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980) |
| Exact native ambient cycle      | [242:1966](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=242-1966) |

Screens are grouped into login/signup, OTP, project start/switch, filter/search, project actions, builder/configuration, branding/covers, publishing, workspace settings and reference copies. `screens.json` maps the 34 preserved product frames. Components are grouped into numbered families; the latest snapshot has 97 top-level component definitions, 395 variables, 25 text styles and three elevation styles. Counts describe this snapshot, not a constraint on future development.

Canonical entry examples: login `53:8`, signup `53:208`, OTP empty `53:284`, OTP complete `186:5625`, OTP verifying `186:5647`, empty home `135:5210`, populated home `53:349`, builder working `54:1385`, builder ready `54:1624`, branding `54:1876`, branding without a cover `135:6409`. `186:5603` is an OTP review copy, not the canonical entry.

## Approved product structure

### Authentication

Support the designed login/signup experience with email/password and a Google path. Keep Forgot password in the password-label row. Create an account is a secondary button. Use soft original input/placeholder styling; resting inputs must not both look focused. Implement visibility toggling, field validation, disabled/loading/error states and stable submit widths.

Signup verification uses six OTP digits, with empty/partial, complete and processing states. Treat the code as a string, preserve leading zeroes, support full-code paste/autofill and numeric entry, advance/backspace correctly, and disable duplicate requests. Actual server outcomes determine success/failure; the Figma processing timer is illustrative. Include resend cooldown, expiry, incorrect-code and transport recovery.

All login, signup and OTP screens use the original client-logo footer and the shared bottom color wash. Preserve vector logos, proportions and the desktop 48px bottom inset. Do not replace logos with typed brand names.

### Project home

After login, show a welcoming project home **without a sidebar**. Lead with “Start a new project” and a prompt composer, followed by suggestion chips and recent projects. An empty-workspace state helps the user create their first project. A suggestion inserts an editable starter prompt; Create project submits it once. Entering an existing project or creating one opens its builder.

Project cards put Published/Unpublished beside the name, with edited time below. Overflow is a filled three-dot icon, tertiary at rest and primary on hover. Show the contextual dropdown. Keep card cover, status, navigation and overflow actions independent. All-projects filter, status filters, search results and no-results states use reusable menu/combobox patterns: heading, optional descriptions, trailing tags/checks and clear/close actions.

Latest source-picker refinement (18 November): [Add website or file](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=299-1996) is a compact 480 × 372 dialog with a full-width URL input that submits on Enter, a divider, and an accessible file picker and drop area. Reuse `SourceAttachmentDialog` in Storybook and project home. Validate HTTP(S) addresses and PDF/DOCX/TXT/MD/CSV selections up to 10 MB; keep callback failures recoverable. The current home flow stores URL/file-name context only, so server upload, file ingestion and website import remain separate work. The [new-project prompt](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1015) Create project action has 16px left and right padding.

### Project builder and preview

The builder has a project-scoped sidebar for chat, skills, Instructions.md, history and branding. The user creates/refines the agent by chatting. Show real working state, first draft ready and ongoing editing; then show the agent preview on the right. Preserve cancellation/retry/error contracts rather than inventing fixed processing durations.

Latest sidebar correction (18 November): conversations and New chat sit below All projects. Chat is opened through those controls; remove the duplicate Chat link from project tools in all five [navigation states](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1206). Keep Skills, Instructions.md, History and Branding, 32px conversation/tool rows, and the single left-aligned Project access action at the bottom. Chat remains an internal builder state and must stay reachable through existing conversations, New chat and the mobile conversation menu.

The preview supports testing the draft. Its Call button sits **outside and beside** the prompt input, with generous horizontal padding. It is not placed inside the composer. The reviewed controls are 48px high, with an 8px prompt-to-call gap and 24px call-button side padding.

Branding separates company logo, agent avatar and project/agent cover; it also controls color and typography/style. Reuse the uploaded cover where appropriate in project cards and agent previews. Keep current draft, saved state, published version and live pointer distinct. Editing or saving a draft does not publish it.

### Global header and workspace

Provide quick project switching, credits, settings and account access in a global header. Settings include billing, workspace skills, plugins, staff invitations and roles/access assignment. Workspace settings are not scoped accidentally to the current project; project bindings/permissions are explicit.

The documented role model is workspace Owner/Admin/Member plus project Editor/Viewer. Implement server-side authorization using the detailed contract; a hidden client control is not authorization. Invitations and integration connections need pending/failure/revocation behavior.

Credits use a small donut in the header and a compact remaining-credit bar in billing. Derive both from the same real remaining/allocation values and clamp the ratio. The sample 1,985/2,000 and 15 used are examples only. Unknown/zero allocation must not divide by zero.

## Visual decisions that must survive implementation

- **SF Pro only** for product typography. Poppins was explicitly replaced. Named weights in the Figma styles are Regular 400, Medium 510, Semibold 590, Bold 700; inspect the real font axes/assets when implementing.
- **Reicon** SVG icons from https://reicon.dev/icons. Most compact UI icons are 16px; the source master grid uses 20px masters. Preserve suitable hit areas and standard/simple icon shapes. Original logos and the A mascot remain original artwork.
- **Semantic tokens** for foreground, background, card, action/default, muted, bold, border and focus. Tailwind-compatible primitive colors may sit behind aliases. Keep app and Storybook on the same CSS token source and map the AP export into the existing architecture.
- Resting inputs use soft gray fill, subtle border and subdued placeholders. Only the current field gets focus emphasis.
- Keep related buttons grouped: about 12px internal action gaps inside a 24px parent form rhythm. Avoid oversized settings rows, tall empty cards, large numbers and excessive vertical whitespace.
- Professional compact live/published feedback, menu alignment, smaller credit numbers and consistent leading/trailing icon alignment matter; do not revert them to generic oversized dashboard components.

## Latest cover rule: preserve this exactly

`AP / Media / Project cover` has three variants: `Empty`, `Added`, `Default-mascot`.

| Context         | No uploaded asset at rest | Uploaded asset at rest  | Editable hover/focus         |
| --------------- | ------------------------- | ----------------------- | ---------------------------- |
| Homepage card   | Default-mascot            | Added with actual image | Empty upload/edit affordance |
| Branding upload | Empty                     | Added with actual image | Empty upload/edit affordance |

On leave/blur, recompute from the **current** asset and context. Hover never removes or changes `coverAssetId`, persists a variant name or starts uploading. Upload cancellation/failure retains the prior image. Successful removal yields different contextual fallbacks: mascot on home, empty upload in branding. Publish separately.

Use keyboard parity, an explicit touch action and edit permissions. A cover-edit click must not bubble into Open project. Read-only cards, public visitor previews and picker thumbnails do not expose upload affordances. Crossfade about 120ms; reduced motion changes immediately. The existing Added sample is not a real uploaded file; actual implementation must bind the real asset and preserve crop/focal point.

The home card masters were updated to mascot fallback; 24 card instances across the design inherited it. Branding empty remains Empty, and uploaded branding examples remain Added with scoped hover transitions. See [cover-presentation.json](design-handoff/cover-presentation.json) for the machine-readable matrix.

## Motion, ambient color and elevation

The desired feel is restrained, Apple-inspired, physics-based motion: responsive input, short travel and a gentle settle. It is not an Apple system specification or a request to bounce whole pages.

| Spring  | Mass | Stiffness | Damping |
| ------- | ---- | --------- | ------- |
| Press   | 1    | 520       | 38      |
| Popover | 1    | 420       | 32      |
| Dialog  | 1    | 360       | 30      |
| Layout  | 1    | 320       | 32      |
| Success | 1    | 480       | 30      |

Press visual scale is 0.97. Popovers start around scale 0.97/y=6px and settle in about 340ms; dialogs use 0.98/y=12px and about 380ms. Opacity is monotonic in 140–160ms. Exit is brisk without bounce. Retarget interrupted motion from current position/velocity and keep layout/hit boxes stable. Respect OS/app reduced-motion preferences before first paint.

The original A mascot blinks and makes a small looping hop for real chat work. Stop on completion/error/cancel and pause when hidden. It is not fake percentage progress. Preserve the original vector, not a replacement illustration. The compact example's hop is about 2.64px; native and prototype timelines differ, as documented in the component guide.

The bottom ambient wash uses mint/cyan/sky colors, a broad 300px blur at desktop, constant opacity and a very slow inner drift. It appears on the 19 current login/signup/OTP/home states, not automatically on builder/settings/visitor screens. Keep it bottom-anchored, below all content and scrims, clipped, noninteractive and hidden from accessibility APIs.

The runtime cycle is exactly 32 seconds, ease-in-out, seamless, with no bounce, brightness pulse or pointer tracking. Use Still for reduced motion and pause when hidden/offscreen. Figma has a four-phase prototype loop of approximately 32 seconds and a separate exact native preview. This is an editable shader-like gradient, not an account-library custom shader. The separate preview avoids Figma nested-instance clip-duration limitations. The earlier reference nodes `189:13473`/`189:13476` were observed removed during that task; use current component and home links instead.

Elevation uses **Resting**, **Panel** and **Overlay** with faint layered neutral shadows and negative spread. Keep real borders separate; remove the old hard shadow outline and single heavy dialog shadow. Inputs and nested content stay flat. Exact values are in [elevation.json](design-handoff/elevation.json) and the component guide. Do not stack multiple elevation levels on one surface or animate large blur kernels each frame.

## Artifact map

The copied [bundle README](design-handoff/README.md) indexes the complete snapshot. Important files:

| Files                                                                          | Purpose                                                          |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `COMPONENTS.md`, `FLOWS.md`, `AGENT_CONTRACT.md`                               | Mirrors of the native implementation specs                       |
| `tokens.json`                                                                  | Collections, aliases, modes, scopes, code syntax and text styles |
| `components.json`, `screens.json`                                              | Stable IDs, properties, variants and screen groups               |
| `interactions.json`, `cover-presentation.json`                                 | Behavior and the latest cover state matrix                       |
| `motion.json`, `motion.presets.ts`, `elevation.json`                           | Motion and shadow reference values                               |
| `ambient-gradient.css`, `.mjs`, `.html`                                        | Standalone implementation references; adapt deliberately         |
| `ambient-flow.mp4`, `ambient-motion-contact.png`, `motion-lab.mp4`, phase PNGs | Native animation diagnostic renders                              |
| `validation.json`, `ambient-elevation.json`                                    | Design verification evidence and scope limits                    |
| `MANIFEST.json`                                                                | Copied source-file sizes and SHA-256 hashes                      |
| `before-layout.json`, `cover-presentation-before.json`, `organization.json`    | Historical organization/audit evidence                           |

Reference HTML/JS/CSS/TypeScript are not imported by the app merely because they are copied here. Use the existing framework and component boundaries. Some historical reports contain paths from the original workstation; use these repository-local files and Figma IDs, not those paths as dependencies.

## Known implementation work

The scaffold is not yet the designed product. Reconcile current source before planning individual slices. Design/prototype evidence does not implement:

- Google authentication, verification/recovery email, six-digit OTP delivery/expiry/resend/error handling.
- Workspace/project persistence and permission enforcement; draft/live versioning; asset storage, cropping and uploads.
- AI provider/agent execution, streaming jobs, cancellation/retry/history and real preview behavior.
- Publishing/public URLs and unpublishing lifecycle.
- Voice/call provider behavior, scheduling/service/support integrations.
- Billing/credits/entitlements, staff invitations and plugin consent/connections.
- Reviewed mobile/tablet layouts and full dark-mode contrast/performance.

The provider choices and production services are not fixed by this conversation. Do not invent completed integrations, endpoints or demo values as real data. Reuse current service boundaries, implement honest UI/async contracts, and surface a concrete unresolved decision only when it blocks the active implementation slice.

## Suggested development sequence

1. Reconcile shared tokens, SF Pro, Reicon and component states in `packages/ui`; update Storybook with the required examples.
2. Implement auth, signup, recovery and OTP with real state/error handling; match the client-logo and ambient shell.
3. Implement project persistence and home: empty/populated, suggestions, search/filter/switcher/actions and contextual covers.
4. Implement project builder shell, chat/job lifecycle, instructions, skills, history and draft preview.
5. Implement branding/assets, draft save/versioning and publish/unpublish boundaries.
6. Implement workspace billing/credits, skills/plugins, staff and permissions.
7. Review responsive/accessibility/reduced-motion behavior and verify each integrated service before release.

This is an integration order, not a mandate to implement the entire product in one change. Preserve finished work and validate coherent slices.

## Validation and commands

Use `README.md` for the current setup and commands. Snapshot commands include `bun run dev`, `bun run storybook`, `bun run check`, `bun run check-types`, `bun run build`, and `bun run build-storybook`. Setup is documented there; do not overwrite existing environment files. Default local ports are web 4101, API 4100, Storybook 6006.

For implementation changes, run the relevant repository checks and meaningful interaction validation: OTP paste/leading zeroes/duplicate submit, project identity and permission boundaries, draft versus published state, cover hover restoration and upload failure, correct credit ratios, focus return, keyboard/touch behavior and reduced motion. Confirm actual visual states against current Figma. Report implemented, verified and missing behavior separately.

## Context limitations

The conversation's text and resolved decisions are recorded here and in the chronological log. Original image attachment pixels were not available to archive; their `[Image #…]` references are not reconstructable screenshots. Current Figma is the visual source, and the included diagnostic PNGs/MP4s are actual saved renders, not the original attachments. Earlier assistant discussion is preserved through verified outcomes and artifacts rather than represented as a verbatim full transcript.
