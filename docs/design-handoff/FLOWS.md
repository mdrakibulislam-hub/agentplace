# Agentplace product flow and interaction guide

Updated 18 November 2026. Use this with the [component guide](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-1916) and the [agent implementation contract](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=213-2020). Numbered sections group related states. IDs, screen dimensions and existing prototype destinations were preserved; the empty OTP review copy lives under Reference copies.

## Flow index

| Section | Coverage |
|---|---|
| [01 · Login & signup](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=50-3) | 3 screens |
| [02 · Email verification](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5602) | 3 screens |
| [03 · Projects / Start & switch](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6268) | 3 screens |
| [04 · Projects / Filter & search](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6269) | 5 screens |
| [05 · Projects / Actions & feedback](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5209) | 4 screens |
| [06 · Agent / Build & configure](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6270) | 5 screens |
| [07 · Agent / Branding & covers](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6271) | 3 screens |
| [08 · Agent / Publish lifecycle](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6272) | 3 screens |
| [09 · Workspace settings](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6273) | 4 screens |
| [90 · Reference copies](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=212-6274) | 1 screens |

## 01–02 · Authentication and email verification

Login and signup accept email/password or the existing Google flow. Password visibility toggles without clearing the value; Forgot password remains associated with the Password row. Submit validation stays inline and preserves input. Distinguish invalid input, rejected credentials and transport failure without relying on color alone.

Signup proceeds to [OTP empty](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-284). Show the destination email and a server-derived resend cooldown. Resend is disabled until eligible; changing email clears the obsolete code and restarts verification.

OTP state machine: empty/partial → complete → verifying → verified or error. Six numeric digits are a string, including leading zeroes. Paste/autofill distributes all digits. Verify remains disabled until the code is complete; a second submit during verification has no effect. Keep entered digits on recoverable errors and move focus to the relevant correction point. Expiry or invalid-code messages must explain the next action and allow resend when eligible.

The [code-entered](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5625) and [processing](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=186-5647) frames preserve the form layout. Verification success routes to an empty project home for new workspaces or the existing project home when projects exist.

Prototype limits: clicking the OTP control demonstrates a pasted sample; the 1.4s processing delay is illustrative, not authentication logic. Real authentication, validation, expiry, resend and network handling require application code.

## 03 · Project home and switching

[Empty home](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=135-5210) and [recent projects](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=53-349) have no sidebar. Prompt suggestions should insert an editable starter prompt; Create project submits it. Prototype suggestion links shortcut to a populated creation example.

Create a project once per submit and navigate to its builder. Disable duplicate requests, preserve the prompt during errors and offer retry. Opening a card or choosing a project switches the full project context: conversation, skills, instructions, preview, history, branding and permissions. Save outstanding edits first or offer save/discard/cancel when persistence fails.

The global switcher supports query, status, current project, create and view-all. Escape/outside click dismiss; restore focus to the trigger. Do not show projects the user cannot access.

## 04–05 · Discovery and project actions

All projects / Published / Unpublished filter the actual list and show accurate counts. Search combines with the selected filter and persists when closing the combobox. Clearing search restores the current filter. Show no-results guidance and a clear action; do not replace a search-empty result with the first-project empty state.

Project-card actions are contextual to project ID, lifecycle and permission. Open navigates to that project; branding opens that project's draft settings; copy uses the actual published URL; a draft offers Publish, not Unpublish. Disabled or unavailable actions include a reason.

Copy success appears only after clipboard success and uses a short polite status message. A failure exposes a manual copy fallback. Toasts do not steal focus. Delete requires a dialog naming the project; initial focus is Cancel. Confirm is destructive and runs once. Failure keeps the dialog and context; success removes only that project and returns focus to a sensible remaining item. Never bind every card to the sample WhiteFrame project.

Prototype menus demonstrate one sample project. The application must parameterize identity, status and permissions rather than copying example destinations literally.

## 06 · Agent builder

Create / working → first draft ready → editing and preview. The composer supports Enter to send, Shift+Enter for a new line and accessible attach/model controls. A pending job has an explicit state, not a fake fixed timer.

Use the [working indicator](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1853) for real generation. Stop the loop on ready, cancelled or failure. Keep partial draft/conversation content after transport failure; support retry without duplicate user messages. If generation is cancellable, expose Stop and keep the latest saved draft. These failure/cancel details are implementation requirements beyond the current happy-path screens.

Suggested project data contract:

- Project: id, name, lifecycle, hasUnpublishedChanges, updatedAt, coverAssetId, publishedVersionId.
- Draft: projectId, versionId, agentConfig, branding, instructions, skillBindings.
- Generation job: id, projectId, status, currentStep, error, resumable.
- Published version: immutable versionId and public URL. Publishing changes the live pointer; editing a draft does not.

Instructions, skills and history are project scoped. Save explicit edits to the draft. Restoring a version requires confirmation and creates/restores a draft; it does not silently alter the live agent. Preview uses draft data and identifies test mode. Do not create live enquiries from a test interaction unless the user explicitly opts into a real integration test.

## 07 · Branding, avatars and covers

Keep company logo and agent avatar separate. A cover can be uploaded, replaced or removed and reused in cards and the agent experience. Validate file type and size, show upload progress/failure, preserve the previous image until replacement succeeds, and expose crop/alt-text handling where relevant.

Branding changes stage a draft and the preview can reflect local changes immediately. Save changes persists the draft. The saved state must reflect a successful response. Publishing is a separate action. Removing a cover restores Default-mascot on homepage cards and Empty in the branding upload control; related read-only surfaces retain their agreed display fallback.

Use the shared three-variant [project cover](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=130-1323) consistently. Homepage card without a cover: Default-mascot at rest, Empty upload affordance on editable hover/focus. Homepage card with a cover: Added with the actual uploaded image at rest, Empty on editable hover/focus. Branding without a cover: Empty at rest and on hover. Branding with a cover: Added at rest, Empty on editable hover/focus.

Leaving the cover area restores the current asset-derived rest state. Hover/focus changes presentation only and never clears the uploaded image. Successful removal returns homepage cards to Default-mascot and the branding upload control to Empty. After uploading, both show Added using the same real asset. Preserve the previous image on upload failure or cancellation.

The cover edit action is separate from opening a project card; prevent event bubbling. Keyboard focus reveals the same affordance and Enter/Space activates upload/replace. On touch, provide an explicit action. Show edit affordances only with edit permission; read-only/public visitor covers and picker thumbnails have no upload hover.

Only the three existing cover presentations are used; do not add a fourth persistent “hover” data state. Figma demonstrates hover transitions on scoped editable instances, while the application must derive restoration from current coverAssetId and context. File picker, validation error, upload progress and crop details still need implementation and focused visual QA.

## 08 · Publish lifecycle

Review the latest saved draft and required integration bindings before publishing. Show incomplete requirements near the relevant action. Publish runs once, stores an immutable version, updates the public pointer, then reports the live URL.

Published and draft changes may coexist. Continue showing which version is live. Publish update replaces the live pointer with the reviewed draft. Unpublish confirms the impact, removes public availability and retains the editable project and its history. Do not treat Delete and Unpublish as equivalent.

Loading and failure must preserve the dialog and user intent. Public-link controls are enabled only when the server reports a valid live URL. Return focus after closing dialogs and announcements. The sample copy/live buttons are prototype demonstrations; wire actual clipboard and navigation outcomes in code.

## 09 · Workspace settings and access

Billing, skills library, plugins and staff are workspace scoped. Changing selected project must not accidentally change the workspace account.

Observed roles:

- Owner: billing and all workspace controls.
- Admin: manage staff, skills and plugins.
- Member: access assigned projects.
- Project Editor: build, test and publish assigned projects.
- Project Viewer: view and test only.

The server is authoritative for roles, allocation and entitlements. Client-side hiding is not authorization. An invitation has pending, accepted, failed and revoked outcomes; preserve the invite form on errors. Changing project access needs an explicit save and clear feedback.

Connect plugins at workspace scope, grant access per project, and describe actual permissions. Calendar Connect belongs in its row. Keep connection status separate from selection. Cancelled or failed authorization returns to the same settings context.

Credits use one remaining/allocation source for header donut and billing bar. Clamp display ratios; handle unknown/zero allocations. The 1,985 / 2,000 example is sample content. Currency, plan, renewal dates and usage must come from real billing data.

## Responsive implementation guidance

Observed desktop frame: 1440 × 960, 64px header, 224px sidebar, 536px editor and 680px preview in the working area. Home content is 1088px wide; auth card is 400px with 336px inner controls.

At narrower widths, preserve hierarchy rather than scaling the whole frame. Suggested implementation: keep auth at max-width 400px with at least 24px side margins; collapse the project sidebar when space is insufficient; switch chat/preview to tabs or a drawer before either becomes unreadable. Use a responsive project grid and wrap settings content to one column. These are implementation guidelines; mobile/tablet frames are not yet drawn and must be reviewed.

## Keyboard, focus and announcements

Give every icon action a name. Keep visible focus. Use actual buttons, form labels and semantic menu/dialog patterns. Dialogs trap focus, close with Escape where safe and return focus to the invoker. Form errors are associated with fields; asynchronous work and success use polite live regions without repeated announcements. Keep layouts usable at 200% zoom and with long/translatable copy.

## Motion and runtime rules

Follow the [spring recipes](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=214-2032) and the component guide's physical parameters. Open overlays with small transform springs and monotonic opacity; close briskly without bounce. Animate navigation with a short fade, not a whole-page spring. Never gate authentication, publish, saving or job completion on animation timers.

Reduced motion uses static mascot and no scale, travel, spring or auto-scroll. Pause nonessential loops when hidden. Retarget interrupted transitions from current values; do not queue repeated bounces. Use actual task/job state to determine whether work is in progress.

## Ambient background and elevation across flows

The shared [bottom gradient](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980) appears on all login/signup and six-digit OTP states, plus empty/populated home, project switching, filtering, searching and project-action states. The OTP review copy also uses it. Nineteen current authentication and home states are updated. Builder, workspace settings and visitor preview retain their existing surfaces.

Keep the background behind content and below modal scrims. Menus and dialogs are always above it. Client logos remain original vectors above the gradient. Switching auth or home states must not restart the decorative cycle when the page shell can persist. The animation has no relation to OTP cooldowns, processing, remaining credits or generation state.

Use a 32-second seamless ease-in-out inner drift, with the exact positions in the component guide. Figma screen instances start Motion=Flow / Phase=0 and use four 8-second component transitions; Still / Phase=0 has no timed reactions. The adjacent native timeline provides the exact 32-second implementation reference. No bounce or brightness pulse. Reduced motion selects Motion=Still from the first render; preserve the same color composition without movement. Pause while hidden/offscreen, preserve phase on resume, and disable decorative motion when the user opts out.

Use Resting elevation for standalone forms/project cards/prompt; Panel for menus; Overlay for dialogs. Nested sections stay flat. Retain independent semantic borders and visible focus. Check search/empty states, menu-open states and modal scrims at 200% zoom, and verify that the decorative layer never intercepts pointer events or obscures footer text. Responsive and dark-mode behavior remain implementation review requirements.

See the [native preview and elevation specimens](https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1978) and the component guide for dimensions, source tokens, timing and shadow values.

## Known implementation gaps

The Figma file documents desktop visuals and sample prototype flows. It does not implement backend authentication, persistence, clipboard, uploads, billing, invitations, plugin consent, responsive pages, OTP errors/expiry, generation errors/cancel, or permission-denied screens. Build these behaviors from the contracts above using the existing components, and review their error/empty/loading states before release. Do not infer a deployed API or complete runtime from a prototype link.
