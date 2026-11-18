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
					"Transparent1440 ×640 decorative field anchored to the page bottom. Theme aliases mint→cyan→sky;140px main field and132px/8% diffusion. Exact32-second native cycle with cubic-bezier(.42,0,.58,1), constant opacity, matching0s/32s endpoints. Flow starts at internalPhase0; other phases are inspection specimens, not product settings. Still has the identical resting image without animation. One wash only on auth/OTP/home, below all content and overlays. No pointer interaction or accessible status; pause hidden/offscreen. Mobile scales blur and travel; builder/settings do not inherit this wash.",
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
