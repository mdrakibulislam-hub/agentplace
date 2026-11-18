import { ProjectSearchResults } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Project search results",
	component: ProjectSearchResults,
	parameters: {
		design: figma("131:1545"),
		figmaNodeId: "131:1545",
		docs: {
			description: {
				component:
					"384px search combobox. Query filters actual supplied data, exposes the result count and clear button, and preserves publication metadata. Clear removes the query. Up/Down moves choices; Enter activates. Search-empty is not the first-project empty state.",
			},
		},
	},
	args: {
		projects,
		query: "White",
		onQueryChange: fn(),
		onSelect: fn(),
		onClose: fn(),
	},
} satisfies Meta<typeof ProjectSearchResults>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OneResult: Story = {};
