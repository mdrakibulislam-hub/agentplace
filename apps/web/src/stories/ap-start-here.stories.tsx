import type { Meta, StoryObj } from "@storybook/react-vite";

function InteractionGuide() {
	return (
		<main style={{ maxWidth: 960, display: "grid", gap: 24 }}>
			<header>
				<h1 className="ap-type-heading-lg">Agentplace design system</h1>
				<p>
					Live components and foundations from the approved AP Figma library.
				</p>
			</header>
			<section>
				<h2 className="ap-type-heading-sm">Find the source</h2>
				<p>
					Foundations contains every color alias, metric and named type style.
					Components follows the numbered Figma families. Every native variant
					has its own specimen; component docs link to the original Figma
					definition. Guides contains native comparison boards, interaction
					recipes, and coverage evidence.
				</p>
				<p>
					<a href="https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-1916">
						Component implementation spec ↗
					</a>{" "}
					·{" "}
					<a href="https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=209-7141">
						Product interaction spec ↗
					</a>
				</p>
			</section>
			<section>
				<h2 className="ap-type-heading-sm">Review interactions</h2>
				<table style={{ borderCollapse: "collapse", width: "100%" }}>
					<thead>
						<tr>
							<th align="left">Family</th>
							<th align="left">Keyboard and state contract</th>
						</tr>
					</thead>
					<tbody>
						{[
							[
								"Actions",
								"Tab focuses; Enter/Space activates. Disabled/loading prevent duplicate action. Pending-request specimen reserves width and requires an explicit fixture resolution.",
							],
							[
								"Forms and OTP",
								"Labels stay associated with controls. OTP is one six-digit string: paste/autofill, leading zeroes, advance/backspace, validation and processing. Field errors preserve entered data.",
							],
							[
								"Menus and search",
								"Arrow keys move options; Enter selects. Typing edits the search query. Clear resets results. Escape/outside dismiss and restore trigger focus. Popovers clamp8px inside the viewport.",
							],
							[
								"Project covers",
								"Home without an asset uses Default-mascot; branding uses Empty. Editable hover/focus shows Empty temporarily, never deletes the asset. Explicit touch upload; failure/cancel keeps the old image. Read-only variants expose no edit affordance.",
							],
							[
								"Composer and preview",
								"Enter sends; Shift+Enter adds a line. Focus remains after sending. Preview Call stays outside the48px input with8px gap and24px side padding.",
							],
							[
								"Dialogs",
								"Trap focus. Destructive confirmation initially focuses Cancel. Escape closes and restores the trigger. Failed requests remain visible and recoverable.",
							],
							[
								"Motion",
								"Physical press/popover/dialog springs; no layout-box scaling. OS/app reduced motion removes decorative movement. Actual task completion/cancel/error stops work animation; hidden/offscreen pauses loops.",
							],
						].map(([family, contract]) => (
							<tr key={family}>
								<th
									align="left"
									style={{
										padding: "12px 16px 12px 0",
										verticalAlign: "top",
										borderTop: "1px solid var(--border-default)",
									}}
								>
									{family}
								</th>
								<td
									style={{
										padding: "12px 0",
										borderTop: "1px solid var(--border-default)",
									}}
								>
									{contract}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
			<section>
				<h2 className="ap-type-heading-sm">What the examples prove</h2>
				<p>
					Storybook fixture callbacks demonstrate interaction contracts. They do
					not create real projects, send OTP emails, upload files to a service,
					spend credits, publish agents, or enforce server authorization. Counts
					and source IDs prove coverage; screenshot and browser evidence
					establish visual and behavioral matching. See the repository's
					Storybook coverage and review reports for remaining verification
					limits.
				</p>
			</section>
		</main>
	);
}
export default {
	title: "Guides/Start here",
	component: InteractionGuide,
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Navigation and interaction guide for the complete AP library. Open the specific family to inspect native Figma variants and run its interaction checks.",
			},
		},
	},
} satisfies Meta<typeof InteractionGuide>;
export const Overview: StoryObj<typeof InteractionGuide> = {};
