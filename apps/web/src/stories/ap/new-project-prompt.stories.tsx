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
					"The idle placeholder loops through three examples prefixed with e.g. and the original instruction. Interaction or reduced motion brings back the instruction immediately. Longer prompts grow the composer from 144px to 224px, then scroll inside the field. The paperclip opens attachments, and the model control opens the picker below the toolbar. Enter submits once, Shift+Enter inserts a line, and a rejected callback preserves the prompt and mode.",
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
	parameters: { design: figma("456:2544") },
	args: {
		defaultValue: [
			"Build an agent that introduces our design studio and answers common questions.",
			"Explain our services, typical timelines, and how projects are scoped.",
			"Collect a short project brief when someone is ready to get in touch.",
			"Use our website as the source for service and contact details.",
			"Ask about the visitor’s goals, timeline, and budget.",
			"Suggest the best next step based on their answers.",
			"Hand off enquiries that need a personal reply.",
			"Keep responses clear and concise.",
		].join("\n"),
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
