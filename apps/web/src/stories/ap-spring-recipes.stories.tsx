import { ConfirmDialog } from "@agentplace/ui/components/ap-dialog";
import { MenuPopover, ProjectFilter } from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { projects } from "./ap/fixtures";

const meta = {
	title: "Guides/Interaction recipes/Springs and overlays",
	parameters: {
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=214-2034",
		},
		docs: {
			description: {
				component:
					"Native physical recipes: Press520/38, Popover420/32, Dialog360/30, Layout320/32, Success480/30; mass1. Press scale.97, popover scale.97/y6, dialog scale.98/y12. Opacity is monotonic140–160ms; exits120–160ms. Reduced motion removes travel/scale before first paint. Focus stays within modal dialogs; Cancel starts focused for destructive actions; Escape/outside dismiss popovers and return trigger focus. These stories are isolated fixtures and do not delete real projects.",
			},
		},
	},
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Press: Story = {
	render: () => <Button size="medium">Continue</Button>,
};
export const Popover: Story = {
	render: () => (
		<MenuPopover trigger={<Button variant="secondary">Show projects</Button>}>
			{(close) => (
				<ProjectFilter
					projects={projects}
					onClose={close}
					onChange={() => close()}
				/>
			)}
		</MenuPopover>
	),
};
export const Dialog: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="danger">Open delete confirmation</Button>}
			onConfirm={fn()}
		/>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const trigger = c.getByRole("button", { name: "Open delete confirmation" });
		await userEvent.click(trigger);
		const body = within(canvasElement.ownerDocument.body);
		await waitFor(() =>
			expect(body.getByRole("button", { name: "Cancel" })).toHaveFocus(),
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(trigger).toHaveFocus());
	},
};
export const FailedRequest: Story = {
	render: () => (
		<ConfirmDialog
			trigger={<Button variant="danger">Try failing fixture request</Button>}
			onConfirm={() =>
				Promise.reject(
					new Error(
						"The fixture request failed. Your project was not deleted.",
					),
				)
			}
		/>
	),
};
