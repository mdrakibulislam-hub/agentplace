import { Dialog } from "@base-ui/react/dialog";
import { Select } from "@base-ui/react/select";
import { motion } from "motion/react";
import { type ReactNode, type RefObject, useRef, useState } from "react";
import { FormField, SelectField } from "./ap-controls";
import { Avatar } from "./ap-data";
import { ConfirmDialog } from "./ap-dialog";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import { Input } from "./input";
import "../styles/ap-members.css";

export type MemberWorkspaceRole = "Owner" | "Admin" | "Member";
export type MemberProjectRole = "Editor" | "Viewer";
export interface MemberRecord {
	id: string;
	name: string;
	email: string;
	initials: string;
	role: MemberWorkspaceRole;
	access: Record<string, MemberProjectRole>;
	invited?: boolean;
}
export interface AccessProject {
	id: string;
	name: string;
}
export type InvitationDraft = Pick<MemberRecord, "email" | "role" | "access">;
export function MemberPersonCell({
	member,
	self = false,
	large = false,
}: {
	member: Pick<MemberRecord, "name" | "email" | "initials">;
	self?: boolean;
	large?: boolean;
}) {
	return (
		<div className="ap-member-person" data-large={large}>
			<Avatar initials={member.initials} size={large ? "large" : "medium"} />
			<div>
				<div className="ap-member-name">
					<span>{member.name}</span>
					{self && <span className="ap-member-you">You</span>}
				</div>
				<div className="ap-member-email">{member.email}</div>
			</div>
		</div>
	);
}
export function MemberRoleCell({
	workspaceRole,
}: {
	workspaceRole: MemberWorkspaceRole;
}) {
	return <span>{workspaceRole}</span>;
}
export function MemberAccessCell({
	workspaceRole,
	count,
}: {
	workspaceRole: MemberWorkspaceRole;
	count: number;
}) {
	return (
		<span>
			{workspaceRole !== "Member"
				? "All projects"
				: `${count} ${count === 1 ? "project" : "projects"}`}
		</span>
	);
}
export function MemberStatus({
	status = "Active",
}: {
	status?: "Active" | "Invited" | "Expired";
}) {
	return (
		<span className="ap-member-status" data-status={status}>
			<span aria-hidden="true" />
			{status}
		</span>
	);
}
export function MemberAction({
	member,
	onEdit,
}: {
	member: MemberRecord;
	onEdit?: (member: MemberRecord) => void;
}) {
	return member.role === "Owner" ? (
		<button
			type="button"
			className="ap-member-lock"
			aria-disabled="true"
			aria-label="Owner access is protected"
			title="Owner access is protected"
		>
			<Icon name="lock" size={16} />
		</button>
	) : (
		<Button
			variant="ghost"
			size="small"
			onClick={() => onEdit?.(member)}
			aria-label={`${member.invited ? "Manage invitation for" : "Edit access for"} ${member.name}`}
		>
			{member.invited ? "Manage invite" : "Edit access"}
		</Button>
	);
}
export function MemberTableHeader() {
	return (
		<thead>
			<tr>
				{[
					"Member",
					"Workspace role",
					"Project access",
					"Status",
					"Actions",
				].map((label) => (
					<th key={label} scope="col">
						{label === "Actions" ? (
							<span className="ap-control-sr-only">Actions</span>
						) : (
							label
						)}
					</th>
				))}
			</tr>
		</thead>
	);
}
export function MemberTableRow({
	member,
	projects,
	self,
	onEdit,
}: {
	member: MemberRecord;
	projects: readonly AccessProject[];
	self?: boolean;
	onEdit?: (member: MemberRecord) => void;
}) {
	return (
		<tr>
			<td>
				<MemberPersonCell member={member} self={self} />
			</td>
			<td>
				<MemberRoleCell workspaceRole={member.role} />
			</td>
			<td>
				<MemberAccessCell
					workspaceRole={member.role}
					count={projects.filter((p) => member.access[p.id]).length}
				/>
			</td>
			<td>
				<MemberStatus status={member.invited ? "Invited" : "Active"} />
			</td>
			<td>
				<MemberAction member={member} onEdit={onEdit} />
			</td>
		</tr>
	);
}
export function MembersSearchEmpty({ onClear }: { onClear: () => void }) {
	return (
		<div className="ap-members-empty">
			<strong>No matching members</strong>
			<p>Try another name or email.</p>
			<Button variant="ghost" size="small" onClick={onClear}>
				Clear search
			</Button>
		</div>
	);
}
export function WorkspaceMembersTable({
	members,
	projects,
	currentMemberId,
	onEdit,
	onClear,
}: {
	members: readonly MemberRecord[];
	projects: readonly AccessProject[];
	currentMemberId?: string;
	onEdit?: (member: MemberRecord) => void;
	onClear: () => void;
}) {
	return (
		<div className="ap-members-table">
			<section
				className="ap-members-scroll"
				// biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard access to the horizontal table scroll.
				tabIndex={0}
				aria-label="Workspace members"
			>
				<table>
					<caption className="ap-control-sr-only">
						Workspace members and permissions
					</caption>
					<colgroup>
						{[35.7143, 14.2857, 22.8571, 14.2857, 12.8572].map((width, i) => (
							<col key={i} style={{ width: `${width}%` }} />
						))}
					</colgroup>
					<MemberTableHeader />
					<tbody>
						{members.map((member) => (
							<MemberTableRow
								key={member.id}
								member={member}
								projects={projects}
								self={member.id === currentMemberId}
								onEdit={onEdit}
							/>
						))}
					</tbody>
				</table>
			</section>
			{!members.length && <MembersSearchEmpty onClear={onClear} />}
			<div className="ap-members-table-footer">
				{members.length} {members.length === 1 ? "person" : "people"} in this
				workspace
			</div>
		</div>
	);
}
export function MemberSearch({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="ap-member-search">
			<Icon name="search" size={16} />
			<Input
				type="search"
				aria-label="Search members"
				placeholder="Search members…"
				value={value}
				onChange={(event) => onChange(event.target.value)}
			/>
		</div>
	);
}
export function MemberToolbar({
	query,
	onQueryChange,
	role,
	onRoleChange,
	count,
}: {
	query: string;
	onQueryChange: (query: string) => void;
	role: string;
	onRoleChange: (role: string) => void;
	count: string;
}) {
	return (
		<div className="ap-member-toolbar">
			<MemberSearch value={query} onChange={onQueryChange} />
			<SelectField
				label="Filter by workspace role"
				showLabel={false}
				showSupportingText={false}
				value={role}
				onChange={(event) => onRoleChange(event.target.value)}
				options={["All roles", "Owner", "Admin", "Member"].map((value) => ({
					value,
					label: value,
				}))}
			/>
			<span className="ap-member-count" role="status">
				{count}
			</span>
		</div>
	);
}
const workspaceOptions: { value: string; label?: string; detail: string }[] = [
	{ value: "Member", detail: "Access assigned projects" },
	{ value: "Admin", detail: "Manage members, skills and plugins" },
];
const projectOptions: { value: string; label?: string; detail: string }[] = [
	{ value: "Editor", detail: "Build, test and publish" },
	{ value: "Viewer", detail: "View and test only" },
	{ value: "none", label: "No access", detail: "Remove project access" },
];
export function AccessRoleSelect({
	value,
	onChange,
	kind = "project",
	label,
	disabled = false,
}: {
	value: string;
	onChange: (value: string) => void;
	kind?: "workspace" | "project";
	label: string;
	disabled?: boolean;
}) {
	const options = kind === "workspace" ? workspaceOptions : projectOptions;
	return (
		<Select.Root
			value={value}
			onValueChange={(next) => {
				if (next) onChange(next);
			}}
			disabled={disabled}
			items={options.map((option) => ({
				value: option.value,
				label: option.label ?? option.value,
			}))}
		>
			<Select.Trigger className="ap-access-select" aria-label={label}>
				<Select.Value />
				<Select.Icon>
					<Icon name="chevron-down" size={20} />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Positioner
					sideOffset={6}
					alignItemWithTrigger={false}
					className="ap-access-positioner"
				>
					<Select.Popup className="ap-access-menu">
						<Select.List>
							{options.map((option) => (
								<Select.Item
									key={option.value}
									value={option.value}
									className="ap-access-option"
								>
									<div>
										<Select.ItemText>
											{option.label ?? option.value}
										</Select.ItemText>
										<small>{option.detail}</small>
									</div>
									<Select.ItemIndicator>
										<Icon name="check" size={16} />
									</Select.ItemIndicator>
								</Select.Item>
							))}
						</Select.List>
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	);
}
export function ProjectAccessRow({
	project,
	value,
	onChange,
	disabled,
}: {
	project: AccessProject;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}) {
	return (
		<tr>
			<td>
				<span className="ap-access-project-icon">
					<Icon name="briefcase-business" size={16} />
				</span>
				<span className="ap-access-project-name">{project.name}</span>
			</td>
			<td>
				<AccessRoleSelect
					label={`Access to ${project.name}`}
					value={value}
					onChange={onChange}
					disabled={disabled}
				/>
			</td>
		</tr>
	);
}
export function ProjectAccessTable({
	projects,
	access,
	onChange,
	disabled,
}: {
	projects: readonly AccessProject[];
	access: Record<string, MemberProjectRole>;
	onChange: (access: Record<string, MemberProjectRole>) => void;
	disabled?: boolean;
}) {
	return (
		<div className="ap-project-access-table">
			<table>
				<thead>
					<tr>
						<th scope="col">Project</th>
						<th scope="col">Access</th>
					</tr>
				</thead>
				<tbody>
					{projects.map((project) => (
						<ProjectAccessRow
							key={project.id}
							project={project}
							value={access[project.id] ?? "none"}
							disabled={disabled}
							onChange={(value) => {
								const next = { ...access };
								if (value === "none") delete next[project.id];
								else next[project.id] = value as MemberProjectRole;
								onChange(next);
							}}
						/>
					))}
				</tbody>
			</table>
			{!projects.length && (
				<p className="ap-access-helper">No projects in this workspace yet.</p>
			)}
		</div>
	);
}
function AccessFields({
	role,
	access,
	projects,
	onRole,
	onAccess,
	disabled,
	helper = true,
}: {
	role: MemberWorkspaceRole;
	access: Record<string, MemberProjectRole>;
	projects: readonly AccessProject[];
	onRole: (role: MemberWorkspaceRole) => void;
	onAccess: (access: Record<string, MemberProjectRole>) => void;
	disabled: boolean;
	helper?: boolean;
}) {
	return (
		<>
			<div className="ap-access-role-field">
				<span>Workspace role</span>
				<AccessRoleSelect
					kind="workspace"
					label="Workspace role"
					value={role}
					onChange={(value) => onRole(value as MemberWorkspaceRole)}
					disabled={disabled}
				/>
				{helper && (
					<p className="ap-access-helper">
						{role === "Admin"
							? "Manage workspace members, skills and plugins."
							: "Access only the projects assigned below."}
					</p>
				)}
			</div>
			<section className="ap-access-projects">
				<div className="ap-access-section-heading">
					<strong>Project access</strong>
					<span>
						{role === "Admin"
							? "All projects"
							: `${projects.filter((p) => access[p.id]).length} assigned`}
					</span>
				</div>
				{role === "Admin" ? (
					<div className="ap-access-admin">
						<strong>Access to all projects</strong>
						<p>
							Admins can build, test and publish in all current and future
							projects.
						</p>
						<p>Billing stays owner-only.</p>
					</div>
				) : (
					<>
						<ProjectAccessTable
							projects={projects}
							access={access}
							onChange={onAccess}
							disabled={disabled}
						/>
						{helper && (
							<p className="ap-access-helper">
								Editor: build & publish · Viewer: view & test
							</p>
						)}
					</>
				)}
			</section>
		</>
	);
}
export function AccessSaveError({
	title = "Changes weren’t saved.",
	message = "Your edits are still here. Try again.",
}: {
	title?: string;
	message?: string;
}) {
	return (
		<div className="ap-access-error" role="alert">
			<strong>{title}</strong>
			<p>{message}</p>
		</div>
	);
}
export function AccessSuccessToast({
	title = "Access updated",
	message,
	onDismiss,
}: {
	title?: string;
	message: string;
	onDismiss?: () => void;
}) {
	return (
		<div className="ap-access-toast" role="status">
			<span className="ap-access-success-icon">
				<Icon name="check" size={16} />
			</span>
			<div>
				<strong>{title}</strong>
				<p>{message}</p>
			</div>
			{onDismiss && (
				<button
					type="button"
					className="ap-dialog-close"
					aria-label="Dismiss notification"
					onClick={onDismiss}
				>
					<Icon name="close" size={16} />
				</button>
			)}
		</div>
	);
}
function AccessOverlay({
	title,
	drawer = false,
	pending,
	onClose,
	children,
	footer,
	initialFocus,
}: {
	title: string;
	drawer?: boolean;
	pending: boolean;
	onClose: () => void;
	children: ReactNode;
	footer?: ReactNode;
	initialFocus?: RefObject<HTMLElement | null>;
}) {
	const popup = useRef<HTMLDivElement>(null);
	const { reduced } = useMotionEnvironment(popup);
	return (
		<Dialog.Root
			open
			onOpenChange={(open) => {
				if (!open && !pending) onClose();
			}}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="ap-dialog-backdrop" />
				<Dialog.Popup
					ref={popup}
					initialFocus={initialFocus}
					aria-describedby={undefined}
					className={drawer ? "ap-access-drawer" : "ap-access-dialog"}
					render={
						<motion.div
							initial={
								reduced
									? false
									: drawer
										? { x: 24, opacity: 0 }
										: { y: 12, scale: 0.98, opacity: 0 }
							}
							animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
							transition={
								reduced
									? { duration: 0 }
									: { ...springs.dialog, opacity: { duration: 0.16 } }
							}
						/>
					}
				>
					<header className="ap-access-heading">
						<Dialog.Title>{title}</Dialog.Title>
						<button
							type="button"
							className="ap-dialog-close"
							aria-label={`Close ${title.toLowerCase()}`}
							disabled={pending}
							onClick={onClose}
						>
							<Icon name="close" size={16} />
						</button>
					</header>
					<div className="ap-access-body" aria-busy={pending}>
						{children}
					</div>
					{footer && <footer className="ap-access-footer">{footer}</footer>}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
function sameAccess(
	a: Record<string, MemberProjectRole>,
	b: Record<string, MemberProjectRole>,
) {
	return (
		Object.keys(a).length === Object.keys(b).length &&
		Object.keys(a).every((key) => a[key] === b[key])
	);
}
export function MemberAccessEditor({
	member,
	projects,
	onSave,
	onClose,
}: {
	member: MemberRecord;
	projects: readonly AccessProject[];
	onSave: (member: MemberRecord) => void | Promise<void>;
	onClose: () => void;
}) {
	const [role, setRole] = useState(member.role);
	const [access, setAccess] = useState({ ...member.access });
	const [pending, setPending] = useState(false);
	const lock = useRef(false);
	const [error, setError] = useState("");
	const [discard, setDiscard] = useState(false);
	const dirty =
		role !== member.role ||
		(role === "Member" && !sameAccess(access, member.access));
	function close() {
		if (lock.current) return;
		if (dirty) setDiscard(true);
		else onClose();
	}
	async function save() {
		if (lock.current || !dirty || member.role === "Owner") return;
		lock.current = true;
		setPending(true);
		setError("");
		try {
			await onSave({ ...member, role, access: role === "Admin" ? {} : access });
			onClose();
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Your edits are still here. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
		}
	}
	return (
		<>
			<AccessOverlay
				title="Edit member"
				drawer
				pending={pending}
				onClose={close}
				footer={
					<>
						<span className="ap-access-helper">
							{pending
								? "Saving…"
								: dirty
									? "Unsaved changes"
									: "No changes to save"}
						</span>
						<div>
							<Button
								variant="secondary"
								size="medium"
								disabled={pending}
								onClick={close}
							>
								Cancel
							</Button>
							<Button
								size="medium"
								disabled={!dirty || member.role === "Owner"}
								loading={pending}
								onClick={save}
							>
								{error ? "Try again" : "Save changes"}
							</Button>
						</div>
					</>
				}
			>
				<MemberPersonCell member={member} large />
				{member.role === "Owner" ? (
					<p>Owner access is protected.</p>
				) : (
					<AccessFields
						role={role}
						access={access}
						projects={projects}
						onRole={setRole}
						onAccess={setAccess}
						disabled={pending}
					/>
				)}
				{error && <AccessSaveError message={error} />}
			</AccessOverlay>
			<ConfirmDialog
				open={discard}
				onOpenChange={setDiscard}
				title="Discard changes?"
				description={`Your changes to ${member.name}’s access haven’t been saved.`}
				cancelLabel="Keep editing"
				confirmLabel="Discard changes"
				onConfirm={onClose}
			/>
		</>
	);
}
export function InviteMemberDialog({
	projects,
	members,
	onInvite,
	onClose,
}: {
	projects: readonly AccessProject[];
	members: readonly MemberRecord[];
	onInvite: (draft: InvitationDraft) => Promise<void>;
	onClose: () => void;
}) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<MemberWorkspaceRole>("Member");
	const [access, setAccess] = useState<Record<string, MemberProjectRole>>({});
	const [pending, setPending] = useState(false);
	const lock = useRef(false);
	const [error, setError] = useState("");
	const [fieldError, setFieldError] = useState("");
	const emailRef = useRef<HTMLInputElement>(null);
	const [discard, setDiscard] = useState(false);
	function close() {
		if (lock.current) return;
		if (email || role !== "Member" || Object.keys(access).length)
			setDiscard(true);
		else onClose();
	}
	async function send() {
		if (lock.current) return;
		const address = email.trim();
		const invalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)
			? "Enter a valid email address."
			: members.some((m) => m.email.toLowerCase() === address.toLowerCase())
				? "This email already belongs to a member or pending invitation."
				: "";
		setFieldError(invalid);
		if (invalid) {
			emailRef.current?.focus();
			return;
		}
		lock.current = true;
		setPending(true);
		setError("");
		try {
			await onInvite({
				email: address,
				role,
				access: role === "Admin" ? {} : access,
			});
			onClose();
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Invitation wasn’t sent. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
		}
	}
	return (
		<>
			<AccessOverlay
				title="Invite member"
				initialFocus={emailRef}
				pending={pending}
				onClose={close}
				footer={
					<div>
						<Button
							variant="secondary"
							size="medium"
							disabled={pending}
							onClick={close}
						>
							Cancel
						</Button>
						<Button size="medium" loading={pending} onClick={send}>
							Send invitation
						</Button>
					</div>
				}
			>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						void send();
					}}
					noValidate
				>
					<FormField
						ref={emailRef}
						label="Email address"
						type="email"
						autoComplete="email"
						placeholder="name@company.com"
						value={email}
						onChange={(event) => {
							setEmail(event.target.value);
							setFieldError("");
						}}
						disabled={pending}
						required
						state={fieldError ? "error" : "default"}
						showSupportingText={!!fieldError}
						errorMessage={fieldError}
					/>
					<button type="submit" hidden disabled={pending}>
						Send invitation
					</button>
				</form>
				<AccessFields
					role={role}
					access={access}
					projects={projects}
					onRole={setRole}
					onAccess={setAccess}
					disabled={pending}
					helper={false}
				/>
				{error && (
					<AccessSaveError title="Invitation wasn’t sent." message={error} />
				)}
			</AccessOverlay>
			<ConfirmDialog
				open={discard}
				onOpenChange={setDiscard}
				title="Discard invitation?"
				description="Your invitation hasn’t been sent."
				cancelLabel="Keep editing"
				confirmLabel="Discard invitation"
				onConfirm={onClose}
			/>
		</>
	);
}
export function PendingInvitationDialog({
	member,
	projects,
	onResend,
	onRevoke,
	onClose,
}: {
	member: MemberRecord;
	projects: readonly AccessProject[];
	onResend: () => Promise<void>;
	onRevoke: () => Promise<void>;
	onClose: () => void;
}) {
	const [pending, setPending] = useState(false);
	const lock = useRef(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [revoke, setRevoke] = useState(false);
	async function resend() {
		if (lock.current) return;
		lock.current = true;
		setPending(true);
		setError("");
		setNotice("");
		try {
			await onResend();
			setNotice("Invitation resent.");
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Invitation wasn’t resent. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
		}
	}
	return (
		<>
			<AccessOverlay
				title="Manage invitation"
				pending={pending}
				onClose={onClose}
				footer={
					<>
						<Button
							variant="ghost"
							size="medium"
							className="ap-access-revoke"
							disabled={pending}
							onClick={() => setRevoke(true)}
						>
							Revoke invitation
						</Button>
						<Button size="medium" loading={pending} onClick={resend}>
							Resend invitation
						</Button>
					</>
				}
			>
				<MemberPersonCell member={member} large />
				<div className="ap-invitation-state">
					<MemberStatus status="Invited" />
					<span>Waiting for acceptance</span>
				</div>
				<dl className="ap-invitation-summary">
					<div>
						<dt>Workspace role</dt>
						<dd>{member.role}</dd>
					</div>
					<div>
						<dt>Project access</dt>
						<dd>
							{member.role !== "Member"
								? "All projects"
								: projects
										.filter((p) => member.access[p.id])
										.map((p) => `${p.name} · ${member.access[p.id]}`)
										.join(", ") || "No projects assigned"}
						</dd>
					</div>
				</dl>
				{error && (
					<AccessSaveError title="Invitation wasn’t resent." message={error} />
				)}
				{notice && <p role="status">{notice}</p>}
			</AccessOverlay>
			<ConfirmDialog
				open={revoke}
				onOpenChange={setRevoke}
				title="Revoke invitation?"
				description={`This removes the pending invitation for ${member.email}.`}
				confirmLabel="Revoke invitation"
				onConfirm={async () => {
					await onRevoke();
					onClose();
				}}
			/>
		</>
	);
}
