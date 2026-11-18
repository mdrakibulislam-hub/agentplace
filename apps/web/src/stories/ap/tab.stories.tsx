import { Tab, Tabs } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma } from "./fixtures";

function TabsExample() {
	const [value, setValue] = useState("preview");
	return (
		<>
			<Tabs
				tabs={[
					{ value: "preview", label: "Preview" },
					{ value: "settings", label: "Settings" },
					{ value: "disabled", label: "Unavailable", disabled: true },
				]}
				value={value}
				onChange={setValue}
			/>
			<div role="tabpanel" style={{ marginTop: 16 }}>
				{value === "preview" ? "Agent preview" : "Agent settings"}
			</div>
		</>
	);
}
const meta = {
	title: "Components/05 Navigation/Tab",
	component: Tab,
	parameters: {
		design: figma("32:706"),
		figmaNodeId: "32:706",
		docs: {
			description: {
				component:
					"All five supplied states. Tabs use a semantic tablist and roving tab stop. Left/Right arrows move selection, Home/End jump to the first/last enabled tab, and disabled choices are skipped. The interactive example demonstrates controlled state without changing page navigation.",
			},
		},
	},
	args: { children: "Preview", onClick: fn() },
} satisfies Meta<typeof Tab>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	parameters: { figmaVariantId: "32:701" },
	decorators: [
		(Story) => (
			<div role="tablist" aria-label="View">
				<Story />
			</div>
		),
	],
};
export const Hover: Story = {
	parameters: { figmaVariantId: "32:702" },
	args: { state: "hover" },
	decorators: [
		(Story) => (
			<div role="tablist" aria-label="View">
				<Story />
			</div>
		),
	],
};
export const Selected: Story = {
	parameters: { figmaVariantId: "32:703" },
	args: { state: "selected" },
	decorators: [
		(Story) => (
			<div role="tablist" aria-label="View">
				<Story />
			</div>
		),
	],
};
export const Focus: Story = {
	parameters: { figmaVariantId: "32:704" },
	args: { state: "focus" },
	decorators: [
		(Story) => (
			<div role="tablist" aria-label="View">
				<Story />
			</div>
		),
	],
};
export const Disabled: Story = {
	parameters: { figmaVariantId: "32:705" },
	args: { state: "disabled" },
	decorators: [
		(Story) => (
			<div role="tablist" aria-label="View">
				<Story />
			</div>
		),
	],
};
export const KeyboardInteraction: Story = {
	render: () => <TabsExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("tab", { name: "Preview" }));
		await userEvent.keyboard("{ArrowRight}");
		await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveFocus();
		await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveAttribute(
			"aria-selected",
			"true",
		);
		await userEvent.keyboard("{ArrowRight}");
		await expect(canvas.getByRole("tab", { name: "Preview" })).toHaveFocus();
		await userEvent.keyboard("{End}");
		await expect(canvas.getByRole("tab", { name: "Settings" })).toHaveFocus();
		await userEvent.keyboard("{Home}");
		await expect(canvas.getByRole("tab", { name: "Preview" })).toHaveFocus();
	},
};
