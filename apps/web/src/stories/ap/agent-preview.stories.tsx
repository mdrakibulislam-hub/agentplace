import { AgentPreview } from "@agentplace/ui/components/ap-builder";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/Agent preview",
	component: AgentPreview,
	parameters: {
		design: figma("49:1565"),
		figmaNodeId: "49:1565",
		docs: {
			description: {
				component:
					"680 × 832 preview with 16px outer padding, an 8px toolbar gap, and a 648 × 760 visitor surface. The clipped bottom diffusion stays beneath the visitor card when a conversation starts. Suggested questions fill the editable prompt. The 48px prompt and Call button sit 8px apart, with 24px horizontal padding on Call. Company logo, agent cover and avatar are separate inputs. Tab and Enter support the controls, and send failures preserve the message.",
			},
		},
	},
	args: {
		company: "Whiteframe Creative",
		companyInitials: "W",
		title: "What are you working on?",
		description:
			"I’m WhiteFrame’s AI advisor. Find the right service or tell us about your project.",
		suggestions: [
			"Help me choose a service",
			"Website design & development",
			"Product design & UX research",
		],
		onSuggestion: fn(),
		onSend: fn(),
		onCall: fn(),
		onDevice: fn(),
		onOpenExternal: fn(),
	},
} satisfies Meta<typeof AgentPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Sending: Story = { args: { submitting: true } };

export const SuggestSendAndCall: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "Help me choose a service" }),
		);
		const input = canvas.getByRole("textbox", {
			name: "Ask your agent a question",
		});
		await expect(input).toHaveValue("Help me choose a service");
		await userEvent.click(
			canvas.getByRole("button", { name: "Send question" }),
		);
		await expect(args.onSend).toHaveBeenCalledWith("Help me choose a service");
		await userEvent.click(canvas.getByRole("button", { name: "Call" }));
		await expect(args.onCall).toHaveBeenCalledOnce();
	},
};
