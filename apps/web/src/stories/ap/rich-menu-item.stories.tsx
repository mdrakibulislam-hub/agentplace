import { Badge } from "@agentplace/ui/components/ap-data";
import { RichMenuItem } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Rich menu item",
	component: RichMenuItem,
	parameters: {
		design: figma("130:1320"),
		figmaNodeId: "130:1320",
		docs: {
			description: {
				component:
					"336px master with independent label, optional description, leading icon, tag and trailing check. Default, Hover, Selected and Danger are supplied Figma states. Publication status is separate from selection; tags communicate with text as well as color. Long labels truncate; description remains associated within the same button.",
			},
		},
	},
	args: {
		label: "WhiteFrame Advisor",
		description: "Edited 2 hours ago",
		tag: <Badge tone="success">Published</Badge>,
		onClick: fn(),
	},
} satisfies Meta<typeof RichMenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "129:1304" } };
export const Hover: Story = {
	parameters: { figmaVariantId: "129:1316" },
	args: { state: "hover" },
};
export const Selected: Story = {
	parameters: { figmaVariantId: "129:1328" },
	args: { state: "selected" },
};
export const Danger: Story = {
	parameters: { figmaVariantId: "129:1340" },
	args: { state: "danger" },
};
export const SelectedWithCheck: Story = {
	args: { state: "selected", checked: true },
};
export const DestructiveAction: Story = {
	args: {
		state: "danger",
		label: "Delete project",
		icon: "trash",
		description: undefined,
		tag: undefined,
	},
};
export const LabelOnly: Story = {
	args: { icon: null, description: undefined, tag: undefined },
};
export const LongLabel: Story = {
	args: {
		label:
			"A very long project name that remains readable without displacing the publication status",
	},
};
