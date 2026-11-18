import { SelectField } from "@agentplace/ui/components/ap-controls";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Forms/Select",
	component: SelectField,
	args: { label: "Project role", placeholder: "Choose a role" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:600",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-600",
		},
		docs: {
			description: {
				component:
					"Shared AP field: 320px width, 6px label/control/help gaps, SF Pro 14/20 Medium label and 12/16 help in a 20px slot. The resting fill is muted with a soft border; hover emphasizes only the border and focus uses the white card fill with a 2px focus ring. Error has a readable inline message associated with the control; disabled blocks editing. Explicit states document Figma variants, while ordinary focus/hover are driven by the browser.",
			},
		},
	},
} satisfies Meta<typeof SelectField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	args: { state: "default" },
	parameters: { figmaVariantId: "32:594" },
};
export const Hover: Story = {
	args: { state: "hover" },
	parameters: { figmaVariantId: "32:595" },
};
export const Focus: Story = {
	args: { state: "focus" },
	parameters: { figmaVariantId: "32:596" },
};
export const Filled: Story = {
	args: { state: "filled", defaultValue: "editor" },
	parameters: { figmaVariantId: "32:597" },
};
export const ErrorState: Story = {
	name: "Error",
	args: { state: "error" },
	parameters: { figmaVariantId: "32:598" },
};
export const Disabled: Story = {
	args: { state: "disabled" },
	parameters: { figmaVariantId: "32:599" },
};
