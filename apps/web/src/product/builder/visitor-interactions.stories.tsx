import type { ChatMessage } from "@agentplace/ui/components/ap-conversation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	expect,
	fireEvent,
	fn,
	mocked,
	userEvent,
	waitFor,
	within,
} from "storybook/test";
import { BuilderVisitorPreview, type VisitorReply } from "./visitor-experience";

const meta = {
	title: "Product/Visitor interactions",
	component: BuilderVisitorPreview,
	parameters: { layout: "fullscreen" },
	args: {
		branding: {
			name: "Studio advisor",
			company: "Studio",
			color: "#2A2A2A",
			typography: "SF Pro",
			appearance: "light",
		},
		standalone: true,
	},
} satisfies Meta<typeof BuilderVisitorPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

const history = Array.from(
	{ length: 20 },
	(_, index): ChatMessage => ({
		id: String(index),
		role: index % 2 === 0 ? "you" : "agent",
		text: `Message ${index + 1} from the project conversation.`,
	}),
);

export const ReplyWhileReadingHistory: Story = {
	args: { initialMessages: history, onReply: fn<VisitorReply>() },
	play: async ({ args, canvasElement }) => {
		if (!args.onReply)
			throw new Error("The visitor reply fixture is required.");
		const canvas = within(canvasElement);
		const response = Promise.withResolvers<Awaited<ReturnType<VisitorReply>>>();
		mocked(args.onReply).mockImplementationOnce(() => response.promise);
		const input = canvas.getByRole("textbox", {
			name: "Ask your agent a question",
		});
		const log = canvas.getByRole("log", { name: "Visitor conversation" });
		await userEvent.click(input);
		await userEvent.paste("What happens next?");
		await userEvent.click(
			canvas.getByRole("button", { name: "Send question" }),
		);
		await expect(await canvas.findByText("Replying…")).toBeVisible();
		await waitFor(() => expect(input).toHaveValue(""));
		fireEvent.input(input, { target: { value: "I have another question" } });
		log.scrollTop = 0;
		const jump = await canvas.findByRole("button", { name: "Jump to latest" });
		const call = canvas.getByRole("button", { name: "Call" });
		call.focus();

		response.resolve({ text: "Tell us about the next milestone." });
		await expect(
			await canvas.findByText("Tell us about the next milestone."),
		).toBeInTheDocument();
		await expect(call).toHaveFocus();
		await expect(input).toHaveValue("I have another question");
		await expect(log.scrollTop).toBe(0);

		await userEvent.click(jump);
		await expect(log).toHaveFocus();
		await expect(
			log.scrollHeight - log.clientHeight - log.scrollTop,
		).toBeLessThan(2);
	},
};

export const CallPreview: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const call = canvas.getByRole("button", { name: "Call" });
		await userEvent.click(call);
		const dialog = await canvas.findByRole("dialog", {
			name: "Call Studio advisor",
		});
		await expect(
			within(dialog).getByRole("button", { name: "Cancel" }),
		).toHaveFocus();
		await userEvent.click(
			within(dialog).getByRole("button", { name: "Start test call" }),
		);
		await expect(
			within(dialog).getByRole("button", { name: "End test call" }),
		).toHaveFocus();
		await userEvent.click(
			within(dialog).getByRole("button", { name: "End test call" }),
		);
		await expect(call).toHaveFocus();
	},
};
