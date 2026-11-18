import { CreditBalance } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Credit balance",
	component: CreditBalance,
	args: { remaining: 462, allocation: 500 },
	parameters: {
		layout: "centered",
		figmaComponentId: "129:1355",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=129-1355",
		},
		docs: {
			description: {
				component:
					"500×6px credit bar with full rounding. The source specimen has a 462px fill, expressed as the fixture ratio 462/500. In the product bind the same remaining/allocation values as the header ring. Clamp over/underflow; unknown and zero allocation show an unavailable track.",
			},
		},
	},
} satisfies Meta<typeof CreditBalance>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {},
	parameters: { figmaVariantId: "129:1355" },
};
export const Empty: Story = { args: { remaining: 0, allocation: 2000 } };
export const Full: Story = { args: { remaining: 2000, allocation: 2000 } };
export const Unavailable: Story = { args: { remaining: null, allocation: 0 } };
