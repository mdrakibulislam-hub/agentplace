import { ConversationStatus } from "@agentplace/ui/components/ap-conversation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/12 Conversations/Request status",
	component: ConversationStatus,
	parameters: { design: figma("312:1984"), figmaNodeId: "312:1984" },
	decorators: [
		(Story) => (
			<div style={{ width: 472, maxWidth: "100%" }}>
				<Story />
			</div>
		),
	],
	args: { state: "ready", onPreview: fn(), onRetry: fn(), onStop: fn() },
} satisfies Meta<typeof ConversationStatus>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DraftUpdated: Story = {};
export const Updating: Story = { args: { state: "working" } };
export const BuilderInterrupted: Story = { args: { state: "error" } };
export const VisitorReplying: Story = {
	args: { experience: "visitor", state: "working" },
};
export const VisitorInterrupted: Story = {
	args: { experience: "visitor", state: "error" },
};
export const Stopped: Story = { args: { state: "stopped" } };
