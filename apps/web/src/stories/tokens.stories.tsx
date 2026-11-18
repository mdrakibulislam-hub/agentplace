import type { FoundationToken } from "@agentplace/ui/foundations";
import {
	elevationStyles,
	motionPresets,
	textStyles,
	tokenCollections,
} from "@agentplace/ui/foundations";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId, useState } from "react";
import { FoundationOverview } from "./foundation-overview";
import "./foundation-catalog.css";

const sourceUrl =
	"https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=29-397";
const metricTokens =
	tokenCollections.find((collection) => collection.name === "AP / Metrics")
		?.tokens ?? [];
const variableCount = tokenCollections.reduce(
	(count, collection) => count + collection.tokens.length,
	0,
);

function Heading({ title, children }: { title: string; children: ReactNode }) {
	return (
		<header>
			<div className="ap-foundation-meta">AGENTPLACE / DESIGN SYSTEM</div>
			<h1>{title}</h1>
			<div className="ap-foundation-intro">{children}</div>
		</header>
	);
}

function TokenPalette({
	token,
	theme,
}: {
	token: FoundationToken;
	theme: "light" | "dark";
}) {
	return (
		<div className={`ap-token-palette ${theme}`} data-ap-theme={theme}>
			<span
				className="ap-token-swatch"
				style={{ background: `var(${token.cssVariable})` }}
			/>
			<code>{token.values[theme]}</code>
		</div>
	);
}

function FoundationCatalog({
	collectionName = "AP / Semantic colors",
}: {
	collectionName?: string;
}) {
	const [query, setQuery] = useState("");
	const inputId = useId();
	const collection = tokenCollections.find(
		(item) => item.name === collectionName,
	);
	const tokens = collection?.tokens ?? [];
	const matching = tokens.filter((token) =>
		`${token.name} ${token.cssVariable} ${token.values.light} ${token.values.dark}`
			.toLowerCase()
			.includes(query.trim().toLowerCase()),
	);
	return (
		<main className="ap-foundation-page">
			<Heading title={collectionName.replace("AP / ", "")}>
				Every value is connected to the same CSS variables used by the
				application. Semantic roles are the component API; primitives preserve
				the original palette. Light and dark values remain distinct.
			</Heading>
			<div className="ap-foundation-toolbar">
				<label htmlFor={inputId}>Find a token</label>
				<input
					className="ap-foundation-search"
					id={inputId}
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Name, CSS variable, or value"
					type="search"
				/>
				<span role="status" className="ap-foundation-count">
					{matching.length} of {tokens.length} tokens
				</span>
			</div>
			<table className="ap-foundation-table">
				<caption>{collectionName}</caption>
				<thead>
					<tr>
						<th scope="col">Role / CSS variable</th>
						<th scope="col">Light</th>
						<th scope="col">Dark</th>
					</tr>
				</thead>
				<tbody>
					{matching.map((token) => (
						<tr
							key={token.id}
							data-token-id={token.id}
							data-css-variable={token.cssVariable}
						>
							<th scope="row">
								{token.name}
								<span className="ap-token-note">
									<code>{token.cssVariable}</code>
								</span>
								{token.aliases.light && (
									<span className="ap-token-note">
										Light alias: <code>{token.aliases.light}</code>
									</span>
								)}
								{token.aliases.dark &&
									token.aliases.dark !== token.aliases.light && (
										<span className="ap-token-note">
											Dark alias: <code>{token.aliases.dark}</code>
										</span>
									)}
							</th>
							{(["light", "dark"] as const).map((theme) => (
								<td key={theme}>
									{token.type === "COLOR" ? (
										<TokenPalette token={token} theme={theme} />
									) : (
										<code>{token.values[theme]}</code>
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			{matching.length === 0 && (
				<p className="ap-foundation-callout">
					No matching tokens. Clear the search to restore the full collection.
				</p>
			)}
			<aside className="ap-foundation-callout">
				<strong>Interaction guide</strong>
				<p>
					Type a name or value to filter. Clear the search to restore every
					token. The theme toolbar changes the surrounding UI; the Light and
					Dark columns always show both modes. Source colors use an explicit
					namespace to preserve their values independently of the semantic roles
					that reuse their Figma WEB names.
				</p>
			</aside>
		</main>
	);
}

const meta = {
	title: "Foundations/Tokens",
	component: FoundationCatalog,
	parameters: {
		layout: "fullscreen",
		design: { type: "figma", url: sourceUrl },
		docs: {
			description: {
				component: `The complete AP foundation library: **${variableCount} variables, 25 named SF Pro text styles, and three layered elevation styles**. Values and aliases were checked against the live Figma file. Use semantic roles in components; source values and primitives remain available for inspection. The Overview preserves the canonical 1600 × 2500 specimen board. Typography is SF Pro at 400/510/590/700; the locally provisioned original Apple font is served for design review; see docs/storybook-fonts.md for setup and distribution boundaries.`,
			},
		},
	},
	argTypes: {
		collectionName: {
			control: "select",
			options: tokenCollections.map((collection) => collection.name),
		},
	},
	args: { collectionName: "AP / Semantic colors" },
} satisfies Meta<typeof FoundationCatalog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
	render: () => <FoundationOverview />,
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Canonical Figma foundations specimen board 30:2, at its authored 1600 × 2500 size. Explicit light/dark mode previews and the full shared shadow stacks are preserved. This documentation canvas has fixed geometry; product components remain reusable and responsive.",
			},
		},
	},
};
export const SemanticColors: Story = {};
export const SourceColors: Story = {
	args: { collectionName: "AP / Source colors" },
};
export const Primitives: Story = {
	args: { collectionName: "AP / Primitives" },
};
export const Metrics: Story = { args: { collectionName: "AP / Metrics" } };

export const Typography: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"All 25 named styles retain the exact Figma size, line height, zero letter spacing, SF Pro width axis 100, and weights Regular 400 / Medium 510 / Semibold 590 / Bold 700. Select light/dark in the toolbar to inspect contrast. Named CSS classes are exported from the shared UI stylesheet.",
			},
		},
	},
	render: () => (
		<main className="ap-foundation-page">
			<Heading title="Typography">
				SF Pro across product headings, welcome display, body text and controls.
				Each row below renders the actual shared text-style class.
			</Heading>
			<table className="ap-foundation-table">
				<caption>25 named text styles</caption>
				<thead>
					<tr>
						<th scope="col">Text style</th>
						<th scope="col">Specimen</th>
						<th scope="col">Size / line / weight</th>
					</tr>
				</thead>
				<tbody>
					{textStyles.map((style) => (
						<tr key={style.id} data-text-style={style.id}>
							<th scope="row">
								{style.name.replace("AP / ", "")}
								<span className="ap-token-note">
									<code>.{style.className}</code>
								</span>
							</th>
							<td>
								<p className={style.className}>Build an agent for your team</p>
							</td>
							<td>
								{style.size} / {style.lineHeight} / {style.weight}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<aside className="ap-foundation-callout">
				SF Pro is selected explicitly. Run the documented local font setup to
				load the original variable face. The macOS system fallback is also San
				Francisco but has different metrics. The original binary remains local
				and is not committed or approved for public web embedding.
			</aside>
		</main>
	),
};

export const Spacing: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<main className="ap-foundation-page">
			<Heading title="Spacing">
				Exact pixel metrics from AP / Metrics. A token named space/8 means 8px;
				it is not Tailwind's numeric multiplier.
			</Heading>
			<section aria-label="Spacing scale">
				{metricTokens
					.filter((token) => token.name.startsWith("space/"))
					.map((token) => (
						<div className="ap-space-row" key={token.id}>
							<code>
								{token.name} · {token.values.light}
							</code>
							<div
								className="ap-space-mark"
								style={{ width: `var(${token.cssVariable})` }}
							/>
						</div>
					))}
			</section>
			<aside className="ap-foundation-callout">
				Use the shared pixel role directly: <code>gap: var(--space-8)</code>.
				Related actions use 12px internal gaps inside a 24px parent rhythm.
			</aside>
		</main>
	),
};

export const Radius: Story = {
	parameters: { controls: { disable: true } },
	render: () => (
		<main className="ap-foundation-page">
			<Heading title="Shape and radius">
				Keep each role's original curvature. The input radius and the fully
				rounded role are independent of the general scale.
			</Heading>
			<div className="ap-foundation-grid">
				{metricTokens
					.filter((token) => token.name.startsWith("radius/"))
					.map((token) => (
						<div key={token.id}>
							<div
								className="ap-radius-specimen"
								style={{ borderRadius: `var(${token.cssVariable})` }}
							>
								{token.name}
							</div>
							<code className="ap-foundation-specimen-label">
								{token.cssVariable} · {token.values.light}
							</code>
						</div>
					))}
			</div>
		</main>
	),
};

export const Elevation: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"Use one shared elevation level per standalone surface. Borders and focus rings remain separate; nested content and inputs stay flat. The shadow stacks preserve every Figma spread, blur, offset and alpha instead of approximating them with a CSS drop-shadow filter.",
			},
		},
	},
	render: () => (
		<main className="ap-foundation-page">
			<Heading title="Gentle elevation">
				Neutral #18181B layers with negative spread. Resting anchors standalone
				cards; Panel floats menus; Overlay lifts dialogs.
			</Heading>
			<div className="ap-foundation-grid">
				{elevationStyles.map((style) => {
					const name = style.name.split(" / ").at(-1) ?? "";
					return (
						<section key={style.id}>
							<div
								className="ap-elevation-specimen"
								style={{ boxShadow: `var(--shadow-${name.toLowerCase()})` }}
							>
								<strong>{name}</strong>
								<p>{style.description}</p>
							</div>
							<ol className="ap-elevation-layers">
								{style.effects.map((effect, index) => (
									<li key={`${style.id}-${index}`}>
										Y {effect.offset.y}px · blur {effect.radius}px · spread{" "}
										{effect.spread}px · alpha{" "}
										{Number((effect.color.a * 100).toFixed(2))}%
									</li>
								))}
							</ol>
						</section>
					);
				})}
			</div>
			<aside className="ap-foundation-callout">
				Keep border/default independent. Do not stack Resting + Panel + Overlay
				on one surface, animate large blur kernels, or reintroduce a hard
				outline shadow.
			</aside>
		</main>
	),
};

export const MotionContract: Story = {
	parameters: {
		controls: { disable: true },
		docs: {
			description: {
				story:
					"These are physical spring parameters, not CSS duration curves. Press geometry scales to 0.97 while the hit box stays stable. Popovers start at scale 0.97/y6px; dialogs at 0.98/y12px. Opacity remains monotonic. The global Reduced motion control disables decorative and spatial movement, including portal content.",
			},
		},
	},
	render: () => (
		<main className="ap-foundation-page">
			<Heading title="Motion contract">
				Restrained physical springs for small transforms; short monotonic fades
				for color and opacity. Ambient motion is a separate exact 32-second
				cycle.
			</Heading>
			<table className="ap-foundation-table">
				<caption>Physical spring presets</caption>
				<thead>
					<tr>
						<th scope="col">Preset</th>
						<th scope="col">Mass</th>
						<th scope="col">Stiffness</th>
						<th scope="col">Damping</th>
					</tr>
				</thead>
				<tbody>
					{Object.entries(motionPresets).map(([name, preset]) => (
						<tr key={name}>
							<th scope="row">{name}</th>
							<td>{preset.mass}</td>
							<td>{preset.stiffness}</td>
							<td>{preset.damping}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="ap-foundation-callout">
				<strong>Interaction and accessibility guide</strong>
				<p className="ap-foundation-rule">
					Press: scale 0.97, release using the press spring; keep the hit target
					stable.
				</p>
				<p className="ap-foundation-rule">
					Popover: 0.97 → 1, y6px → 0, about 340ms; opacity 140ms. Dialog: 0.98
					→ 1, y12px → 0, about 380ms; opacity 160ms.
				</p>
				<p className="ap-foundation-rule">
					Exit: 120–160ms with at most 4px travel and no overshoot. Retarget
					interrupted geometry from its current position and velocity.
				</p>
				<p className="ap-foundation-rule">
					Reduced motion: still mascot, no springs, scale, travel or layout
					animation; optional fade ≤100ms. Status, focus and task completion
					never depend on animation.
				</p>
				<p className="ap-foundation-rule">
					Ambient: one bottom-anchored wash, constant opacity, exact 32-second
					seamless ease-in-out loop. Pause while hidden/offscreen and preserve
					phase.
				</p>
			</div>
		</main>
	),
};
