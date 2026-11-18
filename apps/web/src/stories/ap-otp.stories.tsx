import { OtpField } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
	title: "Components/Forms/Six-digit OTP",
	component: OtpField,
	args: {},
	parameters: {
		layout: "centered",
		figmaComponentId: "185:1606",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=185-1606",
		},
		docs: {
			description: {
				component:
					"One code string presented as six equal 48px-high fields in a 336px row with 8px gaps. Preserve leading zeroes, distribute paste/autofill, advance after entry and support arrow/backspace correction. The Empty specimen visually identifies the first entry position. Complete and Processing retain the entered digits; Processing locks input. A consuming form enables Verify only for six digits, prevents duplicate requests and resolves verification/resend from real server outcomes. The code shown here is a fixture, never a product constant.",
			},
		},
	},
} satisfies Meta<typeof OtpField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
	args: { defaultValue: "", processing: false },
	parameters: { figmaVariantId: "185:1607" },
};
export const Complete: Story = {
	args: { defaultValue: "482691", processing: false },
	parameters: { figmaVariantId: "185:1638" },
};
export const Processing: Story = {
	args: { defaultValue: "482691", processing: true },
	parameters: { figmaVariantId: "185:1669" },
};
export const LeadingZeroPasteGuide: Story = {
	args: { initialFocus: false, onValueChange: fn() },
	play: async ({ canvasElement, args }) => {
		const inputs = within(canvasElement).getAllByRole("textbox");
		await userEvent.click(inputs[0]);
		await userEvent.paste("012345");
		for (let index = 0; index < 6; index++)
			await expect(inputs[index]).toHaveValue("012345"[index]);
		await expect(args.onValueChange).toHaveBeenLastCalledWith("012345");
		await userEvent.keyboard("{Backspace}");
		await expect(inputs[5]).toHaveValue("");
	},
};
export const IncorrectCode: Story = {
	args: {
		defaultValue: "012345",
		error: "This code is incorrect. Check the code and try again.",
	},
};
export const CorrectionGuide: Story = {
	args: { defaultValue: "012345", initialFocus: false, onValueChange: fn() },
	parameters: {
		docs: {
			description: {
				story:
					"Backspace clears the current digit without shifting later positions. Backspace from an empty position moves to and clears the previous digit. Arrow keys navigate positions; typing overwrites the selected digit. The public value remains one string, retaining leading zeroes.",
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const inputs = within(canvasElement).getAllByRole("textbox");
		await userEvent.click(inputs[2]);
		await userEvent.keyboard("{Backspace}");
		await expect(inputs[2]).toHaveValue("");
		await expect(inputs[3]).toHaveValue("3");
		await expect(inputs[5]).toHaveValue("5");
		await userEvent.type(inputs[2], "2");
		await expect(inputs[2]).toHaveValue("2");
		await expect(inputs[3]).toHaveValue("3");
		await expect(args.onValueChange).toHaveBeenLastCalledWith("012345");
	},
};
