import { MenuItem } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Menu item",
	component: MenuItem,
	parameters: {
		design: figma("32:717"),
		figmaNodeId: "32:717",
		docs: {
			description: {
				component:
					"The compact 264 × 40 item supports Default, Hover, Selected, Danger and Disabled. A selected item uses accent/background; danger uses the error foreground without changing the surface. Native buttons provide Enter/Space activation and disabled controls are inert. In menu compositions the semantic role is supplied by the parent.",
			},
		},
	},
	args: { label: "Menu item", onClick: fn() },
} satisfies Meta<typeof MenuItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "32:712" } };
export const Hover: Story = {
	parameters: { figmaVariantId: "32:713" },
	args: { state: "hover" },
};
export const Selected: Story = {
	parameters: { figmaVariantId: "32:714" },
	args: { state: "selected" },
};
export const Danger: Story = {
	parameters: { figmaVariantId: "32:715" },
	args: { state: "danger" },
};
export const Disabled: Story = {
	parameters: { figmaVariantId: "32:716" },
	args: { state: "disabled" },
};
