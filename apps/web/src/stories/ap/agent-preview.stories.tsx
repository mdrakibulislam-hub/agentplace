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
					"680 × 832 preview with a 632 × 736 visitor surface. Suggested questions fill the editable prompt. The send action remains inside the 48px prompt; Call is a sibling outside it with an 8px gap and 24px horizontal padding. Testing never creates live enquiries. Company logo, agent cover and avatar are separate inputs. Tab/Enter supports all controls; send failures preserve the message. The existing inner diffusion belongs to this master; the full auth/home wash is not inherited.",
			},
		},
	},
	args: {
		company: "WHITEFRAME",
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
