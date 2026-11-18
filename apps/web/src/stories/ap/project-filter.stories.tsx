import { ProjectFilter } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Project filter",
	component: ProjectFilter,
	parameters: {
		design: figma("131:1414"),
		figmaNodeId: "131:1414",
		docs: {
			description: {
				component:
					"240px menu filters actual provided projects and calculates counts. All/Published/Unpublished select one status. Escape and outside pointer close an anchored menu and restore focus. Counts are never hardcoded in the component.",
			},
		},
	},
	args: { projects, value: "all", onChange: fn(), onClose: fn() },
} satisfies Meta<typeof ProjectFilter>;
export default meta;
type Story = StoryObj<typeof meta>;
export const All: Story = {};
export const Published: Story = { args: { value: "published" } };
export const Unpublished: Story = { args: { value: "unpublished" } };

function FilterExample() {
	const [value, setValue] = useState<"all" | "published" | "unpublished">(
		"all",
	);
	return (
		<ProjectFilter projects={projects} value={value} onChange={setValue} />
	);
}
export const KeyboardSelection: Story = {
	render: () => <FilterExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("menuitemradio", { name: /Published 2/ }),
		);
		await expect(
			canvas.getByRole("menuitemradio", { name: /Published 2/ }),
		).toHaveAttribute("aria-checked", "true");
	},
};
