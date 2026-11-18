import {
	InviteMemberDialog,
	PendingInvitationDialog,
} from "@agentplace/ui/components/ap-members";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "./fixtures";
import { members, projects } from "./member-fixtures";

const meta = {
	title: "Components/13 Tables & member access/Invitations",
	component: InviteMemberDialog,
	parameters: {
		layout: "fullscreen",
		design: figma("348:2767"),
		docs: {
			description: {
				component:
					"Invitation form with email and duplicate validation, workspace role and project access. Only a successful service response closes the form. Resend and revoke are independent operations with pending guards and recovery. Revocation always requires confirmation; these stories use isolated callbacks.",
			},
		},
	},
	args: { members, projects, onInvite: fn(), onClose: fn() },
	render: function Invite(args) {
		const [open, setOpen] = useState(true);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Invite member</Button>
				{open && (
					<InviteMemberDialog
						{...args}
						onClose={() => {
							args.onClose();
							setOpen(false);
						}}
					/>
				)}
			</>
		);
	},
} satisfies Meta<typeof InviteMemberDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Invite: Story = {};
export const ValidEmail: Story = {
	play: async ({ canvasElement }) => {
		await userEvent.type(
			within(canvasElement.ownerDocument.body).getByRole("textbox", {
				name: "Email address",
			}),
			"riya@whiteframe.agency",
		);
	},
};
export const InvalidAndDuplicate: Story = {
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		const input = body.getByRole("textbox", { name: "Email address" });
		await userEvent.click(
			body.getByRole("button", { name: "Send invitation" }),
		);
		await expect(body.getByText("Enter a valid email address.")).toBeVisible();
		await expect(input).toHaveFocus();
		await userEvent.type(input, "NORA@whiteframe.agency");
		await userEvent.click(
			body.getByRole("button", { name: "Send invitation" }),
		);
		await expect(
			body.getByText(
				"This email already belongs to a member or pending invitation.",
			),
		).toBeVisible();
		await expect(args.onInvite).not.toHaveBeenCalled();
	},
};
export const SendInvitation: Story = {
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency{Enter}",
		);
		await expect(args.onInvite).toHaveBeenCalledWith({
			email: "riya@whiteframe.agency",
			role: "Member",
			access: {},
		});
		await waitFor(() => expect(args.onClose).toHaveBeenCalled());
	},
};
export const DeliveryFailure: Story = {
	args: {
		onInvite: fn(async () => {
			throw new Error("Couldn’t send this invitation. Try again.");
		}),
	},
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency",
		);
		await userEvent.click(
			body.getByRole("button", { name: "Send invitation" }),
		);
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Couldn’t send this invitation",
		);
		await expect(
			body.getByRole("textbox", { name: "Email address" }),
		).toHaveValue("riya@whiteframe.agency");
		await expect(args.onClose).not.toHaveBeenCalled();
	},
};
export const Sending: Story = {
	args: { onInvite: fn(() => new Promise<void>(() => {})) },
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency",
		);
		await userEvent.click(
			body.getByRole("button", { name: "Send invitation" }),
		);
		await userEvent.keyboard("{Escape}");
		await expect(
			body.getByRole("textbox", { name: "Email address" }),
		).toBeDisabled();
		await expect(args.onInvite).toHaveBeenCalledTimes(1);
		await expect(args.onClose).not.toHaveBeenCalled();
	},
};
export const Pending: Story = {
	parameters: { design: figma("348:2850") },
	render: () => (
		<PendingInvitationDialog
			member={members[3]}
			projects={projects}
			onClose={fn()}
			onResend={fn()}
			onRevoke={fn()}
		/>
	),
};
export const ResendFailureAndRetry: Story = {
	render: () => (
		<PendingInvitationDialog
			member={members[3]}
			projects={projects}
			onClose={fn()}
			onResend={fn()
				.mockRejectedValueOnce(new Error("Couldn’t resend. Try again."))
				.mockResolvedValue(undefined)}
			onRevoke={fn()}
		/>
	),
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("button", { name: "Resend invitation" }),
		);
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Couldn’t resend",
		);
		await userEvent.click(
			body.getByRole("button", { name: "Resend invitation" }),
		);
		await expect(await body.findByRole("status")).toHaveTextContent(
			"Invitation resent.",
		);
	},
};
export const RevokeConfirmation: Story = {
	render: () => (
		<PendingInvitationDialog
			member={members[3]}
			projects={projects}
			onClose={fn()}
			onResend={fn()}
			onRevoke={fn()}
		/>
	),
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("button", { name: "Revoke invitation" }),
		);
		const dialog = await body.findByRole("dialog", {
			name: "Revoke invitation?",
		});
		await waitFor(() =>
			expect(
				within(dialog).getByRole("button", { name: "Cancel" }),
			).toHaveFocus(),
		);
	},
};
export const RevokeFailureAndRetry: Story = {
	render: function Revoke() {
		const [open, setOpen] = useState(true);
		const [revoke] = useState(() =>
			fn()
				.mockRejectedValueOnce(new Error("Couldn’t revoke. Try again."))
				.mockResolvedValue(undefined),
		);
		return open ? (
			<PendingInvitationDialog
				member={members[3]}
				projects={projects}
				onClose={() => setOpen(false)}
				onResend={fn()}
				onRevoke={revoke}
			/>
		) : (
			<p>Invitation revoked</p>
		);
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("button", { name: "Revoke invitation" }),
		);
		const dialog = await body.findByRole("dialog", {
			name: "Revoke invitation?",
		});
		await userEvent.click(
			within(dialog).getByRole("button", { name: "Revoke invitation" }),
		);
		await expect(await within(dialog).findByRole("alert")).toHaveTextContent(
			"Couldn’t revoke",
		);
		await userEvent.click(
			within(dialog).getByRole("button", { name: "Revoke invitation" }),
		);
		await expect(await body.findByText("Invitation revoked")).toBeVisible();
	},
};
