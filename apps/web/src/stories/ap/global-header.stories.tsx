import { GlobalHeader } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/05 Navigation/Global header",
	component: GlobalHeader,
	parameters: {
		design: figma("116:11267"),
		figmaNodeId: "116:11267",
		docs: {
			description: {
				component:
					"Figma Default and Secondary are 1440 × 64. Project switching, credits, workspace settings and account are separate actions. Credits derive from the same remaining/allocation values as billing; unknown allocation is explicit. Tab through the header and activate each action with Enter. Sample credits are Storybook-only fixtures.",
			},
		},
	},
	args: {
		project: "WhiteFrame Advisor",
		remainingCredits: 1985,
		allocatedCredits: 2000,
		initials: "RA",
		onProjectSwitch: fn(),
		onCredits: fn(),
		onSettings: fn(),
		onAccount: fn(),
	},
} satisfies Meta<typeof GlobalHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "49:657" } };
export const Secondary: Story = {
	parameters: { figmaVariantId: "116:11268" },
	args: { type: "secondary" },
};
export const UnknownCredits: Story = {
	args: { remainingCredits: null, allocatedCredits: null },
};
