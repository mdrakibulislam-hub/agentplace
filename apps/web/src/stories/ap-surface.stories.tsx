import { Surface } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Surface",
	component: Surface,
	args: {},
	parameters: {
		layout: "centered",
		figmaComponentId: "32:758",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-758",
		},
		docs: {
			description: {
				component:
					"320×180px original surface specimens with 16px radii. Flat uses the semantic 1px border, Panel and Overlay use the exact shared layered shadows (including negative spread). One elevation per surface; nested inputs/content stay flat. Resting elevation is documented under Foundations.",
			},
		},
	},
} satisfies Meta<typeof Surface>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Flat: Story = {
	args: { elevation: "flat" },
	parameters: { figmaVariantId: "32:755" },
};
export const Panel: Story = {
	args: { elevation: "panel" },
	parameters: { figmaVariantId: "32:756" },
};
export const Overlay: Story = {
	args: { elevation: "overlay" },
	parameters: { figmaVariantId: "32:757" },
};
