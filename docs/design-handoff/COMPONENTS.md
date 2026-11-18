# Agentplace component implementation guide

Updated 18 November 2026. This file contains editable design references, not an implemented application.

Start with this guide, the [flow contract](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-7141) and the [agent contract](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=213-2020). Existing AP variables and component definitions are the source of truth. Canvas positions are for library navigation; they are not application layout coordinates.

## Find a family

| Family | Contents |
|---|---|
| [01 · Brand](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1916) | 2 assets |
| [02 · Reicon icons](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1920) | 48 assets |
| [03 · Actions](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1970) | 6 assets |
| [04 · Forms & selection](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1978) | 7 assets |
| [05 · Navigation & app shell](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1987) | 5 assets |
| [06 · Menus & overlays](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-1994) | 9 assets |
| [07 · Project & builder](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-2005) | 5 assets |
| [08 · Data & feedback](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-2012) | 10 assets |
| [09 · Motion & mascot](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-2024) | 5 assets |
| [10 · Spring motion recipes](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=214-2032) | Native animated press, popover and dialog examples |
| [11 · Ambient surfaces & elevation](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1978) | Bottom-gradient Flow/Still variants, native preview and elevation specimens |
| [90 · Reference & QA](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=210-2031) | 4 assets |

Read numbered families left to right, then down. Reference & QA holds previous review boards; it is not the implementation source. Component IDs and variant IDs were preserved during organization.

## Foundations and typography

Reuse AP / Semantic colors, AP / Metrics, AP / Primitives, local text styles and the three local elevation styles (Resting, Panel and Overlay). Map semantic names such as foreground/default, foreground/muted, background/default, background/secondary, card/background, muted/background, action/default, border/default and focus/ring to code variables. Keep primitive palette values behind aliases; do not replace semantic tokens with arbitrary Tailwind classes.

Use SF Pro throughout product text. Observed type sizes: body xs 12/16, sm 14/20, base 16/24, lg 18/28; headings sm 18/22, md 20/24, lg 24/28, xl 36/40, 2xl 48/52. The welcome display is 30/36. Existing variable-font weights are Regular 400, Medium 510, Semibold 590 and Bold 700. Preserve the named styles and supported font axes when matching to application font assets.

UI icons use Reicon. Compact icons are generally 16px; main icon masters are 20px. Use SVG artwork, preserve aspect ratios and use semantic currentColor. The globe is map/globe Outline; delete is ui/trash2 Outline; project overflow uses filled three dots. Brand logos are original assets and should not be retyped using a UI font.

## Component contracts

### Actions

Reuse [Primary / Secondary / Ghost / Danger](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-43) variants: Size Small/Medium and State Default/Hover/Pressed/Focus/Disabled/Loading. Keep the accessible name when showing a spinner. Loading prevents duplicate submission; disabled controls have no action. Keep widths stable across label and state changes.

Default compact actions are 32px high, main auth actions 40px, and input controls 48px. Preserve hit areas around 16px icons; use at least 44px hit areas on touch layouts. Project overflow is tertiary at rest and primary on hover.

### Forms and verification

[Input](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-532) has Default/Hover/Focus/Filled/Error/Disabled. Resting fields use the soft gray fill and subtle border. Only the current field receives the focus treatment. Preserve labels and associated help/error text.

[Six-digit OTP](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=185-1606) composes six AP Input instances: Empty, Complete and Processing. Model the code as one string so leading zeroes survive. Support full-code paste/autofill, numeric keyboard, automatic advance and backspace correction. Label the group and each position accessibly. Empty disables Verify; Complete enables it; Processing keeps digits visible, locks entry and shows loading. Preserve the 336px action width and equal 498px auth-card height across these states.

Form actions use 12px internal gaps inside the 24px form rhythm. [Client logos](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=195-1678) are one shared footer with original proportions and a 48px bottom inset on the 1440 × 960 desktop examples.

### Menus, comboboxes and navigation

[Rich menu item](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1320) supports Label, Description, leading Icon, optional description/tag and trailing check. Reuse it for project switching, filters, context menus and connections. Panel compositions add heading, clear/close actions, search and result/empty states. Do not detach instances to customize content.

Anchor a popover to its trigger, offset by 8px, and flip/clamp it within an 8px viewport margin. Escape and outside pointer dismiss; return focus to the trigger. Arrow keys move options; Enter selects. Combobox editing must not steal typed characters for menu navigation. Clear removes the query and restores the current filter. Status tags never carry meaning through color alone.

Home has no sidebar. Project navigation appears after entering a project; workspace settings have their own navigation. The global header offers project switching, credits, settings and account access. Header variants are Type=Default/Secondary in [Global header](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=116-11267).

### Project and builder compositions

[Project card](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1705): status sits beside the project name; edited time sits below; overflow remains at the trailing edge. Bind every card and menu action to the selected project ID. Show Publish for drafts and Unpublish for published projects. Public-link actions require a published URL.

[Project cover](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323) has exactly three presentation variants: **Empty**, **Added**, and **Default-mascot**. The persisted cover asset and the usage context determine the resting state; hover/focus is temporary UI state.

| Context | Uploaded cover | At rest | Editable cover hover / focus |
|---|---|---|---|
| Homepage project card | No | Default-mascot | Empty: show “Add a project cover” |
| Homepage project card | Yes | Added: actual uploaded image | Empty: show upload/replace affordance |
| Branding upload control | No | Empty | Empty |
| Branding upload control | Yes | Added: actual uploaded image | Empty: show upload/replace affordance |

On pointer leave or focus leaving the cover control, restore the state derived from the current asset: Default-mascot for an uncovered homepage card, Added for an uploaded cover, or Empty for an uncovered branding upload control. Do not restore a stale cached image after an upload/remove changes the asset. Hover never clears, uploads or mutates coverAssetId. Do not use Empty as the resting homepage fallback, and do not use Default-mascot as the branding upload placeholder.

Keep the existing three cover masters and original mascot artwork. Homepage card masters use Default-mascot for the no-cover example. Their nested cover instances and uploaded branding examples have scoped while-hover transitions to Empty; read-only visitor cover instances have no upload-hover interaction. Uploaded covers are selected by setting the nested cover State=Added and binding the project's real asset. Added is a presentation slot: the current sample artwork is not a real upload. Never substitute a generated brand treatment or mascot for a supplied uploaded image.

The affordance is enabled only when the user can edit the project. In code, use a separate accessible cover button with Add/Change project cover as its name. Enter/Space activates it; show the same affordance for focus-visible/focus-within. On touch, keep an explicit Upload/Change cover action available. Clicking the cover action must not bubble into the project-card Open action. Read-only cards, picker thumbnails and public visitor previews must not offer upload controls.

Keep the cover bounds and image crop/focal point stable while swapping presentation. Crossfade in about 120ms without scale, bounce or layout shift; use an immediate change for reduced motion. A hover does not open the file picker: an explicit click/keyboard action does. File selection, validation and upload still need application implementation; existing branding Upload/Change controls remain the prototype entry points.

Keep upload lifecycle separate from presentation: idle/uploading/replacing/failed are asynchronous states, not additional cover variants. Preserve the previous image until a replacement succeeds; cancellation or failure restores it. On successful removal, the same absent cover asset yields Default-mascot on homepage cards and Empty in branding. Upload, replace and remove stage the draft; persist and publish separately. Reuse the uploaded cover asset in related previews and thumbnails without exposing editing controls in read-only contexts.

[Composer](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1534): Enter submits, Shift+Enter adds a line. Keep focus after sending. [Visitor preview](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-1565) keeps send inside the prompt field and Call outside beside it. Preserve the 48px control height, 8px prompt-to-call gap and 24px call-button side padding.

### Data and feedback

Credits are remaining / allocation, clamped to 0–1. Derive both ring and bar from the same server values. Sample content is 1,985 remaining of 2,000 with 15 used; do not hardcode it. Unknown or zero allocation requires an explicit unavailable state rather than division by zero. Relative edited time uses the user's locale and timezone.

Use existing badges, avatars, row, surface, tooltip and spinner components. Keep 54px compact project/connection rows where shown. Connected status and selected row are separate concepts.

## Motion direction

Use a restrained spring feel inspired by familiar Apple interfaces: quick response, small travel, one soft settle. Do not bounce all page content, text, tables or financial values. Transform geometry may spring; opacity, color and focus changes should use short monotonic easing.

| Preset | Mass | Stiffness | Damping |
|---|---|---|---|
| press | 1 | 520 | 38 |
| popover | 1 | 420 | 32 |
| dialog | 1 | 360 | 30 |
| layout | 1 | 320 | 32 |
| success | 1 | 480 | 30 |

These are physical spring parameters for a runtime spring engine. Retarget from current position and velocity when interrupted; do not restart a gesture from zero. Use transform and opacity to avoid layout jitter. Figma native keyframes use normalized spring bounce; Figma prototype spring transitions can use the physical parameters. They are two APIs, not interchangeable setter objects.

| Interaction | Geometry and timing |
|---|---|
| Button press | Scale 1 → 0.97 over 100–120ms; release with press spring. Keep layout box and hit target stable. |
| Popover open | Scale 0.97 → 1, y 6px → 0; popover spring, about 340ms. Opacity reaches 1 in 140ms. |
| Dialog open | Scale 0.98 → 1, y 12px → 0; dialog spring, about 380ms. Scrim fades in over 160ms. |
| Popover/dialog close | Fade out and move at most 4px over 120–160ms. No exit overshoot. |
| Sidebar or preview layout | layout spring, typically 300–420ms. Preserve focus and scroll position. |
| Page navigation | Fade and at most 8px travel over 160–220ms; no bounce. |
| Hover, focus, selection | Color/opacity in 100–140ms; immediate focus visibility. |
| Success acknowledgement | Small icon emphasis only; success spring. Do not scale the entire form. |

The [motion lab](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=214-2034) contains native previews. It is a recipe board, not a new product route.

## Mascot and reduced motion

[A mascot](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=166-1812) uses the original editable vector and blink. Its prototype loop is Rest → Crouch → Air → Land → Settle → Blink → Rest, about two seconds. The native demonstration is 6.8 seconds with four small hops and one blink. The soft landing uses the popover spring. The compact hop is about 2.64px.

[Working indicator](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1853) exposes Title and Detail with Motion=Loop/Reduced. Show it only during actual work, stop when complete/error/cancelled, and pause while hidden or in a background tab. It is not percentage progress.

Respect prefers-reduced-motion and in-app preferences before starting any animation. Use the still mascot, remove hop/squash/scale/translation and layout springs, and use an optional opacity fade no longer than 100ms. Keep status text and focus updates. Never make task completion depend on animation-end events.

## Ambient bottom gradient

Use [AP / Ambient / Bottom gradient](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980) with Motion=Flow or Motion=Still. The [native motion preview and elevation specimens](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1978) are in family 11. This recreates the supplied mint/cyan reference in the [current project home](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-349) as an editable, reusable color field. It uses native gradients, blur and interactive component phases for a shader-like result; it is not an account-library custom shader. Motion=Flow starts at internal Phase=0. Its prototype automatically cycles Phase 0 → 1 → 2 → 3 → 0 through four 8-second Smart Animate transitions with 1ms triggers (about 32 seconds total). Motion=Still / Phase=0 has no reactions. Phase is implementation choreography, not a product setting.

At 1440 × 960 the transparent component is 1440 × 640, anchored to the bottom. Its main field is a 1440 × 140 rectangle at local y=500 with 300px layer blur. Stops at 0/50/100% bind ambient/mint, ambient/cyan and ambient/sky. Light colors are #CFFAC9 → #84E8FF → #A4DEFF. A second diffusion field is at x=-96/y=506, 1632 × 132, 8% opacity with the same blur. Keep that low-opacity layer constant: no brightness pulsing, flashing, grain or pointer tracking. AP / Primitives supplies source colors; AP / Semantic colors supplies the three theme aliases. AP / Metrics supplies blur/ambient and motion/ambient-duration.

| Time | Main X | Main Y | Main scale X | Inner X | Inner Y |
|---|---|---|---|---|---|
| 0s | 0px | 0px | 1 | 0px | 0px |
| 8s | 36px | -6px | 1.0125 | -48px | -4px |
| 16s | 0px | 0px | 1.025 | 0px | -8px |
| 24s | -36px | 6px | 1.0125 | 48px | -4px |
| 32s | 0px | 0px | 1 | 0px | 0px |

Main scale and inner Y interpolate over the 0/16/32-second keys; the remaining tracks use 0/8/16/24/32-second keys. Use cubic-bezier(0.42, 0, 0.58, 1) between keys. This is a slow ambient cycle, not an interaction spring. End values match start values and endpoint velocity is zero, so runtime playback repeats seamlessly every 32 seconds. The adjacent native preview frame demonstrates the exact 32-second keyframe cycle; use its player's loop control to repeat. Screen instances use the interactive component's approximately 32-second prototype loop. The separate native preview avoids Figma's nested-instance clip-duration limit. Application code must set infinite iteration explicitly.

Place exactly one decorative instance beneath all foreground content. Authentication: absolute at root x=0/y=320. Home: inside the content container at x=0/y=256 (the 64px header remains outside). Clip the wash to the page or content bounds. Preserve the opaque semantic page background; keep form cards, project cards, client logos, footer text, menus, dialogs and scrims above it. Use pointer-events:none and aria-hidden=true in code; it has no focusable content and must not announce updates. Home still has no sidebar. Do not add the ambient wash to builder, settings or visitor preview.

For responsive code use a bottom field height clamp(360px, 44.444vw, 640px), blur clamp(160px, 20.833vw, 300px), and scale travel down with viewport width. Keep the field decorative and behind scrolling content; it must not cover controls, create horizontal scroll or become a fixed foreground overlay. Avoid one canvas per component, full-screen animated blur or per-frame layout measurements. The companion CSS example implements the same cycle using transformed gradient layers; a GPU shader is optional, not required.

Motion=Still / Phase=0 has the identical resting image, zero animation tracks and no timed prototype reactions. Select it before first paint for prefers-reduced-motion, the app's reduced-motion preference, or a decorative-motion-off setting. Pause decorative motion while hidden or offscreen; resume from the existing phase. Authentication, verification, generation and publishing do not depend on this animation. Light desktop screens are visually reviewed; dark aliases and responsive recommendations need application-level contrast and performance review.

## Gentle elevation system

The three shared effect styles are the shadow tokens. Resting is new; Panel and Overlay retain their original style IDs so existing bindings update. All shadow layers use neutral #18181B, x offset 0, NORMAL blend, and negative spread to tuck the shadow under the surface. Keep the actual semantic border/default stroke separate from elevation. Do not imitate a border with a 0px-blur positive-spread shadow.

| Style | Layer (Y / blur / spread / alpha) | Use |
|---|---|---|
| AP / Elevation / Resting | 1 / 2 / -1 / 3.5%; 3 / 8 / -3 / 3.5% | Standalone auth cards, project cards and the new-project prompt |
| AP / Elevation / Panel | 1 / 3 / -1 / 5%; 4 / 10 / -3 / 5.5%; 12 / 28 / -8 / 6.5% | Menus, switchers and anchored popovers |
| AP / Elevation / Overlay | 2 / 4 / -2 / 4.5%; 8 / 20 / -6 / 6.5%; 24 / 56 / -16 / 11% | Dialogs and publish confirmations |

Flat surfaces have no shadow: inputs, nested cards, content groups and the page itself. Assign one elevation style per surface; do not stack Resting + Panel + Overlay or add individual shadows to every child. Use broad, faint falloff rather than increasing black opacity. Preserve focus rings, borders and contrast independently. Do not apply these shadow changes to the ambient layer's blur, mascot geometry or brand artwork.

Shadow transitions are not bouncy: preserve the existing transform spring for the surface, and interpolate any intentional elevation change over 120–160ms with monotonic easing. Avoid animating large blur kernels on every frame. The shared styles define the reviewed light elevation; dark mode requires separate contrast review before release.

## Acceptance before shipping

Verify the actual components at empty, hover, focus, filled, loading, disabled and error states. Check keyboard-only use, long labels, overflow, focus restoration, double-submit prevention and reduced motion. Keep the same IDs and component links when editing Figma. Product frames are desktop references; responsive implementation guidance and remaining design gaps are in the flow contract.
