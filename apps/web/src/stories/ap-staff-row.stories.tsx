import { StaffRow } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Staff row",
	component: StaffRow,
	args: {
		name: "Rakib",
		initials: "RA",
		email: "rakib@whiteframe.agency",
		workspaceRole: "Owner",
	},
	parameters: {
		layout: "centered",
		figmaComponentId: "52:1109",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1109",
		},
		docs: {
			description: {
				component:
					"648×80px staff row with 32px avatar, name/email, workspace role and project access action. Role and project-access assignment are separate concepts. User and permission data must come from the authoritative server.",
			},
		},
	},
} satisfies Meta<typeof StaffRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {},
	parameters: { figmaVariantId: "52:1109" },
};
