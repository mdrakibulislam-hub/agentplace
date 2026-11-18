import { CreditRing } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Credit ring",
	component: CreditRing,
	args: { remaining: 11, allocation: 12 },
	parameters: {
		layout: "centered",
		figmaComponentId: "129:1352",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=129-1352",
		},
		docs: {
			description: {
				component:
					"16px donut with the native 0.68 inner-radius proportion. Derive remaining/allocation from real data and clamp to 0…1. Figma specimen is an approximately 330° arc (11/12), represented by these fixture values. Unknown or nonpositive allocation produces an unavailable track, never NaN or an invented balance.",
			},
		},
	},
} satisfies Meta<typeof CreditRing>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {},
	parameters: { figmaVariantId: "129:1352" },
};
export const Empty: Story = { args: { remaining: 0, allocation: 2000 } };
export const Full: Story = { args: { remaining: 2000, allocation: 2000 } };
export const Unavailable: Story = { args: { remaining: null, allocation: 0 } };
