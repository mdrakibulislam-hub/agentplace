import {
	Controls,
	Description,
	Primary,
	Stories,
	Subtitle,
	Title,
	useOf,
} from "@storybook/addon-docs/blocks";

/** Keep the source and behavior guide beside every reusable component's live examples. */
export function DesignSystemDocs() {
	const resolved = useOf("meta", ["meta"]);
	const parameters =
		resolved.type === "meta" ? resolved.preparedMeta.parameters : {};
	const design = parameters.design as { url?: string } | undefined;
	return (
		<>
			<Title />
			<Subtitle />
			{design?.url && (
				<p>
					<a href={design.url} target="_blank" rel="noreferrer">
						Open the original component in Figma ↗
					</a>
				</p>
			)}
			<Description />
			<Primary />
			<Controls />
			<h2>Interaction and state specimens</h2>
			<p>
				Use the theme and motion toolbar controls to inspect both color modes
				and reduced motion. The story descriptions explain keyboard behavior,
				asynchronous states, and permission boundaries. Fixture actions are
				isolated from live product services.
			</p>
			<Stories />
		</>
	);
}
