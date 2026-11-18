import { CoverActionsMenu } from "@agentplace/ui/components/ap-menus";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/06 Menus/Cover actions",
	component: CoverActionsMenu,
	parameters: {
		design: figma("139:1490"),
		figmaNodeId: "139:1490",
		docs: {
			description: {
				component:
					"240px cover menu. Upload and Remove are explicit actions; hovering does not open a picker or mutate an asset. Removal is disabled when there is no asset. The caller stages draft changes and preserves the old image on upload cancellation/failure.",
			},
		},
	},
	args: { hasCover: true, onUpload: fn(), onRemove: fn(), onClose: fn() },
} satisfies Meta<typeof CoverActionsMenu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const NoCover: Story = { args: { hasCover: false } };
export const ReadOnly: Story = { args: { canEdit: false } };
