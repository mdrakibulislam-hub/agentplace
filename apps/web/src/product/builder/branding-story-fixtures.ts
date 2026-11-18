import type { BrandingDraft } from "./builder-model";

export const brandingFixture: BrandingDraft = {
	company: "Whiteframe Creative",
	name: "WhiteFrame Advisor",
	color: "#2A2A2A",
	typography: "SF Pro",
	appearance: "light",
};

// The authored cover is a neutral slot. A transparent fixture lets the
// shared cover component show that slot without pretending an app has an asset.
export const coverFixture = `data:image/svg+xml,${encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 620"></svg>',
)}`;
