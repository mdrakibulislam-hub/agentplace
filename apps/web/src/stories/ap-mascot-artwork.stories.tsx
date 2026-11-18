import { MascotArtwork } from "@agentplace/ui/components/ap-brand";
import type { Meta, StoryObj } from "@storybook/react-vite";
export default {
	title: "Components/09 Motion & mascot/Original artwork",
	component: MascotArtwork,
	parameters: {
		figmaComponentId: "166:1528",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=166-1528",
		},
		docs: {
			description: {
				component:
					"Original A-mascot vectors,201 ×227. Open/Closed preserve the supplied paired eyes; foreground/default adapts to the theme. This artwork is not a generated replacement or font glyph.",
			},
		},
	},
} satisfies Meta<typeof MascotArtwork>;
type Story = StoryObj<typeof MascotArtwork>;
export const Open: Story = {
	args: { eyes: "Open" },
	parameters: { figmaVariantId: "166:1529" },
};
export const Closed: Story = {
	args: { eyes: "Closed" },
	parameters: { figmaVariantId: "166:1671" },
};
