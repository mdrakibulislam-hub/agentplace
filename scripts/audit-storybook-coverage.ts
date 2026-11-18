import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import ts from "typescript";
import {
	textStyles,
	tokenCollections,
} from "../packages/ui/src/foundations/catalog";

const root = resolve(import.meta.dir, "..");
interface Definition {
	id: string;
	name: string;
	type: string;
	variants?: { id: string; name: string }[];
}
interface StoryMapping {
	file: string;
	exportName: string;
	title: string;
	componentId?: string;
	variantId?: string;
	documentation: boolean;
	play: boolean;
}
const source = JSON.parse(
	await readFile(resolve(root, "docs/design-handoff/components.json"), "utf8"),
) as { components: Definition[] };
const tokens = JSON.parse(
	await readFile(resolve(root, "docs/design-handoff/tokens.json"), "utf8"),
) as {
	collections: { variables: { id: string }[] }[];
	textStyles: { id: string }[];
};
const definitions = new Map(
	source.components.map((component) => [component.id, component]),
);
const owners = new Map(
	source.components.flatMap((component) =>
		(component.variants ?? []).map((variant) => [variant.id, component.id]),
	),
);
const expectedVariants = new Set(owners.keys());

function unwrap(node: ts.Expression | undefined): ts.Expression | undefined {
	let current = node;
	while (
		current &&
		(ts.isSatisfiesExpression(current) ||
			ts.isAsExpression(current) ||
			ts.isParenthesizedExpression(current))
	)
		current = current.expression;
	return current;
}
function property(
	node: ts.Expression | undefined,
	key: string,
): ts.Expression | undefined {
	const object = unwrap(node);
	if (!object || !ts.isObjectLiteralExpression(object)) return undefined;
	for (const entry of object.properties) {
		if (
			ts.isPropertyAssignment(entry) &&
			entry.name &&
			(ts.isIdentifier(entry.name) || ts.isStringLiteral(entry.name)) &&
			entry.name.text === key
		)
			return unwrap(entry.initializer);
	}
	return undefined;
}
function string(node: ts.Expression | undefined): string | undefined {
	const expression = unwrap(node);
	return expression &&
		(ts.isStringLiteral(expression) ||
			ts.isNoSubstitutionTemplateLiteral(expression))
		? expression.text
		: undefined;
}
function designNode(parameters: ts.Expression | undefined): string | undefined {
	const direct = string(property(parameters, "figmaComponentId"));
	if (direct) return direct;
	const design = property(parameters, "design");
	if (
		design &&
		ts.isCallExpression(design) &&
		ts.isIdentifier(design.expression) &&
		design.expression.text === "figma"
	)
		return string(design.arguments[0]);
	const url = string(property(design, "url"));
	return url?.match(/node-id=([\d-]+)/)?.[1]?.replace("-", ":");
}
function hasDocumentation(parameters: ts.Expression | undefined): boolean {
	const description = property(property(parameters, "docs"), "description");
	return ["component", "story"].some(
		(key) => (string(property(description, key))?.length ?? 0) >= 40,
	);
}

const stories: StoryMapping[] = [];
const glob = new Bun.Glob("apps/web/src/stories/**/*.stories.tsx");
for await (const filename of glob.scan({ cwd: root })) {
	const filepath = resolve(root, filename);
	const ast = ts.createSourceFile(
		filename,
		await readFile(filepath, "utf8"),
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX,
	);
	const declared = new Map<string, ts.Expression>();
	for (const statement of ast.statements)
		if (ts.isVariableStatement(statement))
			for (const declaration of statement.declarationList.declarations)
				if (ts.isIdentifier(declaration.name) && declaration.initializer)
					declared.set(declaration.name.text, declaration.initializer);
	const assignment = ast.statements.find(ts.isExportAssignment);
	let meta = assignment ? unwrap(assignment.expression) : undefined;
	if (meta && ts.isIdentifier(meta)) meta = unwrap(declared.get(meta.text));
	const parameters = property(meta, "parameters");
	const componentId = designNode(parameters);
	const title = string(property(meta, "title")) ?? filename;
	for (const statement of ast.statements) {
		if (
			!ts.isVariableStatement(statement) ||
			!statement.modifiers?.some(
				(modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
			)
		)
			continue;
		for (const declaration of statement.declarationList.declarations) {
			if (!ts.isIdentifier(declaration.name) || !declaration.initializer)
				continue;
			const storyParameters = property(declaration.initializer, "parameters");
			const directId = designNode(storyParameters);
			stories.push({
				file: relative(root, filepath),
				exportName: declaration.name.text,
				title,
				componentId: directId ?? componentId,
				variantId: string(property(storyParameters, "figmaVariantId")),
				documentation:
					hasDocumentation(storyParameters) || hasDocumentation(parameters),
				play: Boolean(property(declaration.initializer, "play")),
			});
		}
	}
}
const mappings = source.components.map((definition) => {
	const matching = stories.filter(
		(story) => story.componentId === definition.id,
	);
	return {
		...definition,
		stories: matching,
		missingVariantIds: (definition.variants ?? [])
			.filter(
				(variant) => !matching.some((story) => story.variantId === variant.id),
			)
			.map((variant) => variant.id),
	};
});
const wrongVariantOwners = stories.filter(
	(story) =>
		story.variantId &&
		expectedVariants.has(story.variantId) &&
		owners.get(story.variantId) !== story.componentId,
);
const missingDefinitions = mappings
	.filter((mapping) => mapping.stories.length === 0)
	.map(({ id, name }) => ({ id, name }));
const missingVariants = mappings.flatMap((mapping) =>
	mapping.missingVariantIds.map((id) => ({
		id,
		componentId: mapping.id,
		name: mapping.variants?.find((variant) => variant.id === id)?.name,
	})),
);
const undocumentedDefinitions = mappings
	.filter(
		(mapping) =>
			mapping.stories.length > 0 &&
			!mapping.stories.some((story) => story.documentation),
	)
	.map(({ id, name }) => ({ id, name }));
const actualTokenIds = new Set(
	tokenCollections.flatMap((collection) =>
		collection.tokens.map((token) => token.id),
	),
);
const missingTokenIds = tokens.collections
	.flatMap((collection) => collection.variables.map((token) => token.id))
	.filter((id) => !actualTokenIds.has(id));
const actualTextStyleIds = new Set(textStyles.map((style) => style.id));
const missingTextStyleIds = tokens.textStyles
	.map((style) => style.id)
	.filter((id) => !actualTextStyleIds.has(id));
const assetManifest = JSON.parse(
	await readFile(resolve(root, "packages/ui/src/assets/manifest.json"), "utf8"),
) as { name: string; nodeId?: string; kind: string; sha256?: string }[];
const missingAssetFiles: string[] = [];
const assetHashMismatches: string[] = [];
for (const asset of assetManifest) {
	const file = Bun.file(resolve(root, "packages/ui/src/assets", asset.name));
	if (!(await file.exists()) || file.size === 0)
		missingAssetFiles.push(asset.name);
	else if (
		asset.sha256 &&
		createHash("sha256")
			.update(Buffer.from(await file.arrayBuffer()))
			.digest("hex") !== asset.sha256
	)
		assetHashMismatches.push(asset.name);
}
const provisionalAssets = assetManifest.filter((asset) =>
	asset.kind.includes("awaiting"),
);
const structuralCoverageComplete =
	missingDefinitions.length === 0 &&
	missingVariants.length === 0 &&
	wrongVariantOwners.length === 0 &&
	undocumentedDefinitions.length === 0 &&
	missingTokenIds.length === 0 &&
	missingTextStyleIds.length === 0 &&
	missingAssetFiles.length === 0 &&
	assetHashMismatches.length === 0;
const report = {
	scope:
		"AP Figma definitions and explicit story source metadata; this does not certify visual or interaction results",
	generatedAt: new Date().toISOString(),
	counts: {
		expectedDefinitions: definitions.size,
		linkedDefinitions: definitions.size - missingDefinitions.length,
		expectedVariants: expectedVariants.size,
		linkedVariants: expectedVariants.size - missingVariants.length,
		tokens: actualTokenIds.size,
		textStyles: actualTextStyleIds.size,
		sourceStories: stories.length,
		sourcePlayFunctions: stories.filter((story) => story.play).length,
		localAssets: assetManifest.length,
	},
	structuralCoverageComplete,
	strictFidelityCertified: false,
	strictFidelityNote:
		"Requires completed rendered comparisons, interaction execution, exact font geometry, and resolution of any provisional source assets; see storybook-coverage-audit.md.",
	missingDefinitions,
	missingVariants,
	wrongVariantOwners,
	undocumentedDefinitions,
	missingTokenIds,
	missingTextStyleIds,
	missingAssetFiles,
	assetHashMismatches,
	provisionalAssets,
	definitions: mappings,
};
if (Bun.argv.includes("--write")) {
	const output = resolve(root, "docs/storybook-coverage.json");
	await writeFile(output, `${JSON.stringify(report, null, "\t")}\n`);
	const formatter = Bun.spawn(
		["bun", "x", "biome", "format", "--write", output],
		{ cwd: root, stdout: "ignore", stderr: "inherit" },
	);
	if ((await formatter.exited) !== 0)
		throw new Error("Could not format the generated coverage report.");
}
console.info(JSON.stringify({ ...report, definitions: undefined }, null, 2));
if (!structuralCoverageComplete) process.exitCode = 1;
