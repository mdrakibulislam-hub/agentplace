import { ProjectCover } from "@agentplace/ui/components/ap-builder";
import {
	projectCoverBackgroundIds,
	projectCoverBackgrounds,
} from "@agentplace/ui/lib/project-cover-backgrounds";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState } from "react";
import {
	expect,
	fireEvent,
	fn,
	userEvent,
	waitFor,
	within,
} from "storybook/test";
import { figma } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/Project cover",
	component: ProjectCover,
	parameters: {
		design: figma("130:1323"),
		figmaNodeId: "130:1323",
		docs: {
			description: {
				component:
					"Home cards show the project's assigned background with the original mascot. Unassigned projects use the mascot gradient. Branding without an upload shows Empty. An uploaded image takes precedence in both contexts. Editable hover and keyboard focus show Empty temporarily, then restore the current cover. Click or keyboard activation opens the picker. Touch has an explicit action. Read-only contexts have no edit controls.",
			},
		},
	},
	args: { context: "branding-upload", onEdit: fn() },
} satisfies Meta<typeof ProjectCover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = { parameters: { figmaVariantId: "129:1357" } };
export const Added: Story = {
	parameters: { figmaVariantId: "129:1362" },
	args: { presentation: "added" },
};
export const DefaultMascot: Story = {
	parameters: { figmaVariantId: "189:13673" },
	args: { context: "home-card" },
};
export const BlueAndPink: Story = {
	parameters: { figmaVariantId: "421:2363" },
	args: { context: "home-card", background: "blue-pink" },
};
export const Lavender: Story = {
	parameters: { figmaVariantId: "421:2365" },
	args: { context: "home-card", background: "lavender" },
};
export const Pastel: Story = {
	parameters: { figmaVariantId: "421:2367" },
	args: { context: "home-card", background: "pastel" },
};
export const PeachAndBlue: Story = {
	parameters: { figmaVariantId: "421:2369" },
	args: { context: "home-card", background: "peach-blue" },
};
export const Prism: Story = {
	parameters: { figmaVariantId: "421:2371" },
	args: { context: "home-card", background: "prism" },
};
export const Lime: Story = {
	parameters: { figmaVariantId: "421:2373" },
	args: { context: "home-card", background: "lime" },
};
export const BlueHaze: Story = {
	parameters: { figmaVariantId: "421:2375" },
	args: { context: "home-card", background: "blue-haze" },
};
export const Violet: Story = {
	parameters: { figmaVariantId: "421:2377" },
	args: { context: "home-card", background: "violet" },
};
export const MintAndPeach: Story = {
	parameters: { figmaVariantId: "421:2379" },
	args: { context: "home-card", background: "mint-peach" },
};
export const BackgroundGallery: Story = {
	parameters: { design: figma("421:2362") },
	render: () => (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 24, maxWidth: 1056 }}>
			{projectCoverBackgroundIds.map((background) => (
				<figure key={background} style={{ margin: 0 }}>
					<ProjectCover background={background} />
					<figcaption style={{ marginTop: 8 }}>
						{projectCoverBackgrounds[background].label}
					</figcaption>
				</figure>
			))}
		</div>
	),
};
export const EditableHome: Story = {
	args: { context: "home-card", canEdit: true },
};
export const EditableBranding: Story = {
	args: { context: "branding-upload", canEdit: true },
};
export const ReadOnly: Story = {
	args: { context: "home-card", canEdit: false },
};

export const HoverFocusAndRestore: Story = {
	args: { context: "home-card", canEdit: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cover = canvas.getByRole("button", { name: "Add project cover" });
		await expect(cover).toHaveAttribute("data-presentation", "default-mascot");
		await userEvent.hover(cover);
		await waitFor(() =>
			expect(cover).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.unhover(cover);
		await expect(cover).toHaveAttribute("data-presentation", "default-mascot");
		await userEvent.tab();
		await expect(cover).toHaveFocus();
		// Normalize focusin for the background-iframe Storybook test driver.
		fireEvent.focusIn(cover);
		await waitFor(() =>
			expect(cover).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.keyboard("{Enter}");
		await expect(args.onEdit).toHaveBeenCalledOnce();
	},
};

function CoverLifecycleFixture() {
	const [image, setImage] = useState<string | null>(null);
	const [notice, setNotice] = useState("");
	const imageRef = useRef<string | null>(null);
	useEffect(
		() => () => {
			if (imageRef.current) URL.revokeObjectURL(imageRef.current);
		},
		[],
	);
	function stage(file: File) {
		if (imageRef.current) URL.revokeObjectURL(imageRef.current);
		const next = URL.createObjectURL(file);
		imageRef.current = next;
		setImage(next);
		setNotice(
			"File staged locally for this Storybook fixture; not uploaded or published.",
		);
	}
	return (
		<div style={{ display: "grid", gap: 16 }}>
			<div data-testid="home-cover">
				<ProjectCover
					context="home-card"
					background="lavender"
					image={image}
					canEdit
					onEdit={() =>
						setNotice("Choose a replacement using the fixture file input.")
					}
				/>
			</div>
			<div data-testid="branding-cover">
				<ProjectCover
					context="branding-upload"
					image={image}
					canEdit
					onEdit={() =>
						setNotice("Choose a replacement using the fixture file input.")
					}
				/>
			</div>
			<label>
				Fixture cover image
				<input
					aria-label="Fixture cover image"
					type="file"
					accept="image/png,image/jpeg,image/webp"
					onChange={(event) => {
						const file = event.currentTarget.files?.[0];
						if (file) stage(file);
					}}
				/>
			</label>
			<div style={{ display: "flex", gap: 8 }}>
				<button
					type="button"
					onClick={() =>
						setNotice("Replacement cancelled. Current image retained.")
					}
				>
					Cancel replacement
				</button>
				<button
					type="button"
					onClick={() =>
						setNotice("Replacement failed. Current image retained.")
					}
				>
					Fail replacement
				</button>
				<button
					type="button"
					onClick={() => {
						setImage(null);
						setNotice("Cover removed from the local draft fixture.");
					}}
				>
					Remove staged cover
				</button>
			</div>
			<p role="status">{notice}</p>
			<div data-testid="readonly-cover">
				<ProjectCover context="home-card" image={image} canEdit={false} />
			</div>
		</div>
	);
}
export const ContextAndAssetLifecycle: Story = {
	render: () => <CoverLifecycleFixture />,
	parameters: {
		docs: {
			description: {
				story:
					"Both home and branding use one locally staged file. Cancel and failure keep the current image. Removal restores the assigned background on the home card and the empty upload control in Branding. The read-only copy has no edit control.",
			},
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const home = within(canvas.getByTestId("home-cover")).getByRole("button");
		const branding = within(canvas.getByTestId("branding-cover")).getByRole(
			"button",
		);
		const assignedBackground = home.querySelector<HTMLImageElement>(
			".ap-cover-mascot img",
		)?.src;
		await expect(assignedBackground).toBeDefined();
		await expect(home).toHaveAttribute("data-presentation", "default-mascot");
		await expect(branding).toHaveAttribute("data-presentation", "empty");
		await userEvent.hover(home);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.unhover(home);
		await expect(home).toHaveAttribute("data-presentation", "default-mascot");
		await expect(
			home.querySelector<HTMLImageElement>(".ap-cover-mascot img")?.src,
		).toBe(assignedBackground);
		await userEvent.hover(branding);
		await expect(branding).toHaveAttribute("data-presentation", "empty");
		await userEvent.unhover(branding);
		await userEvent.tab();
		await expect(home).toHaveFocus();
		fireEvent.focusIn(home);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.tab();
		fireEvent.focusOut(home);
		fireEvent.focusIn(branding);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "default-mascot"),
		);
		await userEvent.tab();
		fireEvent.focusOut(branding);
		const bytes = Uint8Array.from(
			atob(
				"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
			),
			(character) => character.charCodeAt(0),
		);
		const upload = canvas.getByLabelText("Fixture cover image");
		await userEvent.upload(
			upload,
			new File([bytes], "cover.png", { type: "image/png" }),
		);
		await expect(home).toHaveAttribute("data-presentation", "added");
		await expect(branding).toHaveAttribute("data-presentation", "added");
		const original = home.querySelector("img")?.src;
		await userEvent.hover(home);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.unhover(home);
		await expect(home).toHaveAttribute("data-presentation", "added");
		await userEvent.hover(branding);
		await expect(branding).toHaveAttribute("data-presentation", "empty");
		await userEvent.unhover(branding);
		await expect(branding).toHaveAttribute("data-presentation", "added");
		await userEvent.click(home);
		fireEvent.focusIn(home);
		await userEvent.unhover(home);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "empty"),
		);
		await userEvent.tab();
		fireEvent.focusOut(home);
		fireEvent.focusIn(branding);
		await waitFor(() =>
			expect(home).toHaveAttribute("data-presentation", "added"),
		);
		await expect(branding).toHaveFocus();
		await userEvent.tab();
		fireEvent.focusOut(branding);
		await waitFor(() =>
			expect(branding).toHaveAttribute("data-presentation", "added"),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Cancel replacement" }),
		);
		await expect(home.querySelector("img")?.src).toBe(original);
		await userEvent.click(
			canvas.getByRole("button", { name: "Fail replacement" }),
		);
		await expect(home.querySelector("img")?.src).toBe(original);
		await userEvent.upload(
			upload,
			new File([bytes], "replacement.png", { type: "image/png" }),
		);
		await expect(home.querySelector("img")?.src).not.toBe(original);
		await expect(branding.querySelector("img")?.src).toBe(
			home.querySelector("img")?.src,
		);
		await userEvent.hover(home);
		await expect(home).toHaveAttribute("data-presentation", "empty");
		await userEvent.unhover(home);
		await expect(home).toHaveAttribute("data-presentation", "added");
		await expect(
			within(canvas.getByTestId("readonly-cover")).queryByRole("button"),
		).not.toBeInTheDocument();
		await userEvent.click(
			canvas.getByRole("button", { name: "Remove staged cover" }),
		);
		await expect(home).toHaveAttribute("data-presentation", "default-mascot");
		await expect(
			home.querySelector<HTMLImageElement>(".ap-cover-mascot img")?.src,
		).toBe(assignedBackground);
		await expect(branding).toHaveAttribute("data-presentation", "empty");
	},
};
