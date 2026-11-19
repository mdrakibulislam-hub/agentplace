import { NewProjectPrompt } from "@agentplace/ui/components/ap-builder";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/New project prompt",
	component: NewProjectPrompt,
	parameters: {
		design: figma("52:1015"),
		figmaNodeId: "52:1015",
		docs: {
			description: {
				component:
					"The paperclip opens website and file attachments. The model control shows the current mode and opens the shared picker below the toolbar. Create project submits once with Enter, and Shift+Enter inserts a line. A rejected callback preserves the prompt and mode.",
			},
		},
	},
	args: { onSubmit: fn(), onAttach: fn() },
} satisfies Meta<typeof NewProjectPrompt>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Filled: Story = {
	args: { defaultValue: "Build an AI advisor for our design studio" },
};
export const LongPrompt: Story = {
	globals: { theme: "dark" },
	args: {
		defaultValue:
			"Build an agent that introduces our design studio and answers common questions.\nExplain our services, typical timelines, and how projects are scoped.\nWhen someone is ready to get in touch, collect a short project brief.\nUse our website as the source for service and contact details.",
	},
};
export const Submitting: Story = {
	args: {
		defaultValue: "Build an AI advisor for our design studio",
		submitting: true,
	},
};
export const RecoverableError: Story = {
	args: {
		defaultValue: "Build an AI advisor",
		error:
			"The project could not be created. Your prompt is preserved; try again.",
	},
};
