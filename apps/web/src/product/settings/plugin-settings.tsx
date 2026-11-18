import { SelectField } from "@agentplace/ui/components/ap-controls";
import { Badge, Surface } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	type MenuProject,
	RichMenuItem,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { useRef, useState } from "react";
import {
	SettingsDialog,
	SettingsHeading,
	SettingsNote,
} from "./settings-parts";
import type { ConnectionId, WorkspaceConnection } from "./settings-state";

const accessOptions = [
	{ value: "allowed", label: "Allowed" },
	{ value: "denied", label: "No access" },
];

export function PluginSettings({
	connections,
	projects,
	onConnectionsChange,
}: {
	connections: WorkspaceConnection[];
	projects: readonly MenuProject[];
	onConnectionsChange: (connections: WorkspaceConnection[]) => void;
}) {
	const [selectedId, setSelectedId] = useState<ConnectionId>("leads");
	const [drafts, setDrafts] = useState<Partial<Record<ConnectionId, string[]>>>(
		{},
	);
	const [dialog, setDialog] = useState<
		"browse" | "connect" | "manage" | "disconnect" | null
	>(null);
	const [notice, setNotice] = useState("");
	const connectionButtons = useRef<
		Partial<Record<ConnectionId, HTMLButtonElement | null>>
	>({});
	const current = connections.find(
		(connection) => connection.id === selectedId,
	);
	const access = current ? (drafts[current.id] ?? current.access) : [];
	function select(id: ConnectionId) {
		setSelectedId(id);
		setNotice("");
	}
	function update(connection: WorkspaceConnection) {
		onConnectionsChange(
			connections.map((item) =>
				item.id === connection.id ? connection : item,
			),
		);
		setDrafts((previous) => ({ ...previous, [connection.id]: undefined }));
	}
	return (
		<>
			<SettingsHeading
				title="Plugins"
				description="Connect the tools your agents need to complete real tasks."
				action={
					<Button variant="secondary" onClick={() => setDialog("browse")}>
						Browse plugins
					</Button>
				}
			/>
			<div className="product-settings-split">
				<Surface className="product-settings-card product-settings-plugin-list">
					<h2>Installed connections</h2>
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
								onClick={() => select(connection.id)}
							/>
							{!connection.connected && (
								<Button
									variant="secondary"
									onClick={() => {
										select(connection.id);
										setDialog("connect");
									}}
									aria-label={`Connect ${connection.name}`}
								>
									Connect
								</Button>
							)}
						</div>
					))}
					<div className="product-settings-panel-actions">
						<SettingsNote title="Connect once, control access">
							Choose which projects can use each connection.
						</SettingsNote>
					</div>
				</Surface>
				<Surface className="product-settings-card product-settings-detail product-settings-plugin-detail">
					{current && (
						<>
							<div className="product-settings-panel-title">
								<Icon name={current.icon} size={20} />
								<h2>{current.name}</h2>
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
										<Button
											size="medium"
											onClick={() => {
												update({
													...current,
													access: access.filter((id) =>
														projects.some((project) => project.id === id),
													),
												});
												setNotice(`Saved project access for ${current.name}.`);
											}}
										>
											Save project access
										</Button>
										<Button
											size="medium"
											variant="ghost"
											icon={<Icon name="external-link" size={20} />}
											onClick={() => setDialog("manage")}
										>
											Manage connection
										</Button>
									</>
								)}
								{notice && (
									<p role="status" className="product-settings-muted">
										{notice}
									</p>
								)}
							</div>
						</>
					)}
				</Surface>
			</div>
			{dialog === "browse" && (
				<SettingsDialog
					title="Browse plugins"
					description="Choose a workspace connection to view its permissions."
					onClose={() => setDialog(null)}
				>
					{connections.map((connection) => (
						<RichMenuItem
							key={connection.id}
							label={connection.name}
							description={connection.connected ? "Connected" : "Not connected"}
							icon={connection.icon}
							onClick={() => {
								select(connection.id);
								setDialog(connection.connected ? null : "connect");
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
						<Button variant="secondary" onClick={() => setDialog(null)}>
							{dialog === "manage" ? "Done" : "Cancel"}
						</Button>
						{dialog === "manage" ? (
							<Button variant="ghost" onClick={() => setDialog("disconnect")}>
								Disconnect
							</Button>
						) : (
							<Button
								variant={dialog === "disconnect" ? "danger" : "default"}
								onClick={() => {
									const connected = dialog === "connect";
									update({ ...current, connected, access: [] });
									setNotice(
										`${current.name} ${connected ? "connected" : "disconnected"}.`,
									);
									setDialog(null);
									requestAnimationFrame(() =>
										connectionButtons.current[current.id]?.focus(),
									);
								}}
							>
								{dialog === "connect" ? "Connect" : "Disconnect"}
							</Button>
						)}
					</div>
				</SettingsDialog>
			)}
		</>
	);
}
