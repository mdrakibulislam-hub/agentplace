import type { Preview } from "@storybook/react-vite";
import "@agentplace/ui/globals.css";

const preview: Preview = {
	tags: ["autodocs"],
	globalTypes: {
		theme: {
			description: "UI color theme",
			toolbar: {
				icon: "circlehollow",
				items: ["light", "dark"],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: "light" },
	decorators: [
		(Story, context) => (
			<div className={context.globals.theme === "dark" ? "dark" : ""}>
				<div className="bg-background text-foreground p-6">
					<Story />
				</div>
			</div>
		),
	],
	parameters: {
		layout: "padded",
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		a11y: { test: "error" },
		options: { storySort: { order: ["Foundations", "Components"] } },
	},
};

export default preview;
