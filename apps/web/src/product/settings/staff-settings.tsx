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
import type { WorkspaceMember } from "./settings-state";

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
	onMembersChange: (members: WorkspaceMember[]) => void | Promise<void>;
	onInvite?: (draft: InvitationDraft) => Promise<WorkspaceMember>;
	onResend?: (member: WorkspaceMember) => Promise<void>;
	currentMemberId?: string;
}) {
	const [query, setQuery] = useState("");
	const [role, setRole] = useState("All roles");
	const [editing, setEditing] = useState<WorkspaceMember | null>(null);
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
		setInviting(false);
		requestAnimationFrame(() => {
			if (trigger.current?.isConnected) trigger.current.focus();
			else inviteButton.current?.focus();
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
				/>
			</div>
			{editing && !editing.invited && (
				<MemberAccessEditor
					key={editing.id}
					member={editing}
					projects={projects}
					onClose={close}
					onSave={async (member) => {
						if (editing.role === "Owner")
							throw new Error("Owner access is protected.");
						await onMembersChange(
							members.map((item) => (item.id === member.id ? member : item)),
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
						await onMembersChange(
							members.filter((member) => member.id !== editing.id),
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
						await onMembersChange([...members, member]);
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
