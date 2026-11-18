import {
	WorkingIndicator,
	WorkingIndicatorPreview,
} from "@agentplace/ui/components/ap-working-indicator";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
export default {
	title: "Components/09 Motion & mascot/Working indicator",
	component: WorkingIndicator,
	parameters: {
		figmaComponentId: "169:1853",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1853",
		},
		docs: {
			description: {
				component:
					"72px high,472px wide,16px radius,12px icon/message gap. Title and detail remain meaningful status text; no fake percentage or timer. Only show while an actual asynchronous task is active. Completion, cancellation and failure unmount the loop. Reduced motion preserves the color field and readable status without animation. Stories use explicit fixture controls; they do not trigger live generation.",
			},
		},
	},
} satisfies Meta<typeof WorkingIndicator>;
type Story = StoryObj<typeof WorkingIndicator>;
export const Loop: Story = { parameters: { figmaVariantId: "169:1854" } };
export const Reduced: Story = {
	args: { motion: "Reduced" },
	parameters: { figmaVariantId: "169:1867" },
};
export const NativePreview: Story = {
	render: () => <WorkingIndicatorPreview />,
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1886",
		},
	},
};
function Lifecycle() {
	const [active, setActive] = useState(true);
	return (
		<div style={{ display: "grid", gap: 16 }}>
			<WorkingIndicator active={active} />
			<div style={{ display: "flex", gap: 12 }}>
				<Button onClick={() => setActive(true)}>Start fixture work</Button>
				<Button onClick={() => setActive(false)}>Cancel fixture work</Button>
			</div>
		</div>
	);
}
export const Cancellation: Story = {
	render: () => <Lifecycle />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(
			c.getByRole("button", { name: "Cancel fixture work" }),
		);
		await expect(c.queryByRole("status")).not.toBeInTheDocument();
	},
};
