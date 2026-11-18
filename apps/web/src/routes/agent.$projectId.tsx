import { Button } from "@agentplace/ui/components/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VisitorExperience } from "@/product/builder/visitor-experience";
import { usePrototype } from "@/product/prototype-state";

export const Route = createFileRoute("/agent/$projectId")({
	validateSearch: (search): { preview?: boolean } => ({
		preview: search.preview === true || undefined,
	}),
	component: AgentPage,
});

function AgentPage() {
	const { projectId } = Route.useParams();
	const { preview } = Route.useSearch();
	const { store, workspace } = usePrototype();
	const navigate = useNavigate();
	const activeProject = workspace?.projects.find(
		(project) => project.id === projectId,
	);
	const sharedProject = Object.values(store.workspaces)
		.flatMap((item) => item.projects)
		.find(
			(candidate) =>
				candidate.id === projectId && candidate.status === "Published",
		);
	const project = preview ? activeProject : sharedProject;
	const restriction = !preview ? project?.published : undefined;
	const requiresSignIn =
		!workspace &&
		(restriction?.requireSignIn || restriction?.audience === "workspace");
	if (project && requiresSignIn) {
		return (
			<main className="ap-workspace-unavailable">
				<h1>Sign in to open this agent</h1>
				<p>
					{project.published?.name ?? project.name} requires a signed-in
					visitor.
				</p>
				<Button
					onClick={() =>
						void navigate({ to: "/login", search: { agent: projectId } })
					}
				>
					Sign in
				</Button>
			</main>
		);
	}
	if (!project || (restriction?.audience === "workspace" && !activeProject)) {
		return (
			<main className="ap-workspace-unavailable">
				<h1>This agent is unavailable</h1>
				<p>
					The project may have been unpublished or removed from this browser.
				</p>
				<Button variant="secondary" onClick={() => void navigate({ to: "/" })}>
					Go to Agentplace
				</Button>
			</main>
		);
	}
	return (
		<VisitorExperience key={projectId} project={project} published={!preview} />
	);
}
