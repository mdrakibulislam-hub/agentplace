import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
	stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
	framework: "@storybook/react-vite",
	// Storybook uses the UI library without the app's router or environment plugin.
	core: {
		builder: {
			name: "@storybook/builder-vite",
			options: { viteConfigPath: false },
		},
		disableTelemetry: true,
	},
	viteFinal: async (viteConfig) =>
		mergeConfig(viteConfig, {
			plugins: [tailwindcss()],
			resolve: { tsconfigPaths: true },
		}),
};

export default config;
