import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, mocked, userEvent, within } from "storybook/test";
import { AuthExperience } from "../../product/auth/auth-experience";
import { figma } from "./fixtures";

const meta = {
	title: "Product/Authentication",
	component: AuthExperience,
	parameters: { layout: "fullscreen" },
	args: { onAuthenticated: fn() },
} satisfies Meta<typeof AuthExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
	parameters: { design: figma("493:14551") },
	args: { initialLastMethod: "email" },
};

export const GoogleLastUsed: Story = {
	parameters: { design: figma("53:119") },
	args: { initialLastMethod: "google" },
};

export const Signup: Story = {
	parameters: { design: figma("53:208") },
	args: { initialScreen: "signup" },
};

const email = "alex@example.com";
const code = "024691";
const resendDelaySeconds = 55;

export const VerificationEmpty: Story = {
	parameters: { design: figma("53:284") },
	args: {
		initialScreen: "verify",
		verificationPreview: { email, resendDelaySeconds },
	},
};

export const VerificationEntered: Story = {
	parameters: { design: figma("186:5625") },
	args: {
		initialScreen: "verify",
		verificationPreview: { email, code, resendDelaySeconds },
	},
};

export const VerificationProcessing: Story = {
	parameters: { design: figma("186:5647") },
	args: {
		initialScreen: "verify",
		verificationPreview: { email, code, processing: true, resendDelaySeconds },
	},
};

export const VerificationRetry: Story = {
	args: {
		initialScreen: "verify",
		verificationPreview: { email, code },
		onAuthenticated: fn(),
		onVerify: fn(),
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const request = Promise.withResolvers<void>();
		if (!args.onVerify)
			throw new Error("The verification fixture is required.");
		const verify = mocked(args.onVerify)
			.mockImplementationOnce(() => request.promise)
			.mockResolvedValueOnce(undefined);
		const submit = canvas.getByRole("button", { name: "Verify email" });
		await userEvent.click(submit);
		await expect(
			canvas.getByRole("button", { name: "Verifying…" }),
		).toBeDisabled();
		await expect(verify).toHaveBeenCalledOnce();
		await expect(verify).toHaveBeenCalledWith(
			email,
			code,
			expect.any(AbortSignal),
		);
		request.reject(new Error("Code expired. Request a new code."));
		await expect(await canvas.findByRole("alert")).toHaveTextContent(
			"Code expired.",
		);
		const firstDigit = canvas.getByRole("textbox", {
			name: "Verification code, digit 1 of 6",
		});
		await expect(firstDigit).toHaveValue("0");
		await expect(firstDigit).toHaveFocus();
		await userEvent.click(submit);
		await expect(args.onAuthenticated).toHaveBeenCalledWith({
			email,
			isNewAccount: true,
		});
	},
};

export const ResendVerificationCode: Story = {
	args: {
		initialScreen: "verify",
		verificationPreview: { email, code },
		onResendCode: fn(),
	},
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const request = Promise.withResolvers<{ resendAt?: number }>();
		if (!args.onResendCode) throw new Error("The resend fixture is required.");
		const resend = mocked(args.onResendCode).mockImplementationOnce(
			() => request.promise,
		);
		const trigger = canvas.getByRole("button", { name: "Resend code" });
		await userEvent.click(trigger);
		await expect(trigger).toBeDisabled();
		await expect(resend).toHaveBeenCalledWith(email, expect.any(AbortSignal));
		request.resolve({ resendAt: Date.now() + resendDelaySeconds * 1000 });
		await expect(await canvas.findByText("A new code was sent.")).toBeVisible();
		await expect(canvas.getByText(/Resend code in /)).toBeVisible();
		const firstDigit = canvas.getByRole("textbox", {
			name: "Verification code, digit 1 of 6",
		});
		await expect(firstDigit).toHaveValue("");
		await expect(firstDigit).toHaveFocus();
		await expect(
			canvas.getByRole("button", { name: "Verify email" }),
		).toBeDisabled();
	},
};
