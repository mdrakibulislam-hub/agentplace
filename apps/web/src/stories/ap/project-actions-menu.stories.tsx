import { ProjectActionsMenu } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Project actions",
	component: ProjectActionsMenu,
	parameters: {
		design: figma("131:1460"),
		figmaNodeId: "131:1460",
		docs: {
			description: {
				component:
					"240px contextual menu. Every callback receives this project ID. Drafts offer Publish; live projects offer Unpublish. Copy live link requires an actual live URL. Delete must open a confirmation flow; this component never deletes by itself. Read-only permissions disable editing.",
			},
		},
	},
	args: { project: projects[0], onAction: fn(), onClose: fn() },
} satisfies Meta<typeof ProjectActionsMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Published: Story = {};
export const Unpublished: Story = { args: { project: projects[1] } };
export const ReadOnly: Story = { args: { canEdit: false } };
