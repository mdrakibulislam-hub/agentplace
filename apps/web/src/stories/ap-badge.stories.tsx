import { Badge } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Badge",
	component: Badge,
	args: { children: "Status" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:649",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-649",
		},
		docs: {
			description: {
				component:
					"Six semantic status tones from Figma. SF Pro Medium 510, 12/16 with 8px horizontal and 4px vertical padding, 4px radius. Labels carry the status meaning; color is supplementary. Badges are status text, not interactive controls.",
			},
		},
	},
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Neutral: Story = {
	args: { tone: "neutral" },
	parameters: { figmaVariantId: "32:643" },
};
export const Success: Story = {
	args: { tone: "success" },
	parameters: { figmaVariantId: "32:644" },
};
export const Warning: Story = {
	args: { tone: "warning" },
	parameters: { figmaVariantId: "32:645" },
};
export const ErrorState: Story = {
	name: "Error",
	args: { tone: "error" },
	parameters: { figmaVariantId: "32:646" },
};
export const Info: Story = {
	args: { tone: "info" },
	parameters: { figmaVariantId: "32:647" },
};
export const Accent: Story = {
	args: { tone: "accent" },
	parameters: { figmaVariantId: "32:648" },
};
