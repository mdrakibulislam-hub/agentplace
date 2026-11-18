import { ProjectToolbar } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/05 Navigation/Project toolbar",
	component: ProjectToolbar,
	parameters: {
		design: figma("49:1533"),
		figmaNodeId: "49:1533",
		docs: {
			description: {
				component:
					"1216 × 64. Draft, Published, and Changes preserve the distinction between the saved draft and immutable live version. Saving a draft never publishes. Publish and Manage publish invoke the parent flow; loading prevents duplicate requests. Save status is a polite live region.",
			},
		},
	},
	args: { name: "WhiteFrame Advisor", onPublish: fn() },
} satisfies Meta<typeof ProjectToolbar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Draft: Story = { parameters: { figmaVariantId: "49:1472" } };
export const Published: Story = {
	parameters: { figmaVariantId: "49:1495" },
	args: { status: "published" },
};
export const Changes: Story = {
	parameters: { figmaVariantId: "49:1513" },
	args: { status: "changes" },
};
export const Publishing: Story = { args: { publishing: true } };
export const Unsaved: Story = { args: { saved: false } };
