import { Avatar } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Avatar",
	component: Avatar,
	args: { initials: "AP" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:659",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-659",
		},
		docs: {
			description: {
				component:
					"Original AP 24/32/40px avatar sizes, neutral circular background and SF Pro 12/16 Medium initials. Supply real image URLs and accessible person names when available; fallback initials remain data-driven.",
			},
		},
	},
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Small: Story = {
	args: { size: "small" },
	parameters: { figmaVariantId: "32:656" },
};
export const Medium: Story = {
	args: { size: "medium" },
	parameters: { figmaVariantId: "32:657" },
};
export const Large: Story = {
	args: { size: "large" },
	parameters: { figmaVariantId: "32:658" },
};
