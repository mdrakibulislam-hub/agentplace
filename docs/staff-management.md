# Staff management

The frontend and Storybook share `packages/ui/src/components/ap-members.tsx` and `ap-members.css`. `apps/web/src/product/settings/staff-settings.tsx` owns filtering, opening editors, member updates and feedback. `settings-state.tsx` preserves the existing workspace-specific local-storage boundary.

## Figma and Storybook

File: `m0v1MINOJA152Kil6JHeZ8`. Component family: `344:2443` (“13 · Tables & member access”). These are current additions; the original 97-definition handoff snapshot is unchanged.

| Design                                         | Node                             | Storybook coverage                                                                       |
| ---------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| Person / workspace role / project access cells | 344:2445 / 344:2454 / 344:2456   | Member table: Person cell, Workspace role cell, Project access cell                      |
| Status / action variants                       | 344:2458 / 344:2468              | Member table: Statuses, Actions                                                          |
| Header / row variants                          | 344:2484 / 344:2494              | Member table: Header, Rows                                                               |
| Project permission row / table                 | 344:2621                         | Member editor: Project row, Project table                                                |
| Workspace role option / menu                   | 344:2664 / 348:2756              | Member editor: Workspace role option, Workspace role menu                                |
| Project role menu                              | 348:2895                         | Member editor: Project role menu                                                         |
| Search / toolbar                               | 344:2679 / 344:2684              | Member table: Search, Toolbar                                                            |
| Members table / empty body / empty table       | 344:2700 / 348:2888 / 352:2788   | Member table: Default, Search empty body, Empty table                                    |
| Member drawer states                           | 348:2429                         | Member editor: Unchanged, Unsaved changes, Admin, Grant admin, Saving, Save error, Retry |
| Invite / pending invitation                    | 348:2767 / 348:2850              | Invitations: Invite, Valid email, Pending, request and recovery stories                  |
| Save error / success toast / discard           | 348:2422 / 353:2944 / 358:2946   | Member editor: Error feedback, Success toast, Discard changes                            |
| Staff screen                                   | 59:2860                          | Product/Staff management: Members                                                        |
| Remove workspace member                        | 366:105                          | Remove member, Remove member storage failure and retry                                   |
| Member / Admin initial drawer                  | 349:8544 / 349:8830              | Edit member, Edit admin                                                                  |
| Workspace / project role menus                 | 349:8724 / 349:9315              | Workspace role choices, Project role choices                                             |
| Member / Admin staged changes                  | 354:12354 / 356:11581            | Member unsaved, Admin unsaved                                                            |
| Save failure / member saved / Admin saved      | 349:9072 / 354:12408 / 354:12430 | Save error screen, Save member, Promote admin                                            |
| Invite / pending / search empty                | 349:8914 / 349:9249 / 354:12452  | Invite, Pending invitation, Search empty                                                 |
| Member / Admin discard                         | 358:13885 / 358:13921            | Discard member changes, Discard admin changes                                            |

The existing Product/Workspace settings story and application route also use the updated `StaffSettings`. Their data comes from existing local settings rather than the four-person design fixture.

## Behavior and boundaries

- Search matches names and email addresses. Workspace-role filtering preserves the query; Clear search resets both filters.
- Member access remains staged until Save. Admin grants all current and future projects; billing stays owner-only. Owner cannot be edited here.
- The trash action beside Edit access opens a confirmation for an active member. The owner and the current member are protected. Pending invitations use the existing revoke action. Confirming removes the member record and its project assignments from the saved workspace. Cancel receives initial focus, and failed removals keep the member visible and allow a retry.
- Pending requests prevent repeat submission and dismissal. Failed saves retain changes; Cancel/Escape on dirty edits asks for confirmation with Keep editing initially focused.
- Shared Base UI dialogs/selects provide focus containment and keyboard navigation. Product closure restores the initiating action, or Invite member if its row was removed. Narrow tables scroll within a keyboard-focusable region. The 480px drawer fits the viewport, keeping its footer visible. Reduced motion removes travel/scale.
- Member writes commit local storage before publishing updated state or success feedback. Failure leaves saved permissions intact. Other settings, projects, agent drafts and published versions are unaffected by this operation.
- The frontend has no membership/invitation API or email delivery integration. Invite/resend display unavailability and preserve input. Existing pending prototype invitations can be removed from local settings. Only Storybook supplies success adapters. Invitation acceptance, expiry and server-side permissions remain backend work.

## Verification

Rendered desktop staff table, member drawer and invitation dialog were compared with the approved Figma layouts. Drawer and invite layouts were inspected at 390×844 with reduced motion; no page-width overflow remained and the drawer footer stayed visible.

Executed Storybook interactions cover table actions, workspace/project role menus, staged saves, Admin promotion, saving locks, save failure/retry, dirty discard/keep editing, keyboard focus containment, search/filter reset, email/duplicate validation, delivery failure, invitation pending locks, resend retry, confirmed revoke/retry and complete page flows. A provider-backed story simulates `QuotaExceededError`, verifies retained edits, then retries through the real browser-storage save callback. Successful invitation responses are test fixtures, not delivery verification.

Repository checks: `bun run check`, `bun run check-types`, `bun run build`, `bun run build-storybook`, and `bun run audit:storybook`. The audit covers the preserved 97-definition snapshot and local asset hashes; new definitions are linked directly in stories and the table above. It does not certify visual fidelity. Builds retain existing bundle-size warnings.
