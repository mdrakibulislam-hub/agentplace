import {
	GlobalHeader,
	ThemeSwitch,
} from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useTheme } from "../../components/theme-provider";
import { figma } from "./fixtures";

const meta = {
	title: "Components/05 Navigation/Global header",
	component: GlobalHeader,
	parameters: {
		design: figma("116:11267"),
		figmaNodeId: "116:11267",
		docs: {
			description: {
				component:
					"Figma Default and Secondary are 1440 × 64. The right side contains credits, a light and dark theme switch, and the account menu. Workspace settings open from the account menu. Credits derive from the same remaining and allocation values as billing.",
			},
		},
	},
	args: {
		project: "WhiteFrame Advisor",
		remainingCredits: 1985,
		allocatedCredits: 2000,
		initials: "RA",
		onProjectSwitch: fn(),
		onCredits: fn(),
		onAccount: fn(),
	},
	render: function HeaderStory(args) {
		const { resolvedTheme, setTheme } = useTheme();
		return (
			<GlobalHeader
				{...args}
				themeSwitch={
					<ThemeSwitch
						dark={resolvedTheme === "dark"}
						onDarkChange={(dark) => setTheme(dark ? "dark" : "light")}
					/>
				}
			/>
		);
	},
} satisfies Meta<typeof GlobalHeader>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { parameters: { figmaVariantId: "49:657" } };
export const Secondary: Story = {
	parameters: { figmaVariantId: "116:11268" },
	args: { type: "secondary" },
};
export const UnknownCredits: Story = {
	args: { remainingCredits: null, allocatedCredits: null },
};
export const ThemeSwitching: Story = {
	globals: { theme: "light" },
	parameters: { design: figma("371:5546") },
	play: async ({ canvasElement }) => {
		const root = canvasElement.ownerDocument.documentElement;
		const toggle = within(canvasElement).getByRole("switch", {
			name: "Dark theme",
		});
		await expect(toggle).toHaveAttribute("aria-checked", "false");
		toggle.focus();
		await userEvent.keyboard(" ");
		await waitFor(() => expect(root).toHaveClass("dark"));
		await expect(toggle).toHaveAttribute("aria-checked", "true");
		await expect(toggle).toHaveFocus();
		await userEvent.keyboard("{Enter}");
		await waitFor(() => expect(root).toHaveClass("light"));
		await expect(toggle).toHaveAttribute("aria-checked", "false");
	},
};
