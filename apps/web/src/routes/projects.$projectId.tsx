import { createFileRoute, Navigate } from "@tanstack/react-router";
import { BuilderExperience } from "@/product/builder/builder-experience";
import { ConnectedHeader } from "@/product/connected-header";
import {
	liveProjectPath,
	type ProjectEntry,
	withLiveLink,
} from "@/product/prototype-data";
import { usePrototype } from "@/product/prototype-state";
import { useWorkspaceNavigation } from "@/product/workspace-navigation";

export const Route = createFileRoute("/projects/$projectId")({
	validateSearch: (search): { entry?: ProjectEntry } => {
		const entry = search.entry;
		return {
			entry:
				entry === "branding" || entry === "publish" || entry === "unpublish"
					? entry
					: undefined,
		};
	},
	component: BuilderPage,
});

function BuilderPage() {
	const { projectId } = Route.useParams();
	const { entry } = Route.useSearch();
	const { workspace, updateProject } = usePrototype();
	const { openProjects, openSettings } = useWorkspaceNavigation();
	const project = workspace?.projects.find(
		(candidate) => candidate.id === projectId,
	);
	if (!workspace) return <Navigate to="/login" replace />;
	if (!project) return <Navigate to="/projects" replace />;
	return (
		<>
			<ConnectedHeader projectId={projectId} />
			<BuilderExperience
				key={projectId}
				project={withLiveLink(project)}
				initialSection={entry === "branding" ? "Branding" : undefined}
				initialPublishAction={
					entry === "publish" || entry === "unpublish" ? entry : undefined
				}
				onProjectChange={(updates) => updateProject(projectId, updates)}
				onBack={() => openProjects()}
				onSettings={openSettings}
				onOpenVisitor={(id, published) =>
					window.open(
						`${liveProjectPath(id)}${published ? "" : "?preview=true"}`,
						"_blank",
						"noopener,noreferrer",
					)
				}
			/>
		</>
	);
}
