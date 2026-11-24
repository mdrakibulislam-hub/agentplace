import { SelectField } from "@agentplace/ui/components/ap-controls";
import { Badge, Surface } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	type MenuProject,
	RichMenuItem,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useRef, useState } from "react";
import {
	SettingsDialog,
	SettingsFeedback,
	SettingsHeading,
	SettingsNote,
	settingsError,
	useSettingsDetail,
	useSettingsDialog,
} from "./settings-parts";
import type { ConnectionId, WorkspaceConnection } from "./settings-state";

const accessOptions = [
	{ value: "allowed", label: "Allowed" },
	{ value: "denied", label: "No access" },
];

export function PluginSettings({
	connections,
	projects,
	active,
	onConnectionsChange,
}: {
	connections: WorkspaceConnection[];
	projects: readonly MenuProject[];
	active: boolean;
	onConnectionsChange: (
		update: (connections: WorkspaceConnection[]) => WorkspaceConnection[],
	) => void;
}) {
	const [selectedId, setSelectedId] = useState<ConnectionId>("leads");
	const [drafts, setDrafts] = useState<Partial<Record<ConnectionId, string[]>>>(
		{},
	);
	const [dialog, setDialog] = useSettingsDialog<
		"browse" | "connect" | "manage" | "disconnect" | null
	>(active, null);
	const [notice, setNotice] = useState("");
	const [error, setError] = useState("");
	const [dialogError, setDialogError] = useState("");
	const detail = useRef<HTMLDivElement>(null);
	const dialogTrigger = useRef<HTMLButtonElement>(null);
	const revealDetails = useSettingsDetail(detail, selectedId);
	const connectionButtons = useRef<
		Partial<Record<ConnectionId, HTMLButtonElement | null>>
	>({});
	const current = connections.find(
		(connection) => connection.id === selectedId,
	);
	const access = current ? (drafts[current.id] ?? current.access) : [];
	const dirty = Boolean(
		current &&
			projects.some(
				(project) =>
					access.includes(project.id) !== current.access.includes(project.id),
			),
	);
	function select(id: ConnectionId) {
		setSelectedId(id);
		setNotice("");
		setError("");
	}
	function openDialog(
		next: "browse" | "connect" | "manage" | "disconnect",
		trigger?: HTMLButtonElement,
	) {
		if (trigger) dialogTrigger.current = trigger;
		setDialogError("");
		setDialog(next);
	}
	function resetAccess(id: ConnectionId) {
		setDrafts((previous) => ({ ...previous, [id]: undefined }));
		setError("");
	}
	function update(connection: WorkspaceConnection) {
		onConnectionsChange((current) =>
			current.map((item) => (item.id === connection.id ? connection : item)),
		);
		resetAccess(connection.id);
	}
	function saveAccess(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!current || !dirty) return;
		try {
			update({
				...current,
				access: access.filter((id) =>
					projects.some((project) => project.id === id),
				),
			});
			setNotice(`Saved project access for ${current.name}.`);
			detail.current?.querySelector("h2")?.focus({ preventScroll: true });
		} catch (cause) {
			setError(settingsError(cause));
		}
	}
	function changeConnection(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!current || (dialog !== "connect" && dialog !== "disconnect")) return;
		const connected = dialog === "connect";
		try {
			update({ ...current, connected, access: [] });
			setNotice(`${current.name} ${connected ? "connected" : "disconnected"}.`);
			setDialog(null);
			requestAnimationFrame(() =>
				connectionButtons.current[current.id]?.focus({ preventScroll: true }),
			);
		} catch (cause) {
			setDialogError(settingsError(cause));
		}
	}
	return (
		<>
			<SettingsHeading
				title="Plugins"
				description="Connect the tools your agents need to complete real tasks."
				action={
					<Button
						variant="secondary"
						onClick={(event) => openDialog("browse", event.currentTarget)}
					>
						Browse plugins
					</Button>
				}
			/>
			<div className="product-settings-split">
				<Surface className="product-settings-card">
					<h2>Installed connections</h2>
					<div className="product-settings-list-options">
						{connections.map((connection) => (
							<div
								className="product-settings-connection-row"
								key={connection.id}
								data-disconnected={!connection.connected || undefined}
							>
								<RichMenuItem
									ref={(element) => {
										connectionButtons.current[connection.id] = element;
									}}
									label={connection.name}
									description={
										connection.connected ? "Connected" : "Not connected"
									}
									icon={
										<Icon
											className="product-settings-muted"
											name={connection.icon}
										/>
									}
									tag={connection.connected ? <Badge>Active</Badge> : undefined}
									state={connection.id === selectedId ? "selected" : "default"}
									aria-pressed={connection.id === selectedId}
									onClick={() => {
										select(connection.id);
										revealDetails();
									}}
								/>
								{!connection.connected && (
									<Button
										variant="secondary"
										onClick={(event) => {
											select(connection.id);
											openDialog("connect", event.currentTarget);
										}}
										aria-label={`Connect ${connection.name}`}
									>
										Connect
									</Button>
								)}
							</div>
						))}
					</div>
					<div className="product-settings-panel-actions">
						<SettingsNote title="Connect once, control access">
							Choose which projects can use each connection.
						</SettingsNote>
					</div>
				</Surface>
				<Surface
					ref={detail}
					className="product-settings-card product-settings-detail product-settings-plugin-detail"
				>
					{current && (
						<form onSubmit={saveAccess}>
							<div className="product-settings-panel-title">
								<Icon name={current.icon} size={20} />
								<h2 tabIndex={-1}>{current.name}</h2>
								<Badge tone={current.connected ? "success" : "neutral"}>
									{current.connected ? "Connected" : "Not connected"}
								</Badge>
							</div>
							<p className="product-settings-medium">
								{current.connected
									? `Destination: ${current.destination}`
									: "Connect this plugin to choose which projects can use it."}
							</p>
							<p className="product-settings-muted">{current.description}</p>
							{current.connected && (
								<>
									<h3 className="product-settings-access-heading">
										Project access
									</h3>
									{projects.length ? (
										projects.map((project) => (
											<div
												className="product-settings-plugin-access"
												key={project.id}
											>
												<span>{project.name}</span>
												<SelectField
													label={`Access for ${project.name}`}
													showLabel={false}
													showSupportingText={false}
													options={accessOptions}
													value={
														access.includes(project.id) ? "allowed" : "denied"
													}
													onChange={(event) => {
														const nextAccess =
															event.currentTarget.value === "allowed"
																? [...access, project.id]
																: access.filter((id) => id !== project.id);
														setDrafts((previous) => ({
															...previous,
															[current.id]: nextAccess,
														}));
														setNotice("");
														setError("");
													}}
												/>
											</div>
										))
									) : (
										<p className="product-settings-muted">
											There are no projects to grant access to.
										</p>
									)}
								</>
							)}
							<SettingsNote title="Connection permissions">
								{current.permissions}
							</SettingsNote>
							<div className="product-settings-panel-actions product-settings-actions">
								{current.connected && (
									<>
										<Button size="medium" type="submit" disabled={!dirty}>
											Save project access
										</Button>
										<Button
											size="medium"
											variant="ghost"
											icon={<Icon name="external-link" size={20} />}
											onClick={(event) =>
												openDialog("manage", event.currentTarget)
											}
										>
											Manage connection
										</Button>
										{dirty && (
											<Button
												size="medium"
												variant="ghost"
												onClick={() => {
													resetAccess(current.id);
													setNotice("");
													detail.current
														?.querySelector("h2")
														?.focus({ preventScroll: true });
												}}
											>
												Reset changes
											</Button>
										)}
									</>
								)}
							</div>
							<SettingsFeedback
								notice={notice}
								error={error}
								dirty={dirty && !error}
							/>
						</form>
					)}
				</Surface>
			</div>
			{dialog === "browse" && (
				<SettingsDialog
					title="Browse plugins"
					description="Choose a workspace connection to view its permissions."
					onClose={() => setDialog(null)}
					returnFocus={dialogTrigger}
				>
					{connections.map((connection) => (
						<RichMenuItem
							key={connection.id}
							label={connection.name}
							description={connection.connected ? "Connected" : "Not connected"}
							icon={connection.icon}
							onClick={() => {
								select(connection.id);
								if (connection.connected) {
									setDialog(null);
									revealDetails();
								} else {
									openDialog("connect");
								}
							}}
						/>
					))}
				</SettingsDialog>
			)}
			{dialog && dialog !== "browse" && current && (
				<SettingsDialog
					key={dialog}
					title={
						dialog === "connect"
							? `Connect ${current.name}`
							: dialog === "disconnect"
								? `Disconnect ${current.name}?`
								: `Manage ${current.name}`
					}
					description={
						dialog === "disconnect"
							? "All project access to this connection will be removed."
							: current.permissions
					}
					onClose={() => setDialog(null)}
					returnFocus={dialogTrigger}
				>
					<form
						className="product-settings-dialog-form"
						onSubmit={changeConnection}
					>
						{dialog === "connect" && (
							<p className="product-settings-muted">
								This creates a prototype connection. No external account will be
								contacted.
							</p>
						)}
						{dialog === "manage" && (
							<p className="product-settings-muted">{`Destination: ${current.destination}`}</p>
						)}
						<div className="product-settings-dialog-actions">
							<Button
								data-initial-focus
								variant="secondary"
								onClick={() => setDialog(null)}
							>
								{dialog === "manage" ? "Done" : "Cancel"}
							</Button>
							{dialog === "manage" ? (
								<Button
									variant="ghost"
									onClick={() => openDialog("disconnect")}
								>
									Disconnect
								</Button>
							) : (
								<Button
									type="submit"
									variant={dialog === "disconnect" ? "danger" : "default"}
								>
									{dialog === "connect" ? "Connect" : "Disconnect"}
								</Button>
							)}
						</div>
						<SettingsFeedback error={dialogError} />
					</form>
				</SettingsDialog>
			)}
		</>
	);
}
