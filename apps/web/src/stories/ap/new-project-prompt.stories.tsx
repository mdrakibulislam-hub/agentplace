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
					"768 × 144 prompt with 24px padding and no shadow. Create project uses 16px left and right padding. Enter submits once; Shift+Enter inserts a line. Empty prompts are blocked. Loading locks the request and keeps layout stable; a rejected callback preserves input and displays its error. Suggestions insert editable text. Website/file attachment is an explicit callback.",
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
