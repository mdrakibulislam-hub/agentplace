import { ChatComposer } from "@agentplace/ui/components/ap-builder";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/Chat composer",
	component: ChatComposer,
	parameters: {
		design: figma("49:1534"),
		figmaNodeId: "49:1534",
		docs: {
			description: {
				component:
					"472 × 128. Enter sends, Shift+Enter adds a line; IME composition never submits prematurely. Focus returns after submission. Empty or duplicate pending requests are blocked. A rejected callback preserves text and exposes recovery. Attachment/model controls are explicitly named. Callbacks are Storybook spies, not generation jobs.",
			},
		},
	},
	args: { onSubmit: fn(), onAttach: fn(), onModel: fn() },
} satisfies Meta<typeof ChatComposer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Filled: Story = {
	args: { defaultValue: "Add appointment booking to my agent" },
};
export const Sending: Story = {
	args: { defaultValue: "Add appointment booking", submitting: true },
};
export const RecoverableError: Story = {
	args: {
		defaultValue: "Add appointment booking",
		error: "Connection lost. Your message is preserved; try again.",
	},
};

export const EnterAndMultiline: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole("textbox", {
			name: "Message your agent builder",
		});
		await userEvent.type(input, "First line{Shift>}{Enter}{/Shift}Second line");
		await expect(input).toHaveValue("First line\nSecond line");
		await userEvent.keyboard("{Enter}");
		await expect(args.onSubmit).toHaveBeenCalledWith("First line\nSecond line");
		await expect(input).toHaveValue("");
		await expect(input).toHaveFocus();
	},
};
