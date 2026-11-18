import { Logo } from "@agentplace/ui/components/ap-brand";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/01 Brand/Logo",
	component: Logo,
	args: { animated: true },
	parameters: {
		figmaComponentId: "45:643",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=45-643",
		},
		docs: {
			description: {
				component:
					"Original180 ×33.848 vector wordmark, including native6.8-second paired-eyelid blink. Default follows foreground/default. Inverse uses the original#FCFCFC artwork on a dark surface. Never retype or distort the wordmark. The original vectors are bundled locally. Reduced motion freezes the resting artwork; background tabs pause decorative motion.",
			},
		},
	},
} satisfies Meta<typeof Logo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "45:567" } };
export const Inverse: Story = {
	args: { inverse: true },
	decorators: [
		(Story) => (
			<div style={{ background: "#2a2a2a", padding: 24 }}>
				<Story />
			</div>
		),
	],
	parameters: { figmaVariantId: "45:641" },
};
export const Still: Story = { args: { animated: false } };
