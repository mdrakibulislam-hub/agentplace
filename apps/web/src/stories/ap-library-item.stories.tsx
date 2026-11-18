import { LibraryItem } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Library item",
	component: LibraryItem,
	args: { name: "Service recommendations", description: "Used in 2 projects" },
	parameters: {
		layout: "centered",
		figmaComponentId: "58:1060",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=58-1060",
		},
		docs: {
			description: {
				component:
					"352×88px selectable library item. Reicon puzzle artwork, 16px padding, 12px gap, 12px corner radius and title/usage copy. Selected background is independent of connected/enabled status. Selection is accessible through aria-pressed and delegates to the parent.",
			},
		},
	},
} satisfies Meta<typeof LibraryItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: { selected: false },
	parameters: { figmaVariantId: "58:1046" },
};
export const Selected: Story = {
	args: { selected: true },
	parameters: { figmaVariantId: "58:1053" },
};
