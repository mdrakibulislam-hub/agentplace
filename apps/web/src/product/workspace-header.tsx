import { Logo } from "@agentplace/ui/components/ap-brand";
import { Avatar } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	MenuPanel,
	MenuPopover,
	type MenuProject,
	ProjectSwitcher,
	RichMenuItem,
} from "@agentplace/ui/components/ap-menus";
import { GlobalHeader } from "@agentplace/ui/components/ap-navigation";
import { demoCredits } from "./prototype-data";
import "./workspace.css";

export interface WorkspaceHeaderProps {
	projects: MenuProject[];
	currentProjectId?: string;
	showProjectName?: boolean;
	type?: "default" | "secondary";
	initialSwitcherOpen?: boolean;
	onProject: (id: string) => void;
	onProjects: () => void;
	onCreate: () => void;
	onSettings: () => void;
	onBilling: () => void;
	onSignOut: () => void;
}

export function WorkspaceHeader({
	projects,
	currentProjectId,
	showProjectName,
	type,
	initialSwitcherOpen,
	onProject,
	onProjects,
	onCreate,
	onSettings,
	onBilling,
	onSignOut,
}: WorkspaceHeaderProps) {
	const name = showProjectName
		? (projects.find((project) => project.id === currentProjectId)?.name ??
			"All projects")
		: "All projects";
	return (
		<GlobalHeader
			className="ap-workspace-header"
			type={type}
			project={name}
			remainingCredits={demoCredits.remaining}
			allocatedCredits={demoCredits.allocation}
			initials="RA"
			onCredits={onBilling}
			onSettings={onSettings}
			logo={
				<button
					type="button"
					className="ap-workspace-logo"
					aria-label="Agentplace project home"
					onClick={onProjects}
				>
					<Logo />
				</button>
			}
			projectSwitcher={
				<MenuPopover
					defaultOpen={initialSwitcherOpen}
					alignOffset={28}
					sideOffset={20}
					trigger={
						<button type="button" className="ap-project-switch-trigger">
							<span>{name}</span>
							<Icon name="chevrons-up-down" />
						</button>
					}
				>
					{(close) => (
						<ProjectSwitcher
							projects={projects}
							currentProjectId={currentProjectId}
							onSelect={(id) => {
								close();
								onProject(id);
							}}
							onClose={close}
							onCreate={() => {
								close();
								onCreate();
							}}
							onViewAll={() => {
								close();
								onProjects();
							}}
						/>
					)}
				</MenuPopover>
			}
			accountMenu={
				<MenuPopover
					align="end"
					trigger={
						<button
							type="button"
							aria-label="Open account menu"
							className="ap-header-account"
						>
							<Avatar initials="RA" size="medium" />
						</button>
					}
				>
					{(close) => (
						<MenuPanel title="Account" onClose={close}>
							<RichMenuItem
								data-menu-choice
								label="Workspace settings"
								icon="settings"
								onClick={() => {
									close();
									onSettings();
								}}
							/>
							<RichMenuItem
								data-menu-choice
								label="Sign out"
								icon="arrow-right"
								onClick={() => {
									close();
									onSignOut();
								}}
							/>
						</MenuPanel>
					)}
				</MenuPopover>
			}
		/>
	);
}
