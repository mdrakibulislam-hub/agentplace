import { ClientLogos } from "@agentplace/ui/components/ap-brand";
import type { Meta, StoryObj } from "@storybook/react-vite";
export default {
	title: "Components/01 Brand/Client logos",
	component: ClientLogos,
	parameters: {
		figmaComponentId: "195:1678",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=195-1678",
		},
		docs: {
			description: {
				component:
					"The shared login, signup and OTP footer uses the original VentureBeat, USA Today and Fast Company SVGs. The logo/partner token applies black at 30% alpha over the auth gradient. The footer is 48px from the bottom at 1440 × 960.",
			},
		},
	},
} satisfies Meta<typeof ClientLogos>;
export const Default: StoryObj<typeof ClientLogos> = {};
