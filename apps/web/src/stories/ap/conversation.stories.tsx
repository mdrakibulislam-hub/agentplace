import { ConversationMessage } from "@agentplace/ui/components/ap-conversation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { figma } from "./fixtures";

const meta = {
	title: "Components/12 Conversations/Message",
	component: ConversationMessage,
	parameters: { design: figma("312:1984"), figmaNodeId: "312:1984" },
	decorators: [
		(Story) => (
			<div style={{ width: 472, maxWidth: "100%" }}>
				<Story />
			</div>
		),
	],
	args: {
		speaker: "agent",
		text: "Updated. The agent now asks about the visitor’s goal first, then suggests a relevant service.",
	},
} satisfies Meta<typeof ConversationMessage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const BuilderReply: Story = { parameters: { figmaNodeId: "312:1996" } };
export const BuilderRequest: Story = {
	args: {
		speaker: "you",
		text: "Make the welcome message shorter and more conversational.",
	},
	parameters: { figmaNodeId: "312:1994" },
};
export const VisitorMessage: Story = {
	args: {
		speaker: "you",
		experience: "visitor",
		text: "We’re planning a website redesign.",
	},
	parameters: { figmaNodeId: "312:1986" },
};
export const AgentReply: Story = {
	args: {
		experience: "visitor",
		name: "WhiteFrame Advisor",
		text: "Happy to help. What would you like your new website to do better?",
	},
	parameters: { figmaNodeId: "312:1988" },
};
