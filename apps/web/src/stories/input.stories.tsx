import { Input } from "@agentplace/ui/components/input";
import { Label } from "@agentplace/ui/components/label";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Input",
	component: Input,
	args: { id: "customer-email", type: "email", placeholder: "you@example.com" },
	decorators: [
		(Story) => (
			<div className="grid max-w-sm gap-2">
				<Label htmlFor="customer-email">Email address</Label>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = {
	args: { "aria-invalid": true, defaultValue: "invalid-email" },
};
