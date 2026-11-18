import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
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
	parameters: { design: figma("53:8") },
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

export const VerificationEmpty: Story = {
	parameters: { design: figma("53:284") },
	args: { initialScreen: "verify", verificationPreview: { email } },
};

export const VerificationEntered: Story = {
	parameters: { design: figma("186:5625") },
	args: { initialScreen: "verify", verificationPreview: { email, code } },
};

export const VerificationProcessing: Story = {
	parameters: { design: figma("186:5647") },
	args: {
		initialScreen: "verify",
		verificationPreview: { email, code, processing: true },
	},
};
