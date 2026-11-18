import type { Meta, StoryObj } from "@storybook/react-vite";

const colors = [
	"background",
	"foreground",
	"card",
	"primary",
	"secondary",
	"muted",
	"accent",
	"destructive",
	"border",
	"ring",
];

function DesignTokens() {
	return (
		<main className="max-w-4xl space-y-10">
			<header>
				<h1 className="text-3xl font-semibold">Design tokens</h1>
				<p className="text-muted-foreground mt-2">
					Shared with the app. Switch the theme in the toolbar to inspect both
					palettes.
				</p>
			</header>
			<section aria-labelledby="colors">
				<h2 id="colors" className="mb-4 text-xl font-semibold">
					Semantic colors
				</h2>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-5">
					{colors.map((token) => (
						<div key={token}>
							<div
								className="mb-2 h-20 rounded-lg border"
								style={{ background: `var(--${token})` }}
							/>
							<code className="text-xs">--{token}</code>
						</div>
					))}
				</div>
			</section>
			<section aria-labelledby="typography">
				<h2 id="typography" className="mb-4 text-xl font-semibold">
					Typography
				</h2>
				<div className="space-y-3">
					{["sm", "base", "lg", "xl", "2xl", "3xl"].map((size) => (
						<p key={size} style={{ fontSize: `var(--text-${size})` }}>
							Aa · text-{size} · Agentplace
						</p>
					))}
				</div>
			</section>
			<section aria-labelledby="spacing">
				<h2 id="spacing" className="mb-4 text-xl font-semibold">
					Spacing
				</h2>
				<div className="space-y-3">
					{[1, 2, 3, 4, 6, 8, 12, 16].map((step) => (
						<div key={step} className="flex items-center gap-4">
							<code className="w-16 text-xs">space-{step}</code>
							<div
								className="bg-primary h-4"
								style={{ width: `calc(var(--spacing) * ${step})` }}
							/>
						</div>
					))}
				</div>
			</section>
			<section aria-labelledby="radius">
				<h2 id="radius" className="mb-4 text-xl font-semibold">
					Corner radius
				</h2>
				<div className="flex flex-wrap gap-4">
					{["sm", "md", "lg", "xl"].map((size) => (
						<div
							key={size}
							className="bg-secondary grid size-24 place-items-center border text-sm"
							style={{ borderRadius: `var(--radius-${size})` }}
						>
							{size}
						</div>
					))}
				</div>
			</section>
		</main>
	);
}

export default {
	title: "Foundations/Tokens",
	component: DesignTokens,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DesignTokens>;
export const Overview: StoryObj<typeof DesignTokens> = {};
