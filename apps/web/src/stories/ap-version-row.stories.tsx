import { VersionRow } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Version row",
	component: VersionRow,
	args: {
		version: "V4",
		title: "Updated company branding",
		meta: "Today, 11:15 · Rakib",
	},
	parameters: {
		layout: "centered",
		figmaComponentId: "52:1091",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1091",
		},
		docs: {
			description: {
				component:
					"1072×104px history row with a 40px version tile, title, localized metadata, Current draft badge and View action. Viewing/restoring is delegated to the parent; restoring a version must never silently publish it.",
			},
		},
	},
} satisfies Meta<typeof VersionRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: {},
	parameters: { figmaVariantId: "52:1091" },
};
