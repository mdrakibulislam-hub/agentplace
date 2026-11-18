import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
	title: "Components/Actions/Secondary button",
	component: Button,
	args: { children: "Continue", variant: "secondary" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:152",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-152",
		},
		docs: {
			description: {
				component:
					"Pill-shaped AP action. Small is 32px high with 12px side padding; Medium is 40px with 16px side padding. SF Pro Medium 510, 14/20. Hover, press and keyboard focus use the original semantic tokens. Loading keeps its accessible label and prevents duplicate activation; disabled actions do nothing. The explicit state controls are visual specimens; normal usage lets pointer/keyboard state drive the appearance. Use a fixed action width in asynchronous forms so loading never shifts adjacent controls. Touch layouts need a 44px hit target.",
			},
		},
	},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SmallDefault: Story = {
	args: { size: "Small", state: "default" },
	parameters: { figmaVariantId: "32:140" },
};
export const SmallHover: Story = {
	args: { size: "Small", state: "hover" },
	parameters: { figmaVariantId: "32:141" },
};
export const SmallPressed: Story = {
	args: { size: "Small", state: "pressed" },
	parameters: { figmaVariantId: "32:142" },
};
export const SmallFocus: Story = {
	args: { size: "Small", state: "focus" },
	parameters: { figmaVariantId: "32:143" },
};
export const SmallDisabled: Story = {
	args: { size: "Small", state: "disabled" },
	parameters: { figmaVariantId: "32:144" },
};
export const SmallLoading: Story = {
	args: { size: "Small", state: "loading" },
	parameters: { figmaVariantId: "32:145" },
};
export const MediumDefault: Story = {
	args: { size: "Medium", state: "default" },
	parameters: { figmaVariantId: "32:146" },
};
export const MediumHover: Story = {
	args: { size: "Medium", state: "hover" },
	parameters: { figmaVariantId: "32:147" },
};
export const MediumPressed: Story = {
	args: { size: "Medium", state: "pressed" },
	parameters: { figmaVariantId: "32:148" },
};
export const MediumFocus: Story = {
	args: { size: "Medium", state: "focus" },
	parameters: { figmaVariantId: "32:149" },
};
export const MediumDisabled: Story = {
	args: { size: "Medium", state: "disabled" },
	parameters: { figmaVariantId: "32:150" },
};
export const MediumLoading: Story = {
	args: { size: "Medium", state: "loading" },
	parameters: { figmaVariantId: "32:151" },
};
export const ActivationGuide: Story = {
	args: { onClick: fn() },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole("button"));
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tab focuses the action; Enter and Space activate it. Hover and press have distinct appearances. Use the Loading specimen while a real request is pending, and resolve success/error from the request rather than an animation timer.",
			},
		},
	},
};
