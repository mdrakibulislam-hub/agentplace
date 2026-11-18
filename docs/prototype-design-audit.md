# Agentplace prototype design audit

Reviewed 18 November 2026. The independent audit covered all **33 current product frames** in Figma’s High fidelity screens page. The OTP reference copy is historical. The live Figma file and the interaction rules are the sources for this review. [Figma page](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=50-2) · [Flow guide](design-handoff/FLOWS.md)

Captured each live Figma frame and its matching fullscreen Storybook story at 1440 × 960. Chromium screenshots used device scale 1, light mode, reduced motion, and loaded SF Pro. The table reports the mean absolute RGB difference per channel on the 0–255 scale after converting the browser screenshots from their embedded display profile to sRGB. An image average can hide localized differences. Layout and interaction observations below were checked separately.

Run `bun run storybook` and open `/iframe.html?viewMode=story&id=<story-id>&globals=theme:light;motion:reduced` on port 6006 to reproduce a reference state. The product stories render the compositions used by the application.

| Figma frame                                                                                                    | Story ID                                              | RGB delta |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | --------: |
| **Authentication**                                                                                             |                                                       |           |
| [Login with email](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-8)                | `product-authentication--login`                       |     1.044 |
| [Login with Google last used](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-119)   | `product-authentication--google-last-used`            |     1.044 |
| [Create account](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-208)                | `product-authentication--signup`                      |     0.995 |
| [Verification empty](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-284)            | `product-authentication--verification-empty`          |     1.159 |
| [Verification entered](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5625)        | `product-authentication--verification-entered`        |     1.174 |
| [Verification processing](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5647)     | `product-authentication--verification-processing`     |     1.158 |
| **Project home**                                                                                               |                                                       |           |
| [No projects yet](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5210)             | `product-projects--no-projects`                       |     1.589 |
| [Recent projects](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-349)               | `product-projects--recent-projects`                   |     1.515 |
| [Quick project switcher](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=59-2476)       | `product-projects--quick-switcher`                    |     1.750 |
| [All projects filter](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5533)         | `product-projects--all-projects-filter`               |     1.566 |
| [Published filter](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5687)            | `product-projects--published-filter`                  |     1.511 |
| [Unpublished filter](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5858)          | `product-projects--unpublished-filter`                |     1.525 |
| [Search results](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-6048)              | `product-projects--search-results`                    |     1.803 |
| [Search without matches](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-6257)      | `product-projects--search-no-results`                 |     1.788 |
| [Project actions](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5332)             | `product-projects--project-actions`                   |     1.619 |
| [Live link copied](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=140-4874)            | `product-projects--link-copied`                       |     1.515 |
| [Delete confirmation](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=140-4901)         | `product-projects--delete-confirmation`               |     8.889 |
| [Delete result](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=140-4928)               | `product-projects--delete-result`                     |     1.537 |
| **Agent builder**                                                                                              |                                                       |           |
| [Creating the first draft](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1385)     | `product-agent-builder--creating-draft`               |     1.477 |
| [Chat and agent preview](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1624)       | `product-agent-builder--chat-and-preview`             |     1.406 |
| [Instructions.md](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-1158)              | `product-agent-builder--instructions`                 |     2.731 |
| [Project skills](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-1400)               | `product-agent-builder--project-skills`               |     1.233 |
| [Version history](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-1664)              | `product-agent-builder--version-history`              |     2.440 |
| [Branding without cover](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-6409)      | `product-agent-builder--branding-without-cover`       |     1.558 |
| [Branding with cover](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1876)          | `product-agent-builder--branding-with-cover`          |     1.540 |
| [Replace or remove cover](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=140-4811)     | `product-agent-builder--replace-or-remove-cover`      |     1.697 |
| [Review and publish](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-1936)           | `product-agent-builder--review-and-publish`           |    14.040 |
| [Published with draft changes](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-2270) | `product-agent-builder--published-with-draft-changes` |     1.985 |
| [Unpublish confirmation](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-2585)       | `product-agent-builder--unpublish-confirmation`       |    16.462 |
| **Workspace settings**                                                                                         |                                                       |           |
| [Billing and usage](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=59-2616)            | `product-workspace-settings--billing-and-usage`       |     2.103 |
| [Staff and roles](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=59-2860)              | `product-workspace-settings--staff-and-roles`         |     2.708 |
| [Skills library](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=59-3249)               | `product-workspace-settings--skills-library`          |     2.647 |
| [Plugins and connections](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=59-3467)      | `product-workspace-settings--plugins`                 |     2.659 |

## Layout findings

- Authentication matches the 400px card width and frame heights of 568px for login, 560px for signup, and 496px for verification. The client logo artwork sits 48px above the bottom edge.
- Home matches the 64px header, the 768 × 144 prompt at (336, 204), and the 1088px project region. The populated cards start at y=544. The independent recheck confirmed the switcher at (240, 72), filter at (980, 536), search at (880, 536), and card actions at (267, 436).
- Builder matches the 224px project navigation and the 680px preview region beginning at x=760. The preview fills y=128 through y=960. The publish review and unpublish dialogs measure 560 × 684 and 496 × 378 respectively. The corrected 1440px captures have no horizontal page overflow.
- Workspace settings use the same white header as the builder and keep the 224px sidebar. Sidebar selection, section titles, split panels, and row controls follow the respective Figma frames.
- Modal backdrops use the Figma opacity values of 20% for home delete and 55% for builder publication. The three modal RGB averages are sensitive to the browser screenshot profile’s treatment of translucent compositing across the full frame. For example, the unconverted home delete backdrop is RGB 191 over the gray canvas in the browser screenshot and RGB 194 in the Figma export. Dialog positioning and foreground content were compared separately.

Visible differences remain in text rasterization, some control and border rendering, and the ambient wash’s saturation. Verification uses fictional sample code and email in Storybook. The local app derives visitor URLs from routes, and the billing fill uses the displayed remaining-to-allocation ratio. The visual audit supports desktop design alignment, with the measured differences recorded above.

## Running prototype checks

The independent browser checks used the Vite app on port 4101 and a separate local workspace for audit data.

| Flow                       | Observed result                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Signup and verification    | A six-digit paste retained the initial zero. Verify was disabled when empty, and the digit fields locked during processing. Completion opened an empty project home.                                                                                                                                                                                         |
| Project creation           | A suggestion inserted editable prompt text. Submitting opened the first-draft state for the new project. Completing that state showed the visitor preview; entering a suggestion and pressing Send displayed a local reply.                                                                                                                                  |
| Discovery and switching    | End and Enter selected the Unpublished filter. Search combined with that filter, survived Escape, and clearing the query retained the filter. Typing in the quick switcher, then pressing Arrow Down and Enter, opened the matched project.                                                                                                                  |
| Project deletion           | Cancel received initial focus, Escape restored the relevant card action trigger, and confirming removed the selected audit project and moved focus to the projects section.                                                                                                                                                                                  |
| Branding and publication   | A card without a cover showed the mascot. Hover showed the upload affordance. Choosing a local image left the route on home and carried the image into Branding. The published visitor retained the old cover until Publish update.                                                                                                                          |
| Draft and version history  | Saving changed instructions created a distinct version in the history list. Published content stayed bound to the saved live snapshot during draft edits.                                                                                                                                                                                                    |
| Visitor access             | A publish dialog focused its secondary action and Escape returned focus to Publish. Publishing opened a browser-local visitor link in a separate tab. A signed-out visitor was gated when sign-in was required and returned to the agent after signing in. Unpublishing hid the visitor route and retained the project.                                      |
| Plugin connection          | Escape from Calendar consent restored focus to Connect Calendar. Confirming connection and saving Booking Assistant access announced success, and reopening settings after navigating home retained the saved access.                                                                                                                                        |
| Motion and shell placement | Auth showed one pointer-transparent 32-second wash and a 32-second logo animation timeline. Home showed one 32-second wash. Builder, settings and the standalone visitor route had no page wash. First-draft mascot eyelid poses changed over a sampled cycle. System reduced motion removed the mascot tracks and disabled the working diffusion animation. |
| Narrow screen              | Smoke-checked login, recent projects, chat, branding and staff at 390px. The page had no horizontal overflow. Builder tabs live in a horizontally scrollable navigation strip. Figma supplies desktop reference frames.                                                                                                                                      |

The browser-local prototype simulates sign-in, generation, publication and workspace integrations. The interaction checks validate those UI flows and their local state. The Storybook copied-link frame was visually compared. Native clipboard delivery, external integrations, and server permission enforcement fall outside this audit.
