import {
	ModelPicker,
	ModelPickerPanel,
} from "@agentplace/ui/components/ap-model-picker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Model picker",
	component: ModelPickerPanel,
	parameters: {
		layout: "centered",
		design: figma("434:13546"),
		figmaNodeId: "434:13546",
		docs: {
			description: {
				component:
					"Each model mode has a leading Reicon. The current mode is highlighted and appears on the composer trigger in the secondary foreground color. The picker opens 8px from the trigger and repositions at viewport edges.",
			},
		},
	},
	args: { value: "Automatic" },
} satisfies Meta<typeof ModelPickerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Automatic: Story = {
	parameters: { figmaVariantId: "434:13547" },
};

export const Fast: Story = {
	args: { value: "Fast" },
	parameters: { figmaVariantId: "434:13585" },
};

export const Detailed: Story = {
	args: { value: "Detailed" },
	parameters: { figmaVariantId: "434:13623" },
};

export const Interactive: Story = {
	render: () => <ModelPicker />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const page = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", { name: "Model: Automatic" });
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		const automatic = await page.findByRole("menuitemradio", {
			name: "Automatic",
			checked: true,
		});
		await expect(automatic).toHaveFocus();
		await userEvent.keyboard("{ArrowDown}{Enter}");
		const selectedTrigger = canvas.getByRole("button", { name: "Model: Fast" });
		await expect(selectedTrigger).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await expect(
			await page.findByRole("menuitemradio", { name: "Fast", checked: true }),
		).toHaveFocus();
		await userEvent.keyboard("{Escape}");
		await expect(selectedTrigger).toHaveFocus();
	},
};
