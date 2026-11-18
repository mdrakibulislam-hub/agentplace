import { FormField, SelectField } from "@agentplace/ui/components/ap-controls";
import { Badge, StaffRow, Surface } from "@agentplace/ui/components/ap-data";
import type { MenuProject } from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useRef, useState } from "react";
import {
	SettingsDialog,
	SettingsHeading,
	SettingsNote,
} from "./settings-parts";
import type {
	ProjectRole,
	WorkspaceMember,
	WorkspaceRole,
} from "./settings-state";

const workspaceRoles = [
	{ value: "Member", label: "Member" },
	{ value: "Admin", label: "Admin" },
];
const projectRoles = [
	{ value: "Editor", label: "Editor" },
	{ value: "Viewer", label: "Viewer" },
];
const accessOptions = [{ value: "none", label: "No access" }, ...projectRoles];

function MemberAccess({
	member,
	projects,
	onSave,
	onRevoke,
	onClose,
}: {
	member: WorkspaceMember;
	projects: readonly MenuProject[];
	onSave: (member: WorkspaceMember) => void;
	onRevoke: () => void;
	onClose: () => void;
}) {
	const [draft, setDraft] = useState(member.access);
	const [revoking, setRevoking] = useState(false);
	const assigned = member.role === "Member";
	return (
		<SettingsDialog
			title={
				revoking ? "Revoke invitation?" : `Project access for ${member.name}`
			}
			description={
				revoking
					? `This removes the pending invitation for ${member.email}.`
					: assigned
						? "Choose which projects this member can access and what they can do."
						: `${member.role}s have access to all workspace projects.`
			}
			onClose={onClose}
		>
			{!revoking &&
				assigned &&
				projects.map((project) => (
					<SelectField
						key={project.id}
						label={project.name}
						options={accessOptions}
						value={draft[project.id] ?? "none"}
						showSupportingText={false}
						onChange={(event) => {
							const value = event.currentTarget.value;
							setDraft((previous) => {
								const next = { ...previous };
								if (value === "none") delete next[project.id];
								else next[project.id] = value as ProjectRole;
								return next;
							});
						}}
					/>
				))}
			<div className="product-settings-dialog-actions">
				{member.invited && !revoking && (
					<Button variant="ghost" onClick={() => setRevoking(true)}>
						Revoke invitation
					</Button>
				)}
				<Button
					variant="secondary"
					onClick={revoking ? () => setRevoking(false) : onClose}
				>
					{assigned || revoking ? "Cancel" : "Done"}
				</Button>
				{revoking ? (
					<Button variant="danger" onClick={onRevoke}>
						Revoke invitation
					</Button>
				) : (
					assigned && (
						<Button onClick={() => onSave({ ...member, access: draft })}>
							Save project access
						</Button>
					)
				)}
			</div>
		</SettingsDialog>
	);
}

export function StaffSettings({
	members,
	projects,
	onMembersChange,
}: {
	members: WorkspaceMember[];
	projects: readonly MenuProject[];
	onMembersChange: (members: WorkspaceMember[]) => void;
}) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<WorkspaceRole>("Member");
	const [project, setProject] = useState(projects[0]?.id ?? "none");
	const [projectRole, setProjectRole] = useState<ProjectRole>("Editor");
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [editing, setEditing] = useState<WorkspaceMember | null>(null);
	const emailControl = useRef<HTMLInputElement>(null);
	const assigned = projects.find((item) => item.id === project);
	const activeMembers = members.filter((member) => !member.invited).length;
	const accessSummary =
		role === "Admin"
			? "Can manage staff, skills and plugins across the workspace. Cannot manage billing."
			: !assigned
				? "Can access projects after receiving a project assignment. Cannot manage billing or staff."
				: projectRole === "Editor"
					? `Can edit and publish ${assigned.name}. Cannot manage billing or staff.`
					: `Can view and test ${assigned.name}. Cannot edit, publish or manage the workspace.`;
	function invite(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const address = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
			setError("Enter a valid email address.");
			emailControl.current?.focus();
			return;
		}
		if (
			members.some(
				(member) => member.email.toLowerCase() === address.toLowerCase(),
			)
		) {
			setError("This email already belongs to a member or pending invitation.");
			emailControl.current?.focus();
			return;
		}
		const localName = address.split("@")[0] ?? address;
		onMembersChange([
			...members,
			{
				id: crypto.randomUUID(),
				name: localName,
				email: address,
				initials: localName.slice(0, 2).toUpperCase(),
				role,
				access:
					role === "Member" && assigned ? { [assigned.id]: projectRole } : {},
				invited: true,
			},
		]);
		setNotice(`Invitation for ${address} is pending.`);
		setEmail("");
		setError("");
	}
	return (
		<>
			<SettingsHeading
				title="Staff & roles"
				description="Manage who can build, publish and administer your workspace."
			/>
			<div className="product-settings-split" data-reverse>
				<Surface className="product-settings-card product-settings-staff">
					<div className="product-settings-panel-title">
						<h2>Workspace staff</h2>
						<Badge>{`${activeMembers} ${activeMembers === 1 ? "member" : "members"}`}</Badge>
					</div>
					<div
						className="product-settings-staff-labels product-settings-caption product-settings-medium product-settings-muted"
						aria-hidden="true"
					>
						<span>PERSON</span>
						<span>ROLE</span>
						<span>ACCESS</span>
					</div>
					<div className="product-settings-staff-list">
						{members.map((member) => {
							const count = projects.filter(
								(item) => member.access[item.id],
							).length;
							return (
								<fieldset
									key={member.id}
									aria-label={member.name}
									className="product-settings-staff-entry"
								>
									<StaffRow
										name={member.name}
										email={member.email}
										initials={member.initials}
										workspaceRole={member.role}
										projectLabel={
											member.role !== "Member"
												? "All projects"
												: `${count} ${count === 1 ? "project" : "projects"}`
										}
										onProjects={() => setEditing(member)}
									/>
									{member.invited && (
										<Badge tone="warning">Invitation pending</Badge>
									)}
								</fieldset>
							);
						})}
					</div>
					<div className="product-settings-role-notes">
						<SettingsNote title="Workspace roles">
							<p>Owner · Billing and all workspace controls</p>
							<p>Admin · Manage staff, skills and plugins</p>
							<p>Member · Access assigned projects</p>
						</SettingsNote>
						<SettingsNote title="Project roles">
							<p>Editor · Build, test and publish assigned projects</p>
							<p>Viewer · View and test only</p>
						</SettingsNote>
					</div>
				</Surface>
				<Surface className="product-settings-card product-settings-invite">
					<form onSubmit={invite} noValidate>
						<h2>Invite staff</h2>
						<FormField
							ref={emailControl}
							label="Email address"
							type="email"
							autoComplete="email"
							placeholder="name@company.com"
							value={email}
							onChange={(event) => {
								setEmail(event.currentTarget.value);
								setError("");
								setNotice("");
							}}
							state={error ? "error" : "default"}
							showSupportingText={Boolean(error)}
							errorMessage={error}
							required
						/>
						<SelectField
							label="Workspace role"
							options={workspaceRoles}
							value={role}
							onChange={(event) =>
								setRole(event.currentTarget.value as WorkspaceRole)
							}
							showSupportingText={false}
						/>
						<SelectField
							label="Assign to project"
							options={[
								...projects.map((item) => ({
									value: item.id,
									label: item.name,
								})),
								{ value: "none", label: "No project" },
							]}
							value={assigned?.id ?? "none"}
							onChange={(event) => setProject(event.currentTarget.value)}
							showSupportingText={false}
							disabled={role !== "Member"}
						/>
						<SelectField
							label="Project role"
							options={projectRoles}
							value={projectRole}
							onChange={(event) =>
								setProjectRole(event.currentTarget.value as ProjectRole)
							}
							showSupportingText={false}
							disabled={role !== "Member" || !assigned}
						/>
						<SettingsNote title="Access summary">{accessSummary}</SettingsNote>
						<div className="product-settings-panel-actions">
							{notice && (
								<p role="status" className="product-settings-muted">
									{notice}
								</p>
							)}
							<Button size="medium" type="submit">
								Send invitation
							</Button>
						</div>
					</form>
				</Surface>
			</div>
			{editing && (
				<MemberAccess
					member={editing}
					projects={projects}
					onClose={() => setEditing(null)}
					onSave={(member) => {
						onMembersChange(
							members.map((item) => (item.id === member.id ? member : item)),
						);
						setNotice(`Project access updated for ${member.name}.`);
						setEditing(null);
					}}
					onRevoke={() => {
						onMembersChange(
							members.filter((member) => member.id !== editing.id),
						);
						setNotice(`Invitation for ${editing.email} revoked.`);
						setEditing(null);
						requestAnimationFrame(() => emailControl.current?.focus());
					}}
				/>
			)}
		</>
	);
}
