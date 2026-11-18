import { createHash } from "node:crypto";
import {
	copyFile,
	mkdir,
	mkdtemp,
	readFile,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const canonicalDirectory = resolve(root, "packages/ui/src/assets/fonts");
const publicDirectory = resolve(root, "apps/web/public/fonts");
const canonicalFont = join(canonicalDirectory, "SF-Pro.ttf");
const officialSource =
	"https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg";

async function command(args: string[]) {
	const process = Bun.spawn(args, { stdout: "ignore", stderr: "inherit" });
	const status = await process.exited;
	if (status !== 0) throw new Error(`${args[0]} exited with ${status}`);
}

/** Read public OpenType names/axis metadata; no glyphs or outlines are modified. */
async function inspectFont(path: string) {
	const bytes = await readFile(path);
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const tables = new Map<string, number>();
	for (let index = 0; index < view.getUint16(4); index++) {
		const record = 12 + index * 16;
		const tag = bytes.toString("ascii", record, record + 4);
		tables.set(tag, view.getUint32(record + 8));
	}
	const nameTable = tables.get("name");
	const variationTable = tables.get("fvar");
	if (nameTable === undefined || variationTable === undefined)
		throw new Error(
			"Expected the official variable SF-Pro.ttf, with name and fvar tables.",
		);
	const names: string[] = [];
	const strings = nameTable + view.getUint16(nameTable + 4);
	for (let index = 0; index < view.getUint16(nameTable + 2); index++) {
		const record = nameTable + 6 + index * 12;
		const platform = view.getUint16(record);
		const nameId = view.getUint16(record + 6);
		if (nameId !== 1 && nameId !== 16) continue;
		const length = view.getUint16(record + 8);
		const offset = strings + view.getUint16(record + 10);
		const raw = bytes.subarray(offset, offset + length);
		names.push(
			platform === 0 || platform === 3
				? new TextDecoder("utf-16be").decode(raw)
				: raw.toString("utf8"),
		);
	}
	if (!names.includes("SF Pro"))
		throw new Error(
			`Expected family SF Pro; found ${[...new Set(names)].join(", ")}`,
		);
	const axes: Record<
		string,
		{ minimum: number; default: number; maximum: number }
	> = {};
	const axisArray = variationTable + view.getUint16(variationTable + 4);
	const axisSize = view.getUint16(variationTable + 10);
	for (let index = 0; index < view.getUint16(variationTable + 8); index++) {
		const record = axisArray + index * axisSize;
		axes[bytes.toString("ascii", record, record + 4)] = {
			minimum: view.getInt32(record + 4) / 65536,
			default: view.getInt32(record + 8) / 65536,
			maximum: view.getInt32(record + 12) / 65536,
		};
	}
	if (
		!axes.wght ||
		axes.wght.minimum > 400 ||
		axes.wght.maximum < 700 ||
		axes.wdth?.default !== 100
	)
		throw new Error(
			"SF Pro must support the authored 400/510/590/700 weights and width axis 100.",
		);
	return {
		family: "SF Pro",
		axes,
		bytes: bytes.byteLength,
		sha256: createHash("sha256").update(bytes).digest("hex"),
	};
}

console.info(
	"Preparing SF Pro for local design review. Apple's license restricts mockup use, embedding, and redistribution; see docs/storybook-fonts.md and the extracted license. No fonts are installed system-wide.",
);
await mkdir(canonicalDirectory, { recursive: true });
await mkdir(publicDirectory, { recursive: true });

if (
	!(await Bun.file(canonicalFont).exists()) ||
	Bun.argv.includes("--refresh")
) {
	if (process.platform !== "darwin")
		throw new Error(
			"Automatic readonly DMG extraction requires macOS. Supply a licensed SF-Pro.ttf in packages/ui/src/assets/fonts on other platforms and rerun this command.",
		);
	const temporaryDirectory = await mkdtemp(join(tmpdir(), "agentplace-sfpro-"));
	const mount = join(temporaryDirectory, "mounted");
	let mounted = false;
	try {
		const image = join(temporaryDirectory, "SF-Pro.dmg");
		console.info(`Downloading Apple's official package: ${officialSource}`);
		const response = await fetch(officialSource);
		if (!response.ok)
			throw new Error(`Apple font download failed: ${response.status}`);
		await Bun.write(image, response);
		await mkdir(mount);
		await command([
			"hdiutil",
			"attach",
			"-readonly",
			"-nobrowse",
			"-noautoopen",
			"-mountpoint",
			mount,
			image,
		]);
		mounted = true;
		const extracted = join(temporaryDirectory, "extracted");
		await command([
			"pkgutil",
			"--expand-full",
			join(mount, "SFProFonts.pkg"),
			extracted,
		]);
		const font = join(
			extracted,
			"SFProFontsPackage.pkg/Payload/Library/Fonts/SF-Pro.ttf",
		);
		const metadata = await inspectFont(font);
		await copyFile(font, canonicalFont);
		await copyFile(
			join(extracted, "Resources/English.lproj/License.rtf"),
			join(canonicalDirectory, "APPLE-SF-PRO-LICENSE.rtf"),
		);
		await writeFile(
			join(canonicalDirectory, "provenance.json"),
			`${JSON.stringify({ source: officialSource, retrievedAt: new Date().toISOString(), ...metadata }, null, 2)}\n`,
		);
	} finally {
		if (mounted) await command(["hdiutil", "detach", mount]);
		await rm(temporaryDirectory, { recursive: true, force: true });
	}
}
const metadata = await inspectFont(canonicalFont);
await copyFile(canonicalFont, join(publicDirectory, "SF-Pro.ttf"));
console.info(JSON.stringify(metadata, null, 2));
console.info(
	"Local font prepared at /fonts/SF-Pro.ttf for web/Storybook. Both font directories are ignored by Git. Static Storybook copies public assets: do not publish these font binaries.",
);
