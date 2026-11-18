import {
	MenuPopover,
	ProjectSwitcher,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Project switcher",
	component: ProjectSwitcher,
	parameters: {
		design: figma("131:1318"),
		figmaNodeId: "131:1318",
		docs: {
			description: {
				component:
					"384px panel with heading, search, project rows and create/view-all actions. Keyboard ArrowDown/Up moves results, Enter selects; typing remains in the search box. Use the anchored example for Escape/outside dismissal and focus restoration. The selected project check is independent of publication status.",
			},
		},
	},
	args: {
		projects,
		currentProjectId: projects[0].id,
		onSelect: fn(),
		onCreate: fn(),
		onViewAll: fn(),
		onClose: fn(),
	},
} satisfies Meta<typeof ProjectSwitcher>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Anchored: Story = {
	render: (args) => (
		<MenuPopover trigger={<Button variant="secondary">Switch project</Button>}>
			{(close) => <ProjectSwitcher {...args} onClose={close} />}
		</MenuPopover>
	),
};

export const KeyboardAndDismiss: Story = {
	render: (args) => (
		<MenuPopover trigger={<Button variant="secondary">Switch project</Button>}>
			{(close) => <ProjectSwitcher {...args} onClose={close} />}
		</MenuPopover>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole("button", { name: "Switch project" });
		await userEvent.click(trigger);
		const popup = within(canvasElement.ownerDocument.body);
		const search = await popup.findByRole("combobox", {
			name: "Search projects",
		});
		await userEvent.type(search, "Booking");
		await expect(popup.getAllByRole("option")).toHaveLength(1);
		await userEvent.keyboard("{ArrowDown}{Enter}");
		await expect(args.onSelect).toHaveBeenCalledWith("storybook-booking");
		await userEvent.keyboard("{Escape}");
		await waitFor(() => expect(trigger).toHaveFocus());
	},
};
