import { ProjectActions } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Actions/Project actions",
	component: ProjectActions,
	args: { label: "Project actions" },
	parameters: {
		layout: "centered",
		figmaComponentId: "108:1306",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=108-1306",
		},
		docs: {
			description: {
				component:
					"32px transparent overflow action using the original filled three-dot icon. Tertiary at rest, primary foreground over a muted background on hover. Keep the action separate from opening a project card and bind its handler to the selected project.",
			},
		},
	},
} satisfies Meta<typeof ProjectActions>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: { state: "default" },
	parameters: { figmaVariantId: "107:1368" },
};
export const Hover: Story = {
	args: { state: "hover" },
	parameters: { figmaVariantId: "107:1376" },
};
