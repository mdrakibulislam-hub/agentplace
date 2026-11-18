import { IconButton } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Actions/Icon button",
	component: IconButton,
	args: { label: "Send message", name: "arrow-up" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:479",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-479",
		},
		docs: {
			description: {
				component:
					"Pill-shaped AP action. Small is 32px high with 12px side padding; Medium is 40px with 16px side padding. SF Pro Medium 510, 14/20. Hover, press and keyboard focus use the original semantic tokens. Loading keeps its accessible label and prevents duplicate activation; disabled actions do nothing. The explicit state controls are visual specimens; normal usage lets pointer/keyboard state drive the appearance. Use a fixed action width in asynchronous forms so loading never shifts adjacent controls. Touch layouts need a 44px hit target. Icon actions require a meaningful accessible label. The artwork is Reicon arrow-up at 16px/20px.",
			},
		},
	},
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SmallDefault: Story = {
	args: { size: "Small", state: "default" },
	parameters: { figmaVariantId: "32:467" },
};
export const SmallHover: Story = {
	args: { size: "Small", state: "hover" },
	parameters: { figmaVariantId: "32:468" },
};
export const SmallPressed: Story = {
	args: { size: "Small", state: "pressed" },
	parameters: { figmaVariantId: "32:469" },
};
export const SmallFocus: Story = {
	args: { size: "Small", state: "focus" },
	parameters: { figmaVariantId: "32:470" },
};
export const SmallDisabled: Story = {
	args: { size: "Small", state: "disabled" },
	parameters: { figmaVariantId: "32:471" },
};
export const SmallLoading: Story = {
	args: { size: "Small", state: "loading" },
	parameters: { figmaVariantId: "32:472" },
};
export const MediumDefault: Story = {
	args: { size: "Medium", state: "default" },
	parameters: { figmaVariantId: "32:473" },
};
export const MediumHover: Story = {
	args: { size: "Medium", state: "hover" },
	parameters: { figmaVariantId: "32:474" },
};
export const MediumPressed: Story = {
	args: { size: "Medium", state: "pressed" },
	parameters: { figmaVariantId: "32:475" },
};
export const MediumFocus: Story = {
	args: { size: "Medium", state: "focus" },
	parameters: { figmaVariantId: "32:476" },
};
export const MediumDisabled: Story = {
	args: { size: "Medium", state: "disabled" },
	parameters: { figmaVariantId: "32:477" },
};
export const MediumLoading: Story = {
	args: { size: "Medium", state: "loading" },
	parameters: { figmaVariantId: "32:478" },
};
