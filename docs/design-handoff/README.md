# Agentplace implementation handoff

This package accompanies the organized Figma file. It contains implementation guidance and exported design metadata; it is not an application or a deployed API.

## Start here

1. Read [COMPONENTS.md](COMPONENTS.md) for foundations, reusable components and motion.
2. Read [FLOWS.md](FLOWS.md) for state transitions, roles, asynchronous behavior and responsive guidance.
3. Coding agents should also read [AGENT_CONTRACT.md](AGENT_CONTRACT.md).
4. Use components.json, screens.json, interactions.json, tokens.json and motion.json as machine-readable references. motion.presets.ts is a framework-neutral TypeScript configuration example for a compatible spring engine.

## Native Figma guides

- [Component implementation guide](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-1916)
- [Flow and interaction guide](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-7141)
- [Agent implementation contract](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=213-2020)
- [Components page](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-2)
- [Product flows page](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=50-2)

## Product flow sections

- [01 · Login & signup](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=50-3)
- [02 · Email verification](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5602)
- [03 · Projects / Start & switch](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6268)
- [04 · Projects / Filter & search](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6269)
- [05 · Projects / Actions & feedback](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5209)
- [06 · Agent / Build & configure](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6270)
- [07 · Agent / Branding & covers](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6271)
- [08 · Agent / Publish lifecycle](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6272)
- [09 · Workspace settings](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6273)
- [90 · Reference copies](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6274)

The file preserves 96 existing component masters and 34 product frames, their IDs, variant identities and prototype destinations. Older reviews are separated from canonical implementation assets. AP semantic variables, SF Pro, Reicon and supplied brand/client artwork remain the design sources.

Motion is deliberately restrained: physical springs for small transforms, monotonic opacity/color, brisk exits and reduced-motion alternatives. motion-lab.mp4 is a low-frame-rate diagnostic render of the native recipes, not a production animation asset. The prototype and native animation APIs use different spring object shapes; see motion.json.

See validation.json for organization, component identity, prototype target and motion evidence. The before-layout.json snapshot supports reviewing prior placements. Desktop frames do not establish that responsive layouts or backend services have been implemented.

## Ambient background and gentle elevation

Updated 18 November 2026: the shared [bottom gradient](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980) is applied to all 19 current authentication and home states. Public Motion=Flow/Still; start Flow at internal Phase=0. Four prototype phases loop in about 32 seconds. The [native preview](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=242-1966) owns an exact 32-second keyframe cycle and has been checked through sampled video. The component uses editable gradients/blur and interactive variants for a shader-like effect.

Resting, Panel and Overlay now use layered, low-opacity shadows. See elevation.json and the native component guide for exact stacks and usage. The bundle now includes 97 component definitions and 395 color/metric variables.

- ambient-elevation.json: component, phases, placements and validation evidence.
- elevation.json: current effect styles.
- ambient-gradient.css and ambient-gradient.mjs: reusable CSS motion and preference/visibility lifecycle reference.
- ambient-gradient.html: standalone integration example, not an application scaffold. Serve this directory over a local HTTP server to load its module.
- ambient-flow.mp4 and ambient-motion-contact.png: native motion diagnostics.

Reduced motion preserves the resting image and disables movement. The native timeline and interactive prototype are separate representations; application code uses the documented infinite 32-second loop. Dark/mobile review and real app integration remain implementation work.

## Contextual cover behavior

The [cover component](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323) retains three variants: Empty, Added and Default-mascot. Homepage cards without an uploaded cover use Default-mascot; branding upload without an asset uses Empty. Uploaded covers use Added with the actual asset. Editable hover/focus temporarily shows Empty in both contexts and restores the asset-derived resting state on leave/blur. Read-only/public covers have no upload affordance.

See cover-presentation.json for the exact context matrix, permissions, keyboard/touch rules and native instance verification. The native component, flow and agent guides and interactions.json now share this contract. Hover never mutates coverAssetId. Upload cancellation/failure preserves the existing image, and publication remains separate.
