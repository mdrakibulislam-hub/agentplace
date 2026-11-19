import { AuthGradient } from "@agentplace/ui/components/ap-ambient";
import type { Meta, StoryObj } from "@storybook/react-vite";

export default {
	title: "Components/11 Ambient surfaces & elevation/Auth gradient",
	component: AuthGradient,
	parameters: {
		layout: "fullscreen",
		figmaComponentId: "495:2607",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=495-2607",
		},
		docs: {
			description: {
				component:
					"Two blue-and-gold color fields sweep in opposing directions over a 16-second loop. Blur and grain are baked into the artwork. Still shows the resting composition, and Flow pauses while the background is hidden or offscreen.",
			},
		},
	},
} satisfies Meta<typeof AuthGradient>;

type Story = StoryObj<typeof AuthGradient>;

export const Flow: Story = {
	args: { motion: "Flow", phase: 0 },
	parameters: { figmaVariantId: "495:2608" },
};

export const Still: Story = {
	args: { motion: "Still", phase: 0 },
	parameters: { figmaVariantId: "495:2611" },
};

export const Phase1: Story = {
	args: { motion: "Flow", phase: 1 },
	parameters: { figmaVariantId: "495:2614" },
};

export const Phase2: Story = {
	args: { motion: "Flow", phase: 2 },
	parameters: { figmaVariantId: "495:2617" },
};

export const Phase3: Story = {
	args: { motion: "Flow", phase: 3 },
	parameters: { figmaVariantId: "495:2620" },
};
