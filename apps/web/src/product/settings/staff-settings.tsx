import { ConfirmDialog } from "@agentplace/ui/components/ap-dialog";
import {
	AccessSuccessToast,
	type InvitationDraft,
	InviteMemberDialog,
	MemberAccessEditor,
	MemberToolbar,
	PendingInvitationDialog,
	WorkspaceMembersTable,
} from "@agentplace/ui/components/ap-members";
import type { MenuProject } from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { useRef, useState } from "react";
import { SettingsHeading } from "./settings-parts";
import type { MemberUpdate, WorkspaceMember } from "./settings-state";

export function StaffSettings({
	members,
	projects,
	onMembersChange,
	onInvite,
	onResend,
	currentMemberId,
}: {
	members: WorkspaceMember[];
	projects: readonly MenuProject[];
	onMembersChange: (update: MemberUpdate) => void | Promise<void>;
	onInvite?: (draft: InvitationDraft) => Promise<WorkspaceMember>;
	onResend?: (member: WorkspaceMember) => Promise<void>;
	currentMemberId?: string;
}) {
	const [query, setQuery] = useState("");
	const [role, setRole] = useState("All roles");
	const [editing, setEditing] = useState<WorkspaceMember | null>(null);
	const [removing, setRemoving] = useState<WorkspaceMember | null>(null);
	const [inviting, setInviting] = useState(false);
	const [notice, setNotice] = useState<{
		title: string;
		message: string;
	} | null>(null);
	const inviteButton = useRef<HTMLButtonElement>(null);
	const trigger = useRef<HTMLElement | null>(null);
	const filtered = members.filter(
		(member) =>
			(role === "All roles" || member.role === role) &&
			`${member.name} ${member.email}`
				.toLowerCase()
				.includes(query.trim().toLowerCase()),
	);
	const active = members.filter((member) => !member.invited).length;
	const invited = members.length - active;
	const count =
		query.trim() || role !== "All roles"
			? `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`
			: `${active} ${active === 1 ? "member" : "members"}${invited ? ` · ${invited} ${invited === 1 ? "invitation" : "invitations"}` : ""}`;
	function close() {
		setEditing(null);
		setRemoving(null);
		setInviting(false);
		requestAnimationFrame(() => {
			if (trigger.current?.isConnected) trigger.current.focus();
			else inviteButton.current?.focus();
		});
	}
	function canManageMembers(list: WorkspaceMember[]) {
		if (!currentMemberId) return true;
		const actor = list.find((member) => member.id === currentMemberId);
		return (
			!actor?.invited && (actor?.role === "Owner" || actor?.role === "Admin")
		);
	}
	async function removeMember(member: WorkspaceMember) {
		await onMembersChange((current) => {
			const target = current.find((item) => item.id === member.id);
			if (
				!canManageMembers(current) ||
				!target ||
				target.role === "Owner" ||
				target.invited ||
				target.id === currentMemberId
			) {
				throw new Error("This member can no longer be removed.");
			}
			return current.filter((item) => item.id !== member.id);
		});
		setNotice({
			title: "Member removed",
			message: `${member.name} was removed from this workspace.`,
		});
	}
	return (
		<>
			<SettingsHeading
				title="Staff & roles"
				description="Manage workspace members and project permissions."
				action={
					<Button
						ref={inviteButton}
						size="medium"
						onClick={() => {
							trigger.current = inviteButton.current;
							setNotice(null);
							setInviting(true);
						}}
					>
						Invite member
					</Button>
				}
			/>
			<div className="product-staff-table-layout">
				<MemberToolbar
					query={query}
					onQueryChange={setQuery}
					role={role}
					onRoleChange={setRole}
					count={count}
				/>
				<WorkspaceMembersTable
					members={filtered}
					projects={projects}
					currentMemberId={currentMemberId}
					onClear={() => {
						setQuery("");
						setRole("All roles");
					}}
					onEdit={(member) => {
						if (member.role === "Owner") return;
						trigger.current = document.activeElement as HTMLElement;
						setNotice(null);
						setEditing(member);
					}}
					onRemove={
						canManageMembers(members)
							? (member, button) => {
									trigger.current = button;
									setNotice(null);
									setRemoving(member);
								}
							: undefined
					}
				/>
			</div>
			{removing && (
				<ConfirmDialog
					open
					title={`Remove ${removing.name} from this workspace?`}
					description={`${removing.name} will lose access to this workspace and its projects.`}
					confirmLabel="Remove member"
					onOpenChange={(open) => {
						if (!open) close();
					}}
					onConfirm={() => removeMember(removing)}
				/>
			)}
			{editing && !editing.invited && (
				<MemberAccessEditor
					key={editing.id}
					member={editing}
					projects={projects}
					onClose={close}
					onSave={async (member) => {
						if (editing.role === "Owner")
							throw new Error("Owner access is protected.");
						await onMembersChange((current) =>
							current.map((item) => (item.id === member.id ? member : item)),
						);
						setNotice({
							title: "Access updated",
							message: `${member.name}’s permissions were saved.`,
						});
					}}
				/>
			)}
			{editing?.invited && (
				<PendingInvitationDialog
					member={editing}
					projects={projects}
					onClose={close}
					onResend={async () => {
						if (!onResend)
							throw new Error(
								"Invitations aren’t available yet. Please try again later.",
							);
						await onResend(editing);
					}}
					onRevoke={async () => {
						await onMembersChange((current) =>
							current.filter((member) => member.id !== editing.id),
						);
						setNotice({
							title: "Invitation revoked",
							message: `${editing.name}’s pending invitation was removed.`,
						});
					}}
				/>
			)}
			{inviting && (
				<InviteMemberDialog
					members={members}
					projects={projects}
					onClose={close}
					onInvite={async (draft) => {
						if (!onInvite)
							throw new Error(
								"Invitations aren’t available yet. Your invitation hasn’t been sent.",
							);
						const member = await onInvite(draft);
						await onMembersChange((current) => [...current, member]);
						setNotice({
							title: "Invitation sent",
							message: `Waiting for ${member.email} to accept.`,
						});
					}}
				/>
			)}
			{notice && (
				<AccessSuccessToast {...notice} onDismiss={() => setNotice(null)} />
			)}
		</>
	);
}
