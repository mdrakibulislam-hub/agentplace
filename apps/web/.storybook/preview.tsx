import type { Preview } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import "@agentplace/ui/globals.css";
import { ThemeProvider, useTheme } from "../src/components/theme-provider";
import { DesignSystemDocs } from "./design-system-docs";

function FoundationEnvironment({
	theme,
	motion,
	children,
}: {
	theme: string;
	motion: string;
	children: ReactNode;
}) {
	const { resolvedTheme, setTheme } = useTheme();
	useLayoutEffect(() => {
		setTheme(theme);
	}, [theme, setTheme]);
	useLayoutEffect(() => {
		document.documentElement.dataset.apMotion = motion;
	}, [motion]);
	return (
		<div
			className="ap-story-environment"
			data-ap-theme={resolvedTheme ?? theme}
			data-ap-motion={motion}
		>
			{children}
		</div>
	);
}

const preview: Preview = {
	tags: ["autodocs"],
	globalTypes: {
		theme: {
			description: "AP color mode (including menus and dialogs)",
			toolbar: {
				icon: "circlehollow",
				items: ["light", "dark"],
				dynamicTitle: true,
			},
		},
		motion: {
			description: "Decorative and interaction motion preference",
			toolbar: {
				icon: "play",
				items: [
					{ value: "system", title: "Follow system" },
					{ value: "reduced", title: "Reduced motion" },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: { theme: "light", motion: "system" },
	decorators: [
		(Story, context) => (
			<ThemeProvider
				attribute="class"
				defaultTheme={context.globals.theme}
				enableSystem={false}
				disableTransitionOnChange
				storageKey="agentplace-storybook-theme"
			>
				<FoundationEnvironment
					theme={context.globals.theme}
					motion={context.globals.motion}
				>
					<Story />
				</FoundationEnvironment>
			</ThemeProvider>
		),
	],
	parameters: {
		layout: "padded",
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
		a11y: { test: "error" },
		options: {
			storySort: {
				order: [
					"Foundations",
					"Components",
					[
						"01 Brand",
						"02 Reicon icons",
						"Actions",
						"Forms",
						"05 Navigation",
						"06 Menus",
						"07 Project & builder",
						"Data",
						"09 Motion & mascot",
						"11 Ambient surfaces & elevation",
					],
					"Guides",
					["Start here", "Figma comparison", "Interaction recipes"],
					"Product",
				],
			},
		},
		docs: { toc: true, page: DesignSystemDocs },
	},
};

export default preview;
