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
					"224 × 896 project-scoped navigation. New chat and conversation entries provide access to Chat; there is no duplicate Chat link in Project tools. Skills, Instructions.md, History and Branding retain their active states. Conversation and tool rows are 32px high. Project access is one left-aligned bottom action. Home has no sidebar.",
			},
		},
	},
	args: {
		active: "Chat",
		conversations: [
			{
				id: "storybook-conversation",
				title: "Build project advisor",
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
	name: "Conversation active",
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

export const LongConversationTitle: Story = {
	args: {
		conversations: [
			{
				id: "storybook-long-conversation",
				title:
					"Review recommendations, contact details, and appointment availability with the project team",
				selected: true,
			},
		],
	},
};
