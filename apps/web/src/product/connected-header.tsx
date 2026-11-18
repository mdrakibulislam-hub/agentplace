import { useNavigate } from "@tanstack/react-router";
import { withLiveLink } from "./prototype-data";
import { usePrototype } from "./prototype-state";
import { WorkspaceHeader } from "./workspace-header";
import { useWorkspaceNavigation } from "./workspace-navigation";

export function ConnectedHeader({
	home = false,
	projectId,
}: {
	home?: boolean;
	projectId?: string;
}) {
	const navigate = useNavigate();
	const { workspace, signOut } = usePrototype();
	const { openProject, openProjects, openSettings } = useWorkspaceNavigation();

	return (
		<WorkspaceHeader
			projects={workspace?.projects.map(withLiveLink) ?? []}
			currentProjectId={projectId ?? workspace?.selectedId}
			showProjectName={!home}
			type={home ? "secondary" : "default"}
			onProject={openProject}
			onProjects={() => openProjects()}
			onCreate={() => openProjects(true)}
			onSettings={() => openSettings()}
			onBilling={() => openSettings("Billing & usage")}
			onSignOut={() => {
				signOut();
				void navigate({ to: "/login" });
			}}
		/>
	);
}
