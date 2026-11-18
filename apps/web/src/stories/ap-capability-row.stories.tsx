import { CapabilityRow } from "@agentplace/ui/components/ap-data";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/Data/Capability row",
	component: CapabilityRow,
	args: {
		name: "Service recommendations",
		description:
			"Recommend the right service using approved company knowledge.",
	},
	parameters: {
		layout: "centered",
		figmaComponentId: "52:1090",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=52-1090",
		},
		docs: {
			description: {
				component:
					"1072×104px AP capability card. Name/description and action handlers are data, not constants. Enabled status, configuration and enabled toggle are independent. Available exposes Add skill. Network outcomes and permissions must be handled by the parent; the Storybook specimen only demonstrates the component.",
			},
		},
	},
} satisfies Meta<typeof CapabilityRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Enabled: Story = {
	args: { state: "enabled" },
	parameters: { figmaVariantId: "52:1054" },
};
export const Available: Story = {
	args: { state: "available" },
	parameters: { figmaVariantId: "52:1067" },
};
