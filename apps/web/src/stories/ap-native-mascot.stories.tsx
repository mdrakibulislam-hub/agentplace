import { Mascot } from "@agentplace/ui/components/ap-brand";
import type { Meta, StoryObj } from "@storybook/react-vite";
export default {
	title: "Components/09 Motion & mascot/Native artwork",
	component: Mascot,
	args: { animated: true, size: 30 },
	parameters: {
		figmaComponentId: "169:1570",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=169-1570",
		},
		docs: {
			description: {
				component:
					"Exact compact native artwork,26.564 ×30, with original face and separately animated paired eyelids. The native Figma cohort is2 seconds and loops; transforms share one lifecycle. Controls may scale uniformly. In reduced motion there is no squash, travel or blink.",
			},
		},
	},
} satisfies Meta<typeof Mascot>;
export const Default: StoryObj<typeof Mascot> = {};
export const Still: StoryObj<typeof Mascot> = { args: { animated: false } };
