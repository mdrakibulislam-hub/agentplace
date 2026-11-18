import { SettingsNavigation } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/05 Navigation/Settings navigation",
	component: SettingsNavigation,
	parameters: {
		design: figma("49:1471"),
		figmaNodeId: "49:1471",
		docs: {
			description: {
				component:
					"Workspace navigation remains workspace-scoped when the selected project changes. 224 × 896; General is a persistent item, and the four supplied active variants are shown. Tab/Enter requests navigation; aria-current identifies the current destination. Authorization remains a server responsibility.",
			},
		},
	},
	args: { workspace: "WhiteFrame", onChange: fn(), onHome: fn() },
} satisfies Meta<typeof SettingsNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Billing: Story = {
	parameters: { figmaVariantId: "49:1207" },
	args: { active: "Billing & usage" },
};
export const Skills: Story = {
	parameters: { figmaVariantId: "49:1273" },
	args: { active: "Skills library" },
};
export const Plugins: Story = {
	parameters: { figmaVariantId: "49:1339" },
	args: { active: "Plugins" },
};
export const Staff: Story = {
	parameters: { figmaVariantId: "49:1405" },
	args: { active: "Staff & roles" },
};
