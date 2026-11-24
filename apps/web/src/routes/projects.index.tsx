import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ConnectedHeader } from "@/product/connected-header";
import { ProjectHome } from "@/product/home/project-home";
import { withLiveLink } from "@/product/prototype-data";
import { usePrototype } from "@/product/prototype-state";
import { useWorkspaceNavigation } from "@/product/workspace-navigation";

export const Route = createFileRoute("/projects/")({ component: ProjectsPage });

function ProjectsPage() {
	const state = usePrototype();
	const { openProject } = useWorkspaceNavigation();
	if (!state.workspace) return <Navigate to="/login" replace />;
	return (
		<>
			<ConnectedHeader home />
			<ProjectHome
				projects={state.workspace.projects.map(withLiveLink)}
				onOpen={openProject}
				onCreate={(prompt, sources, mode) => {
					const projectId = state.createProject(prompt, sources, mode);
					return openProject(projectId);
				}}
				onChangeCover={state.updateCover}
				onDelete={state.deleteProject}
				focusPromptRequest={state.focusPromptRequest}
			/>
		</>
	);
}
