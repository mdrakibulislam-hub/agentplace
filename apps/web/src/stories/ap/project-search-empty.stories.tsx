import { ProjectSearchEmpty } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Project search empty",
	component: ProjectSearchEmpty,
	parameters: {
		design: figma("131:1577"),
		figmaNodeId: "131:1577",
		docs: {
			description: {
				component:
					"The supplied no-results state preserves the query and explains recovery. Clear search resets the query and returns the current project set; it does not create a project or switch filters. The live example demonstrates this transition.",
			},
		},
	},
	args: {
		projects,
		query: "Marketing",
		onQueryChange: fn(),
		onSelect: fn(),
		onClose: fn(),
	},
} satisfies Meta<typeof ProjectSearchEmpty>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NoResults: Story = {};
function SearchExample() {
	const [query, setQuery] = useState("Marketing");
	return (
		<ProjectSearchEmpty
			projects={projects}
			query={query}
			onQueryChange={setQuery}
		/>
	);
}
export const ClearInteraction: Story = {
	render: () => <SearchExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("No matching projects")).toBeVisible();
		await userEvent.click(
			canvas.getAllByRole("button", { name: "Clear search" })[0],
		);
		await expect(canvas.getByRole("combobox")).toHaveValue("");
		await expect(canvas.getAllByRole("option")).toHaveLength(3);
	},
};
