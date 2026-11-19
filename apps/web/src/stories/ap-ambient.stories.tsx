import { AmbientBottomGradient } from "@agentplace/ui/components/ap-ambient";
import type { Meta, StoryObj } from "@storybook/react-vite";
export default {
	title: "Components/11 Ambient surfaces & elevation/Bottom gradient",
	component: AmbientBottomGradient,
	parameters: {
		layout: "fullscreen",
		figmaComponentId: "237:1980",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=237-1980",
		},
		docs: {
			description: {
				component:
					"Transparent 1440 × 640 decorative field anchored to the bottom of project home. A 140px mint-to-cyan-to-sky field and a 132px diffusion layer drift over a 32-second loop. Flow starts at Phase 0. Still uses the same resting composition. The wash stays below content and overlays and pauses while hidden or offscreen.",
			},
		},
	},
} satisfies Meta<typeof AmbientBottomGradient>;
type Story = StoryObj<typeof AmbientBottomGradient>;
export const Flow: Story = {
	args: { motion: "Flow", phase: 0 },
	parameters: { figmaVariantId: "237:1981" },
};
export const Still: Story = {
	args: { motion: "Still", phase: 0 },
	parameters: { figmaVariantId: "237:1984" },
};
export const Phase1: Story = {
	args: { motion: "Flow", phase: 1 },
	parameters: { figmaVariantId: "253:1971" },
};
export const Phase2: Story = {
	args: { motion: "Flow", phase: 2 },
	parameters: { figmaVariantId: "253:2000" },
};
export const Phase3: Story = {
	args: { motion: "Flow", phase: 3 },
	parameters: { figmaVariantId: "253:2029" },
};
