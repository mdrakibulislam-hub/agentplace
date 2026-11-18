import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import { brandingFixture, coverFixture } from "./branding-story-fixtures";
import { BuilderBranding, type BuilderBrandingProps } from "./builder-branding";
import "./builder.css";

function BrandingScene({
	branding: initial,
	saved: initialSaved,
	onSave,
	onChange,
	...props
}: BuilderBrandingProps) {
	const [branding, setBranding] = useState(initial);
	const [saved, setSaved] = useState(initialSaved);

	return (
		<BuilderBranding
			{...props}
			branding={branding}
			saved={saved}
			onChange={(updates) => {
				onChange(updates);
				setBranding((current) => ({ ...current, ...updates }));
				setSaved(false);
			}}
			onSave={async () => {
				await onSave();
				setSaved(true);
			}}
		/>
	);
}

const meta = {
	title: "Product/Branding editor",
	component: BrandingScene,
	parameters: { layout: "fullscreen" },
	decorators: [
		(Story) => (
			<div
				style={{
					display: "grid",
					width: "min(536px, 100%)",
					minHeight: 832,
					background: "var(--background-default)",
				}}
			>
				<Story />
			</div>
		),
	],
	args: {
		branding: brandingFixture,
		saved: true,
		onChange: fn(),
		onSave: fn(),
		onBack: fn(),
	},
} satisfies Meta<typeof BrandingScene>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NoCover: Story = {
	parameters: { design: figma("135:6409") },
};

export const AddedCover: Story = {
	args: { branding: { ...brandingFixture, cover: coverFixture } },
	parameters: { design: figma("54:1876") },
};

export const CoverOptionsOpen: Story = {
	args: { ...AddedCover.args, initialCoverMenu: true },
	parameters: { design: figma("140:4811") },
};

export const KeyboardFocus: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.tab();
		await userEvent.tab();
		await expect(
			canvas.getByRole("textbox", { name: "Company name" }),
		).toHaveFocus();
		await userEvent.tab();
		await expect(
			canvas.getByRole("button", { name: "Upload logo" }),
		).toHaveFocus();
		await userEvent.tab();
		await expect(
			canvas.getByRole("textbox", { name: "Agent name" }),
		).toHaveFocus();
	},
};

export const ReadOnly: Story = {
	args: { ...AddedCover.args, canEdit: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByRole("textbox", { name: "Company name" }),
		).toBeDisabled();
		await expect(
			canvas.getByRole("button", { name: "Change cover" }),
		).toBeDisabled();
		await expect(
			canvas.getByRole("button", { name: "Save changes" }),
		).toBeDisabled();
		await expect(
			canvas.queryByRole("button", { name: "Change project cover" }),
		).not.toBeInTheDocument();
	},
};

export const SavingDraft: Story = {
	args: { saved: false, onSave: fn(() => new Promise<void>(() => {})) },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
		await expect(
			await canvas.findByRole("button", { name: "Saving…" }),
		).toBeDisabled();
		await expect(canvas.getByRole("status")).toHaveTextContent("Saving draft");
		await expect(args.onSave).toHaveBeenCalledOnce();
	},
};

export const SaveError: Story = {
	args: {
		branding: { ...brandingFixture, company: "WhiteFrame Studio" },
		saved: false,
	},
	render: function Render(args) {
		const attempts = useRef(0);
		return (
			<BrandingScene
				{...args}
				onSave={async () => {
					if (attempts.current++ === 0) {
						throw new Error("Couldn’t save the draft. Try again.");
					}
				}}
			/>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
		await expect(await canvas.findByRole("alert")).toHaveTextContent(
			"Couldn’t save the draft",
		);
		await expect(
			canvas.getByRole("textbox", { name: "Company name" }),
		).toHaveValue("WhiteFrame Studio");
		await expect(canvas.getByRole("status")).toHaveTextContent(
			"Unsaved changes",
		);
	},
};

export const CoverUploadError: Story = {
	args: AddedCover.args,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const cover = canvas.getByRole("button", { name: "Change project cover" });
		await userEvent.upload(
			canvas.getByLabelText("Choose a branding image"),
			new File(["not a valid image"], "cover.png", { type: "image/png" }),
		);
		await expect(await canvas.findByRole("alert")).toHaveTextContent(
			"This image couldn’t be opened",
		);
		await expect(cover.querySelector("img")).toHaveAttribute(
			"src",
			coverFixture,
		);
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
