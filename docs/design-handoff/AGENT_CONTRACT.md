# Agentplace agent implementation contract

This is an implementation handoff for coding agents. Read the [component guide](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-1916) and [product flow guide](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-7141) first. The connected Figma file is the visual source of truth; native specs describe behavior. The companion handoff bundle contains components.json, screens.json, interactions.json, motion.json and a TypeScript motion reference.

## Source priority

1. Current user instructions and current application code.
2. These behavior contracts and current canonical Figma frames.
3. Current AP variable/style/component definitions.
4. Prototype links as demonstrations of sample flows, not complete routing or backend logic.
5. Reference & QA boards only for history and visual comparison.

Inspect the existing repository, framework and data boundaries before implementation. Reuse its architecture and dependencies. Do not scaffold a second app or substitute a new component library solely because an example uses it.

## Preserve the design system

- Use semantic AP color and metric variables. Keep light/dark aliases; do not bake sampled screenshot hex values into components.
- Use SF Pro and observed text styles. Use Reicon SVGs, original logo and client-logo artwork; do not approximate brand assets with text.
- Keep shared components and variants. Do not detach or redraw an input, menu, project card, OTP, working mascot or preview just to change content.
- Six OTP cells compose one code field. Keep leading zeroes and paste/autofill behavior.
- Use project IDs for all project actions; never hardcode WhiteFrame or the demo OTP, credits, live URL or timers.
- Preserve draft vs live state and workspace vs project permissions.
- Frames are desktop examples. Implement responsive behavior explicitly and review it; do not claim mobile verification from a desktop screenshot.

## Canonical entry points

| Purpose | Figma |
|---|---|
| Existing account login | [53:8](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-8) |
| Signup | [53:208](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-208) |
| OTP empty | [53:284](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-284) |
| OTP complete / processing | [186:5625](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5625) / [186:5647](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5647) |
| Empty / populated home | [135:5210](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5210) / [53:349](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-349) |
| Working / ready builder | [54:1385](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1385) / [54:1624](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1624) |
| Branding | [54:1876](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=54-1876) |
| Publish lifecycle | [57:1936](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-1936) / [57:2270](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-2270) / [57:2585](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=57-2585) |

186:5603 is a review copy of OTP empty. Use 53:284 as the canonical flow entry. Stable IDs are preserved even though canvas groups and names were reorganized.

## Interaction model

Maintain explicit async states: idle, validating, submitting/working, success and error. Disable duplicate submissions, preserve user input and recover from failed persistence. Network/server outcomes determine transitions; prototype timeouts must not become production logic.

Menus: project-scoped items, status-conditional publish actions, accurate tags/counts, keyboard navigation, query clearing, outside/Escape dismissal and focus return. Dialogs: trap focus, Cancel initially for destructive actions, explicit confirmation, no silent data loss.

Generation: do not keep the mascot running after completion, cancellation or failure. Preview uses the current draft and test mode. Branding save does not publish. History restore modifies the draft, not the published pointer.

## Motion contract

Use a physics engine with these values. They are reference presets, not a mandate to add a particular runtime library.

```json
{
  "press": {
    "mass": 1,
    "stiffness": 520,
    "damping": 38
  },
  "popover": {
    "mass": 1,
    "stiffness": 420,
    "damping": 32
  },
  "dialog": {
    "mass": 1,
    "stiffness": 360,
    "damping": 30
  },
  "layout": {
    "mass": 1,
    "stiffness": 320,
    "damping": 32
  },
  "success": {
    "mass": 1,
    "stiffness": 480,
    "damping": 30
  }
}
```

Press scale is 0.97. Popover starts at scale 0.97 and y 6px; dialog starts at scale 0.98 and y 12px. Opacity reaches 1 in 140–160ms; geometry settles around 340–380ms. Exit uses 120–160ms monotonic easing. Retarget from current position and velocity; animate transform and opacity, not text layout. Do not apply bounce indiscriminately.

With reduced motion, use the still mascot, remove spring/scale/travel/layout animation, and optionally fade for \<=100ms. Task completion never depends on animation end. Stop loops when hidden. Figma native keyframes use normalized bounce; prototype transitions and runtime engines accept physical values. Do not copy one API object's shape into another.

## Project-cover presentation contract

The shared [cover component](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323) has State=Empty / Added / Default-mascot. Preserve all three masters and the mascot artwork. Derive presentation from coverAssetId, usage context and temporary editable hover/focus:

```ts
type CoverVariant = 'Empty' | 'Added' | 'Default-mascot';
type CoverContext = 'home-card' | 'branding-upload';

function coverVariant(
  context: CoverContext,
  hasCover: boolean,
  canEdit: boolean,
  hoveredOrFocused: boolean,
): CoverVariant {
  if (canEdit && hoveredOrFocused) return 'Empty';
  if (hasCover) return 'Added';
  return context === 'branding-upload' ? 'Empty' : 'Default-mascot';
}
```

Homepage absent asset => Default-mascot. Branding absent asset => Empty. Any uploaded cover => Added with the actual asset at rest; editable hover/focus => Empty in either context. Leave/blur recomputes from current data and restores mascot/image/branding placeholder correctly. Hover must not mutate coverAssetId, remove the image, persist a variant name, open a picker or start a request. Keep hover/focus and upload lifecycle separate.

Use a semantic cover-edit button, stable bounds, keyboard parity and an explicit touch action. Stop its click from opening the project card. Read-only users, public visitor previews and picker thumbnails have no upload affordance. Crossfade approximately 120ms; reduced motion changes immediately. Never animate cover layout or bounce the image.

Replacement preserves the existing image until success; cancel/failure restores it. Removal stages an absent draft asset, giving different contextual fallbacks in home and branding. Persist/publish remain separate. The Added sample is not evidence of a real uploaded asset; bind the actual project asset and crop/focal point.

Verify both contexts × asset absent/present × rest/hover/focus/leave, upload cancel/failure/success/removal, permission restrictions, keyboard/touch access and prevention of card-navigation bubbling. Keep the existing three cover variants; do not invent a persisted hover cover state.

## Ambient and elevation implementation contract

Reuse [AP / Ambient / Bottom gradient](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980), Motion=Flow/Still. Internal Phase=0/1/2/3 drives the Figma prototype loop; instantiate Flow at Phase=0, or Still / Phase=0 with no timed reactions. The standalone native preview owns the exact 32-second keyframe recipe. Use one bottom-anchored decorative layer only on authentication/OTP and project-home shells. Place it below every foreground control and below modal scrims. Match ambient/mint, ambient/cyan, ambient/sky, blur/ambient and motion/ambient-duration from current Figma variables. The companion ambient-gradient.css/HTML example is an integration reference; adapt it to the existing repository and do not scaffold a new app.

The 32-second cycle moves only the inner gradient layers, with constant opacity and no spring, flash, brightness pulse or mouse tracking. Preserve the phase across shell state changes. Apply prefers-reduced-motion before first paint; use Still and stop all decorative loops. Also support the app-level motion setting, visibility/offscreen pause and cleanup on unmount. CSS transforms or one reusable shader are valid implementations; the delivered Figma component uses editable native gradients/blur and interactive variants, with a separate native keyframe preview, not a custom shader resource.

Map shadow-resting, shadow-panel and shadow-overlay to the exact shared effect-style stacks in the component guide. Panel and Overlay IDs are preserved. Never reinstate the old hard shadow outline or 20px-offset single dialog shadow. Keep semantic borders/focus rings independent, use one elevation level per surface, and leave nested content flat.

Required evidence: no content reflow when the gradient mounts; one wash per eligible page; original client logos visible above it; menus/dialogs above the wash; identical rest appearance with reduced motion; no decorative movement while opted out; pause/resume works; phase at 32s matches phase at 0s; all shadow-bearing surfaces use the shared style tokens. Review mobile and dark contrast/performance separately instead of claiming desktop screenshots verify them.

## Build sequence and evidence

1. Map current tokens and component APIs to the repository; list only actual gaps.
2. Implement authentication/OTP and project selection with real async/error states.
3. Bind builder, draft save, preview, history, branding and generation lifecycle.
4. Bind publish/unpublish, workspace roles, billing and plugin access.
5. Apply motion presets, reduced motion, keyboard/focus behavior and responsive layouts.
6. Verify representative visual states against canonical frames and test the interaction state machines.

Required evidence: six-digit paste and leading-zero OTP; blocked duplicate submit; loading widths stay stable; project switching retains the correct data; draft edits do not alter live content; role restrictions are enforced by the server; failed save/upload/publish can recover; menus/dialogs restore focus; reduced motion has no decorative movement.

Report implemented, tested and still-missing behavior separately. Do not present a static Figma prototype or generated screenshot as a functioning service. Do not invent API endpoints, production credentials, billing plans or publish outcomes.
