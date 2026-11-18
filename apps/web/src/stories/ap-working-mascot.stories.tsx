import { WorkingMascot } from "@agentplace/ui/components/ap-working-indicator";
import type { Meta, StoryObj } from "@storybook/react-vite";
export default {
	title: "Components/09 Motion & mascot/Working mascot",
	component: WorkingMascot,
	args: { motion: "Loop", phase: "Rest" },
	parameters: {
		figmaComponentId: "166:1812",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=166-1812",
		},
		docs: {
			description: {
				component:
					"The40 ×48 working wrapper holds the original26.564 ×30 mascot. Native2-second Rest→Crouch→Air→Land→Settle→Blink timeline, exact2.643px hop and source spring curve. Phase stories are fixed inspection specimens, not persisted product states. Mount only while actual work is pending; stop on completion/error/cancel. Loop pauses offscreen/when hidden. Reduced motion keeps a still mascot.",
			},
		},
	},
} satisfies Meta<typeof WorkingMascot>;
type Story = StoryObj<typeof WorkingMascot>;
export const Rest: Story = { parameters: { figmaVariantId: "166:1813" } };
export const Crouch: Story = {
	args: { phase: "Crouch" },
	parameters: { figmaVariantId: "166:1822" },
};
export const Air: Story = {
	args: { phase: "Air" },
	parameters: { figmaVariantId: "166:1830" },
};
export const Land: Story = {
	args: { phase: "Land" },
	parameters: { figmaVariantId: "166:1838" },
};
export const Settle: Story = {
	args: { phase: "Settle" },
	parameters: { figmaVariantId: "166:1846" },
};
export const Blink: Story = {
	args: { phase: "Blink" },
	parameters: { figmaVariantId: "166:1854" },
};
export const Reduced: Story = {
	args: { motion: "Reduced" },
	parameters: { figmaVariantId: "166:1862" },
};
