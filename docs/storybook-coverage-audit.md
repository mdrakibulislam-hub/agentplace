# Storybook coverage and fidelity audit

Audit snapshot: 18 November 2026. This separates source completeness, measured geometry, executed behavior and pixel identity. Portable evidence is preserved in [the Storybook review report](storybook-review/README.md) and its [machine-readable results](storybook-review/results.json). Current source and captured evidence take precedence over historical claims.

## Source boundary

- Canonical inputs: Figma foundations `29:397`, components `32:2`, product experience `50:2`; current native component/flow/agent specs; `docs/design-handoff/components.json` and `tokens.json`.
- The handoff lists **97 component definitions and 169 actual variants**. Do not use Cartesian multiplication: mascot motion has seven authored variants, and ambient has four Flow phases plus Still/0.
- Captured current components metadata resolves all 97 canonical IDs. Its XML includes 151 variant nodes; brand/motion sets are collapsed in that broad response. Their missing nested XML rows do not prove deleted variants.
- `169:1886` is a native mascot preview frame, `214:2034` is a spring recipe board, and `242:1966` is an ambient native preview. These need recipe/demo coverage, but are not extra reusable component definitions.
- Family 90 reference/QA entries `32:759`, `35:453`, `45:645`, `84:1161` are historical/reference frames. They are not current component masters or additional product targets.

## Current source coverage

The reproducible AST audit is `bun run scripts/audit-storybook-coverage.ts --write`. It reads actual story exports and inherited/per-story Figma metadata rather than treating raw story counts as coverage. Its machine-readable result is [storybook-coverage.json](storybook-coverage.json).

- **97/97 masters and 169/169 authored variant IDs are explicitly mapped.** No missing definitions, variants, wrong variant owners, undocumented definitions, token/style IDs, local asset files or declared asset hashes were found.
- Structural coverage is complete. Visual fidelity and interaction execution are separate gates; the report intentionally does not certify them from metadata.
- The latest source snapshot has 312 story exports, 24 play functions, and 69 registered local assets. These are inventory counts, not passing-test counts.

| Family                            | Canonical definitions | Authored variants | Linked definitions |
| --------------------------------- | --------------------: | ----------------: | -----------------: |
| 01 · Brand                        |                     2 |                 2 |                  2 |
| 02 · Reicon icons                 |                    48 |                 0 |                 48 |
| 03 · Actions                      |                     6 |                62 |                  6 |
| 04 · Forms & selection            |                     7 |                37 |                  7 |
| 05 · Navigation & app shell       |                     5 |                19 |                  5 |
| 06 · Menus & overlays             |                     9 |                10 |                  9 |
| 07 · Project & builder            |                     5 |                 5 |                  5 |
| 08 · Data & feedback              |                    10 |                18 |                 10 |
| 09 · Motion & mascot              |                     4 |                11 |                  4 |
| 11 · Ambient surfaces & elevation |                     1 |                 5 |                  1 |

## Definition-by-definition source map

Every master below has story coverage. A link proves source traceability; rendered accuracy and behavior still require review.

| Figma master                                                                                  | Definition                               | Variants | Story source                                                 |
| --------------------------------------------------------------------------------------------- | ---------------------------------------- | -------: | ------------------------------------------------------------ |
| [45:643](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=45-643)       | AP / Logo                                |        2 | `apps/web/src/stories/ap-logo.stories.tsx`                   |
| [195:1678](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=195-1678)   | AP / Auth / Client logos                 |        0 | `apps/web/src/stories/ap-client-logos.stories.tsx`           |
| [51:1017](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=51-1017)     | AP / Icon / Google                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:634](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-634)       | AP / Icon / arrow-left                   |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:569](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-569)       | AP / Icon / arrow-left-to-line           |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:14](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-14)         | AP / Icon / arrow-right                  |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:10](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-10)         | AP / Icon / arrow-up                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:523](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-523)       | AP / Icon / briefcase-business           |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:623](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-623)       | AP / Icon / calendar                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:18](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-18)         | AP / Icon / check                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:7](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-7)           | AP / Icon / chevron-down                 |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4407](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4407)     | AP / Icon / chevron-up                   |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:529](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-529)       | AP / Icon / chevrons-up-down             |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:21](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-21)         | AP / Icon / close                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:581](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-581)       | AP / Icon / copy                         |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:601](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-601)       | AP / Icon / credit-card                  |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:538](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-538)       | AP / Icon / database                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4704](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4704)     | AP / Icon / download                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:615](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-615)       | AP / Icon / external-link                |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:611](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-611)       | AP / Icon / eye                          |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4410](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4410)     | AP / Icon / eye-off                      |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:546](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-546)       | AP / Icon / file-text                    |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4721](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4721)     | AP / Icon / filter                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:629](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-629)       | AP / Icon / globe                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:642](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-642)       | AP / Icon / history                      |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:585](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-585)       | AP / Icon / lightbulb                    |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:553](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-553)       | AP / Icon / link                         |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:28](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-28)         | AP / Icon / loader                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4715](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4715)     | AP / Icon / lock                         |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:565](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-565)       | AP / Icon / mail                         |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:606](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-606)       | AP / Icon / message-circle-question-mark |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:598](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-598)       | AP / Icon / message-square               |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:652](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-652)       | AP / Icon / monitor                      |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:533](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-533)       | AP / Icon / more-horizontal              |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:574](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-574)       | AP / Icon / palette                      |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:593](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-593)       | AP / Icon / panel-left-close             |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:590](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-590)       | AP / Icon / paperclip                    |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [99:1477](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=99-1477)     | AP / Icon / phone                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:3](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-3)           | AP / Icon / plus                         |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:543](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-543)       | AP / Icon / puzzle                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4718](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4718)     | AP / Icon / refresh                      |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:24](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-24)         | AP / Icon / search                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:561](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-561)       | AP / Icon / settings                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:638](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-638)       | AP / Icon / shield-check                 |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:557](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-557)       | AP / Icon / square-pen                   |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4707](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4707)     | AP / Icon / trash                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4701](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4701)     | AP / Icon / upload                       |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [82:4710](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4710)     | AP / Icon / user-add                     |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:646](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-646)       | AP / Icon / users                        |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [49:620](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-620)       | AP / Icon / zap                          |        0 | `apps/web/src/stories/ap-icons.stories.tsx`                  |
| [32:43](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-43)         | AP / Button / Primary                    |       12 | `apps/web/src/stories/button.stories.tsx`                    |
| [32:152](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-152)       | AP / Button / Secondary                  |       12 | `apps/web/src/stories/ap-button-secondary.stories.tsx`       |
| [32:261](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-261)       | AP / Button / Ghost                      |       12 | `apps/web/src/stories/ap-button-ghost.stories.tsx`           |
| [32:370](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-370)       | AP / Button / Danger                     |       12 | `apps/web/src/stories/ap-button-danger.stories.tsx`          |
| [32:479](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-479)       | AP / Icon button                         |       12 | `apps/web/src/stories/ap-icon-button.stories.tsx`            |
| [108:1306](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=108-1306)   | AP / Product / Project actions           |        2 | `apps/web/src/stories/ap-project-actions.stories.tsx`        |
| [32:532](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-532)       | AP / Input                               |        6 | `apps/web/src/stories/input.stories.tsx`                     |
| [32:569](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-569)       | AP / Textarea                            |        6 | `apps/web/src/stories/ap-textarea.stories.tsx`               |
| [32:600](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-600)       | AP / Select                              |        6 | `apps/web/src/stories/ap-select.stories.tsx`                 |
| [51:1022](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=51-1022)     | AP / Product / Password field            |        0 | `apps/web/src/stories/ap-password.stories.tsx`               |
| [185:1606](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=185-1606)   | AP / Form / Six-digit OTP                |        3 | `apps/web/src/stories/ap-otp.stories.tsx`                    |
| [32:671](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-671)       | AP / Checkbox                            |        8 | `apps/web/src/stories/ap-checkbox.stories.tsx`               |
| [32:692](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-692)       | AP / Switch                              |        8 | `apps/web/src/stories/ap-switch.stories.tsx`                 |
| [116:11267](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=116-11267) | AP / Product / Global header             |        2 | `apps/web/src/stories/ap/global-header.stories.tsx`          |
| [49:1206](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1206)     | AP / Product / Project navigation        |        5 | `apps/web/src/stories/ap/project-navigation.stories.tsx`     |
| [49:1471](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1471)     | AP / Product / Settings navigation       |        4 | `apps/web/src/stories/ap/settings-navigation.stories.tsx`    |
| [49:1533](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1533)     | AP / Product / Project toolbar           |        3 | `apps/web/src/stories/ap/project-toolbar.stories.tsx`        |
| [32:706](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-706)       | AP / Tab                                 |        5 | `apps/web/src/stories/ap/tab.stories.tsx`                    |
| [32:717](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-717)       | AP / Menu item                           |        5 | `apps/web/src/stories/ap/menu-item.stories.tsx`              |
| [130:1320](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1320)   | AP / Menu / Item                         |        4 | `apps/web/src/stories/ap/rich-menu-item.stories.tsx`         |
| [131:1318](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=131-1318)   | AP / Menu / Project switcher             |        0 | `apps/web/src/stories/ap/project-switcher.stories.tsx`       |
| [131:1414](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=131-1414)   | AP / Menu / Project filter               |        0 | `apps/web/src/stories/ap/project-filter.stories.tsx`         |
| [131:1460](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=131-1460)   | AP / Menu / Project actions              |        0 | `apps/web/src/stories/ap/project-actions-menu.stories.tsx`   |
| [131:1545](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=131-1545)   | AP / Menu / Project search results       |        0 | `apps/web/src/stories/ap/project-search-results.stories.tsx` |
| [131:1577](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=131-1577)   | AP / Menu / Project search empty         |        0 | `apps/web/src/stories/ap/project-search-empty.stories.tsx`   |
| [139:1490](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=139-1490)   | AP / Menu / Cover actions                |        0 | `apps/web/src/stories/ap/cover-actions-menu.stories.tsx`     |
| [32:744](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-744)       | AP / Tooltip                             |        1 | `apps/web/src/stories/ap/tooltip.stories.tsx`                |
| [49:1705](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1705)     | AP / Product / Project card              |        2 | `apps/web/src/stories/ap/project-card.stories.tsx`           |
| [130:1323](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323)   | AP / Media / Project cover               |        3 | `apps/web/src/stories/ap/project-cover.stories.tsx`          |
| [52:1015](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1015)     | AP / Product / New project prompt        |        0 | `apps/web/src/stories/ap/new-project-prompt.stories.tsx`     |
| [49:1534](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1534)     | AP / Product / Chat composer             |        0 | `apps/web/src/stories/ap/chat-composer.stories.tsx`          |
| [49:1565](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1565)     | AP / Product / Agent preview             |        0 | `apps/web/src/stories/ap/agent-preview.stories.tsx`          |
| [32:649](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-649)       | AP / Badge                               |        6 | `apps/web/src/stories/ap-badge.stories.tsx`                  |
| [32:659](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-659)       | AP / Avatar                              |        3 | `apps/web/src/stories/ap-avatar.stories.tsx`                 |
| [32:748](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-748)       | AP / Spinner                             |        2 | `apps/web/src/stories/ap-spinner.stories.tsx`                |
| [32:758](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-758)       | AP / Surface                             |        3 | `apps/web/src/stories/ap-surface.stories.tsx`                |
| [129:1352](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=129-1352)   | AP / Progress / Credit ring              |        0 | `apps/web/src/stories/ap-credit-ring.stories.tsx`            |
| [129:1355](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=129-1355)   | AP / Progress / Credit balance           |        0 | `apps/web/src/stories/ap-credit-balance.stories.tsx`         |
| [52:1090](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1090)     | AP / Product / Capability row            |        2 | `apps/web/src/stories/ap-capability-row.stories.tsx`         |
| [52:1091](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1091)     | AP / Product / Version row               |        0 | `apps/web/src/stories/ap-version-row.stories.tsx`            |
| [52:1109](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1109)     | AP / Product / Staff row                 |        0 | `apps/web/src/stories/ap-staff-row.stories.tsx`              |
| [58:1060](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=58-1060)     | AP / Product / Library item              |        2 | `apps/web/src/stories/ap-library-item.stories.tsx`           |
| [166:1528](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=166-1528)   | AP / Brand / A mascot artwork            |        2 | `apps/web/src/stories/ap-mascot-artwork.stories.tsx`         |
| [166:1812](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=166-1812)   | AP / Motion / A mascot working           |        7 | `apps/web/src/stories/ap-working-mascot.stories.tsx`         |
| [169:1570](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1570)   | AP / Motion / A mascot native artwork    |        0 | `apps/web/src/stories/ap-native-mascot.stories.tsx`          |
| [169:1853](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1853)   | AP / Chat / Working indicator            |        2 | `apps/web/src/stories/ap-working-indicator.stories.tsx`      |
| [237:1980](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980)   | AP / Ambient / Bottom gradient           |        5 | `apps/web/src/stories/ap-ambient.stories.tsx`                |

## Verified foundation evidence

- All 395 variable IDs, names, values and WEB syntax were read from the live file by resolved ID. They match the handoff snapshot exactly: 165 primitives, 66 source colors, 58 semantic colors and 106 metrics.
- Browser audit checked every variable in both modes: **790 values, zero mismatches**. It checks actual computed CSS values against the independent live-captured values, normalizing browser color serialization.
- All 25 named text styles were read from the live file. Browser checks proved exact declared font size, line height and weight for all 25.
- Source and semantic tokens share four original WEB names. Source values are preserved under `--ap-source-*`; semantic public names retain the original API. Numeric primitives remain unitless; consuming length/duration roles apply px/ms.
- Complete light/dark, semantic/source/primitive/metric, typography, spacing, radius, elevation and motion-contract stories exist. Search was exercised with 3 ambient results, no-results, and restoration to all 58 semantic roles.
- The canonical foundation specimen renders at its exact authored 1600 × 2500 geometry. Its dark preview explicitly selects dark variable mode; shadow stacks retain negative spread instead of using lossy CSS drop-shadow filters.
- Portable evidence: [foundation browser checks](storybook-review/foundation-browser-checks.json) and [color-managed foundation comparison](storybook-review/comparisons/foundations.png). Original temporary captures remain local provenance inputs; the review folder provides shareable artifacts without relying on those paths.

## Current fidelity and interaction findings

1. **The actual SF Pro source is now available locally.** The official Apple package was downloaded and extracted read-only, without system installation or glyph changes. The original variable face is served locally from an ignored directory; Chrome reports family `SF Pro`, PostScript `SFPro-Regular`, `isCustomFont:true`. At 14px/wght510/wdth100 and automatic optical sizing, Continue is 60.90625px and Unpublish is 68.1875px; the Figma text frames allocate 61/69 whole pixels. Keep optical sizing automatic; forcing default optical size 28 shrinks the labels. All 25 declared type-style sizes/line heights/weights still pass after the real face loads. See [the font setup and license guide](storybook-fonts.md). This solves the system-font fallback, but final component-bound checks must use the real face. No Apple font binary is committed or approved for public website embedding by this setup.
2. **The five missing icon exports are resolved.** The user supplied exact Figma exports for lock, panel-left-close, refresh, square-pen and user-add. The manifest records their canonical IDs and SHA-256 values. The structural audit verifies all five hashes, all registered files are nonempty, and no asset remains marked provisional. Effective geometry and design slots still belong in rendered review.
3. **Cover-matrix and keyboard checks pass in actual executed plays.** The 11 recorded composition plays include both cover contexts with/without images, hover/focus/blur restoration, local-file upload, cancellation/failure preservation, removal, read-only restrictions, current-image replacement and project-card click isolation. Tabs have Arrow/Home/End and disabled-skipping assertions. These are isolated component outcomes, not production asset storage or permission verification.
4. **Loading-width stability has an explicit API.** `reserveLoadingSpace` preserves intrinsic width before async work starts, while canonical static loading specimens retain their authored wider spinner geometry. A pending-request story asserts width stability, disabled/busy semantics and duplicate-submit prevention; resolution is explicit rather than a fake prototype timer.
5. **The scaffold-only story was removed from the AP library.** The original generic AgentCard remains in the app runtime, but its unrelated marketplace example no longer appears as an approved AP component story. The 97-definition inventory contains the supplied library, not that scaffold artifact.
6. **Literal pixel identity remains unproven.** The canonical 1600 × 2500 foundation board is rendered with the actual SF Pro face. Its color-managed sRGB comparison against Figma's 656 × 1024 screenshot has mean absolute RGB difference 1.8616/255. Earlier unnormalized color-profile comparisons are superseded by the portable report. Font rasterization, whole-pixel allocation, export scaling and shadow rendering affect this comparison. This is useful review evidence, not a claim that every pixel or every component variant is identical. Latest local screenshot: `/tmp/ap-foundations-overview-sfpro.png`; its comparison and diff share that prefix.
7. **Motion has actual lifecycle evidence with explicit limits.** Stories cover original mascot artwork, native artwork, all seven working variants, Loop/Reduced indicator, all five ambient variants and spring recipes. The latest browser artifact proves shared clocks, offscreen held-phase pause/resume, cancellation cleanup and reduced/preference restart behavior. Ambient endpoints were seeked; a complete live native loop and real document visibility transition remain unobserved. Native demonstration frames alone are not runtime proof.
8. **Interaction guidance is present for every master, and all 24 authored plays were executed successfully.** The source audit verifies documentation exists, and manual inspection finds keyboard, focus, async, fixture-boundary and reduced-motion guidance for the relevant families. Actual outcomes are 11 controls, 11 compositions and two root recipes. Isolated Storybook callbacks do not establish production backends or server-side permissions.

## Completion gate

- Regenerate the source audit after final edits and preserve its complete 97/97 master, 169/169 variant, 395-token and 25-style mapping.
- Verify every registered static asset at its effective rendered size and intended slot, with no temporary Figma runtime URLs or substituted artwork.
- Run all rendered comparisons using the official local SF Pro face, and resolve material component-bound/content/token differences rather than accepting source metadata alone.
- Record Biome, all-workspace type checks, production build, static Storybook build and every authored interaction play, including async, keyboard, portal, cover and reduced-motion cases.
- Verify native-frame recipe coverage separately from reusable component counts. Desktop Figma references do not establish dark/mobile acceptance; review those modes explicitly.
- Keep font binaries local and respect Apple's actual license restrictions. A static Storybook build copies public assets; ignoring source binaries in Git does not automatically remove them from build output.
- Keep product backend implementation separate: this Storybook library does not imply implemented Google auth, OTP delivery, project persistence, generation, uploads, publishing, billing or workspace authorization.

## Portable review signoff scopes

[The review folder](storybook-review/README.md) retains 122 controls/forms/data geometry comparisons, 118 root geometry/icon-size cases, 34 current-source composition-variant comparisons, all 24 executed play outcomes, shared-clock and lifecycle observations, and representative color-managed comparisons. The combined inventory links passing expected/actual outer bounds for **169/169 canonical authored variants**. Every composition case loads actual SF Pro; all 34 pass, with no source-unavailable rows. Unpublished card `49:1674` is verified against the exact current user-provided SVG, retained as review evidence with SHA-256 provenance. Its 362 × 228 export includes shadow padding around the 352 × 218 card surface. Bounds coverage does not establish every content pixel or interaction.

The newest shared-clock artifact proves zero clock delta across seven canonical/native tracks, held-phase offscreen pause/resume, cancellation cleanup and reduced/preference restart behavior. Historical pre-fix working-track drift is clearly labeled as superseded. A complete live native 6800ms loop and a real document.hidden transition remain unobserved; seeked endpoint tests are not mislabeled as wall-clock recordings.

Structural coverage is complete. Pixel identity is not certified: comparisons retain measurable renderer antialiasing/shadow residuals and make no “100% pixels equal” claim. [Final root signoff](storybook-review/final-signoff.json) records passing lint/format checks, all-workspace type checks, source coverage audit, application build and static Storybook build. All 24 actual play outcomes match the complete exported play inventory. Source fingerprints preserve the reviewed worktree; renderer/motion-observation limits remain explicit.
