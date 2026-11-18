import { PasswordField } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta = {
	title: "Components/Forms/Password field",
	component: PasswordField,
	args: {},
	parameters: {
		layout: "centered",
		figmaComponentId: "51:1022",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=51-1022",
		},
		docs: {
			description: {
				component:
					"336px password field with the original soft resting appearance and a 32px Reicon eye action inside the 48px input. Forgot password belongs in the label row. Visibility toggling preserves the value; the accessible action name changes between Show and Hide password. Recovery delegates to the product flow rather than pretending to send email.",
			},
		},
	},
} satisfies Meta<typeof PasswordField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {},
	parameters: { figmaVariantId: "51:1022" },
};
export const Recovery: Story = { args: { showRecovery: true } };
export const VisibilityGuide: Story = {
	args: { defaultValue: "My secret password", showRecovery: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText("Password");
		await expect(input).toHaveAttribute("type", "password");
		await userEvent.click(
			canvas.getByRole("button", { name: "Show password" }),
		);
		await expect(input).toHaveAttribute("type", "text");
		await expect(input).toHaveValue("My secret password");
		await userEvent.click(
			canvas.getByRole("button", { name: "Hide password" }),
		);
		await expect(input).toHaveAttribute("type", "password");
	},
};
