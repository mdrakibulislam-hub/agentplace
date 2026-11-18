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
					"Original VentureBeat, USA Today, and Fast Company SVGs with exact proportions and404.877 ×20 group bounds. Shared footer on login/signup/OTP,48px from the desktop bottom at1440 ×960. Logos stay above the decorative color wash. Never replace with typed brand names.",
			},
		},
	},
} satisfies Meta<typeof ClientLogos>;
export const Default: StoryObj<typeof ClientLogos> = {};
