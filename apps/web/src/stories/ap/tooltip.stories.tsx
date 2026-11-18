import { Tooltip } from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Tooltip",
	component: Tooltip,
	parameters: {
		design: figma("32:744"),
		figmaNodeId: "32:744",
		docs: {
			description: {
				component:
					"The 12/16 medium tooltip uses action/default and action/foreground with 8px padding and radius-sm. Hover or focus the trigger; Escape dismisses. Essential instructions must remain visible outside a tooltip for touch and assistive technology.",
			},
		},
	},
	args: { label: "More information" },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "32:743" } };
export const OnFocusOrHover: Story = {
	args: { children: <Button variant="secondary">Hover or focus</Button> },
};

export const HoverAndEscape: Story = {
	args: { children: <Button variant="secondary">Hover for help</Button> },
	parameters: {
		docs: {
			description: {
				story:
					"Hover reveals the tooltip after the shared delay. Escape dismisses it without moving focus. The tooltip supplements the visible control label; it is never the only place for essential instructions.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.hover(
			canvas.getByRole("button", { name: "Hover for help" }),
		);
		await expect(await body.findByRole("tooltip")).toHaveTextContent(
			"More information",
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(body.queryByRole("tooltip")).not.toBeInTheDocument(),
		);
	},
};
export const KeyboardFocusAndEscape: Story = {
	args: { children: <Button variant="secondary">Focus for help</Button> },
	parameters: {
		docs: {
			description: {
				story:
					"Tab reaches the named trigger and reveals the same tooltip as hover. Escape dismisses it while the trigger retains focus. Touch users retain the visible trigger label; do not hide essential guidance in tooltips.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", { name: "Focus for help" });
		await userEvent.tab();
		await expect(trigger).toHaveFocus();
		fireEvent.focusIn(trigger);
		await expect(await body.findByRole("tooltip")).toHaveTextContent(
			"More information",
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(body.queryByRole("tooltip")).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
	},
};
