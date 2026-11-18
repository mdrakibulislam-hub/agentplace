import { ProjectCard } from "@agentplace/ui/components/ap-builder";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/Project card",
	component: ProjectCard,
	parameters: {
		design: figma("49:1705"),
		figmaNodeId: "49:1705",
		docs: {
			description: {
				component:
					"352px card, 320 × 124 cover, name/status on one row and edited time below. Publication and cover state are independent. Open project, edit cover and overflow actions are separate buttons bound to the correct project ID. Hover/focus temporarily reveals upload without deleting the current asset. Read-only cards never expose cover editing. Sample names and IDs exist only in stories.",
			},
		},
	},
	args: {
		project: projects[0],
		onOpen: fn(),
		onCoverEdit: fn(),
		onAction: fn(),
	},
} satisfies Meta<typeof ProjectCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Published: Story = { parameters: { figmaVariantId: "49:1643" } };
export const Unpublished: Story = {
	parameters: { figmaVariantId: "49:1674" },
	args: { project: { ...projects[0], status: "Unpublished" } },
};
export const ReadOnly: Story = { args: { canEdit: false } };

export const CoverDoesNotNavigate: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "Add project cover" }),
		);
		await expect(args.onCoverEdit).toHaveBeenCalledWith(args.project.id);
		await expect(args.onOpen).not.toHaveBeenCalled();
	},
};
