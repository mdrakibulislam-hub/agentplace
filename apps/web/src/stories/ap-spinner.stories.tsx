import { Spinner } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Spinner",
	component: Spinner,
	args: {},
	parameters: {
		layout: "centered",
		figmaComponentId: "32:748",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-748",
		},
		docs: {
			description: {
				component:
					"Reicon loader artwork at 16px or 24px. Used only while an actual operation is pending. The accessible status name remains present. Reduced motion uses the same still glyph and status text; successful completion never depends on animation ending.",
			},
		},
	},
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Small: Story = {
	args: { size: "small" },
	parameters: { figmaVariantId: "32:746" },
};
export const Medium: Story = {
	args: { size: "medium" },
	parameters: { figmaVariantId: "32:747" },
};
