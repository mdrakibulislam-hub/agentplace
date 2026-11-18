import { ProjectNavigation } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/05 Navigation/Project navigation",
	component: ProjectNavigation,
	parameters: {
		design: figma("49:1206"),
		figmaNodeId: "49:1206",
		docs: {
			description: {
				component:
					"224 × 896 project-scoped navigation. Home has no sidebar. Selecting Chat, Skills, Instructions.md, History or Branding requests a project-scoped change. Conversation state and permissions are independent. Tab/Enter reaches every item; the active item has aria-current=page. All five Figma active variants are listed.",
			},
		},
	},
	args: {
		active: "Chat",
		staffCount: 3,
		conversations: [
			{
				id: "storybook-conversation",
				title: "Build project advisor",
				detail: "Today · 4 messages",
				selected: true,
			},
		],
		onChange: fn(),
		onHome: fn(),
		onNewConversation: fn(),
		onManageAccess: fn(),
		onConversation: fn(),
	},
} satisfies Meta<typeof ProjectNavigation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Chat: Story = {
	parameters: { figmaVariantId: "49:711" },
	args: { active: "Chat" },
};
export const Skills: Story = {
	parameters: { figmaVariantId: "49:810" },
	args: { active: "Skills" },
};
export const Instructions: Story = {
	parameters: { figmaVariantId: "49:909" },
	args: { active: "Instructions.md" },
};
export const History: Story = {
	parameters: { figmaVariantId: "49:1008" },
	args: { active: "History" },
};
export const Branding: Story = {
	parameters: { figmaVariantId: "49:1107" },
	args: { active: "Branding" },
};
