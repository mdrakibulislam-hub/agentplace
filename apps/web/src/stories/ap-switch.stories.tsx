import { Switch } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
	title: "Components/Forms/Switch",
	component: Switch,
	args: { label: "Enable setting" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:692",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-692",
		},
		docs: {
			description: {
				component:
					"Native keyboard-operable AP selection control. Toggle with Space/Enter or a pointer; the current value is exposed through aria-checked. Disabled controls cannot change. A 44px invisible interaction area surrounds the original 20px visual height. Controlled usage receives checked and onCheckedChange; an uncontrolled example receives defaultChecked. Changes do not imply persisted permissions or connection state.",
			},
		},
	},
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OffDefault: Story = {
	args: { checked: false, state: "default" },
	parameters: { figmaVariantId: "32:684" },
};
export const OffHover: Story = {
	args: { checked: false, state: "hover" },
	parameters: { figmaVariantId: "32:685" },
};
export const OffFocus: Story = {
	args: { checked: false, state: "focus" },
	parameters: { figmaVariantId: "32:686" },
};
export const OffDisabled: Story = {
	args: { checked: false, state: "disabled" },
	parameters: { figmaVariantId: "32:687" },
};
export const OnDefault: Story = {
	args: { checked: true, state: "default" },
	parameters: { figmaVariantId: "32:688" },
};
export const OnHover: Story = {
	args: { checked: true, state: "hover" },
	parameters: { figmaVariantId: "32:689" },
};
export const OnFocus: Story = {
	args: { checked: true, state: "focus" },
	parameters: { figmaVariantId: "32:690" },
};
export const OnDisabled: Story = {
	args: { checked: true, state: "disabled" },
	parameters: { figmaVariantId: "32:691" },
};
export const ToggleGuide: Story = {
	args: { checked: undefined, defaultChecked: false, onCheckedChange: fn() },
	play: async ({ canvasElement, args }) => {
		const control = within(canvasElement).getByRole("switch");
		await userEvent.click(control);
		await expect(control).toHaveAttribute("aria-checked", "true");
		await userEvent.keyboard(" ");
		await expect(control).toHaveAttribute("aria-checked", "false");
		await expect(args.onCheckedChange).toHaveBeenCalledTimes(2);
	},
};
