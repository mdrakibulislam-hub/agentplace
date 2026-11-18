import {
	SourceAttachmentDialog,
	type SourceAttachmentDialogProps,
} from "@agentplace/ui/components/ap-source-dialog";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "./fixtures";

function SourceDialogScene(args: SourceAttachmentDialogProps) {
	const [open, setOpen] = useState(args.open);
	const trigger = useRef<HTMLButtonElement>(null);
	return (
		<>
			<Button ref={trigger} variant="secondary" onClick={() => setOpen(true)}>
				Add website or file
			</Button>
			<SourceAttachmentDialog
				{...args}
				open={open}
				returnFocus={trigger}
				onOpenChange={(next) => {
					setOpen(next);
					args.onOpenChange(next);
				}}
			/>
		</>
	);
}

const meta = {
	title: "Components/07 Project & builder/Add website or file",
	component: SourceAttachmentDialog,
	render: (args) => <SourceDialogScene {...args} />,
	parameters: {
		design: figma("299:1996"),
		figmaNodeId: "299:1996",
		docs: {
			description: {
				component:
					"480px source dialog with a full-width URL field. Press Enter to add a website, or choose or drop a file up to 10 MB. Invalid URLs and failed requests preserve the entered value. Escape or Close returns focus to the trigger. The caller receives a normalized URL or a File and owns persistence.",
			},
		},
	},
	args: {
		open: true,
		onOpenChange: fn(),
		onAddWebsite: fn(),
		onAddFile: fn(),
	},
} satisfies Meta<typeof SourceAttachmentDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WebsiteReady: Story = {
	args: { defaultWebsite: "https://example.com" },
};
export const WebsitePending: Story = {
	args: {
		defaultWebsite: "https://example.com",
		onAddWebsite: fn(() => new Promise<void>(() => {})),
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const field = body.getByRole("textbox", { name: "Website" });
		await userEvent.type(field, "{Enter}");
		await expect(
			body.getByRole("dialog", { name: "Add website or file" }),
		).toHaveAttribute("aria-busy", "true");
		await expect(field).toHaveAttribute("readonly");
	},
};
export const InvalidWebsite: Story = {
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(
			body.getByRole("textbox", { name: "Website" }),
			"javascript:alert(1){Enter}",
		);
		await expect(body.getByRole("alert")).toHaveTextContent(
			"Enter a complete website address",
		);
	},
};
export const FailedWebsiteRequest: Story = {
	args: {
		defaultWebsite: "https://example.com",
		onAddWebsite: fn(async () => {
			throw new Error(
				"Couldn’t add this website. Check the address and try again.",
			);
		}),
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(
			body.getByRole("textbox", { name: "Website" }),
			"{Enter}",
		);
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Couldn’t add this website",
		);
		await expect(body.getByRole("textbox", { name: "Website" })).toHaveValue(
			"https://example.com",
		);
	},
};
export const FileValidationAndRetry: Story = {
	args: { onAddFile: fn() },
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		const picker = canvasElement.ownerDocument.querySelector<HTMLInputElement>(
			'.ap-source-dialog input[type="file"]',
		);
		if (!picker) throw new Error("File picker is missing");
		const user = userEvent.setup({ applyAccept: false });
		await user.upload(picker, new File(["unsupported"], "program.exe"));
		await expect(body.getByRole("alert")).toHaveTextContent(
			"Choose a PDF, DOCX, TXT, MD or CSV file",
		);
		await expect(args.onAddFile).not.toHaveBeenCalled();
		const file = new File(["Project notes"], "notes.txt", {
			type: "text/plain",
		});
		await user.upload(picker, file);
		await expect(args.onAddFile).toHaveBeenCalledWith(file);
	},
};
export const KeyboardDismissal: Story = {
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		await waitFor(() =>
			expect(body.getByRole("textbox", { name: "Website" })).toHaveFocus(),
		);
		await userEvent.keyboard("{Escape}");
		await expect(args.onOpenChange).toHaveBeenCalledWith(false);
		await waitFor(() =>
			expect(
				body.getByRole("button", { name: "Add website or file" }),
			).toHaveFocus(),
		);
	},
};
