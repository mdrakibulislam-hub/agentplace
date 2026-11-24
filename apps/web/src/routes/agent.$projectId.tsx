import { buttonVariants } from "@agentplace/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { VisitorExperience } from "@/product/builder/visitor-experience";
import { usePrototype } from "@/product/prototype-state";
import "@/product/workspace.css";

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
			<main className="ap-workspace-unavailable" data-ap-enter="">
				<h1>Sign in to open this agent</h1>
				<p>
					{project.published?.name ?? project.name} requires a signed-in
					visitor.
				</p>
				<Link
					to="/login"
					search={{ agent: projectId }}
					className={buttonVariants()}
				>
					<span className="ap-button-contents">Sign in</span>
				</Link>
			</main>
		);
	}
	if (!project || (restriction?.audience === "workspace" && !activeProject)) {
		return (
			<main className="ap-workspace-unavailable" data-ap-enter="">
				<h1>This agent is unavailable</h1>
				<p>
					The project may have been unpublished or removed from this browser.
				</p>
				<Link to="/" className={buttonVariants({ variant: "secondary" })}>
					<span className="ap-button-contents">Go to Agentplace</span>
				</Link>
			</main>
		);
	}
	return (
		<VisitorExperience
			key={`${projectId}:${preview ? "draft" : "published"}`}
			project={project}
			published={!preview}
		/>
	);
}
