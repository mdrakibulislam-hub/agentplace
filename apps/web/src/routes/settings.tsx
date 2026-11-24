import {
	type SettingsNavValue,
	settingsNavItems,
} from "@agentplace/ui/components/ap-navigation";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { ConnectedHeader } from "@/product/connected-header";
import { demoCredits, demoProjectUsage } from "@/product/prototype-data";
import { usePrototype } from "@/product/prototype-state";
import { SettingsExperience } from "@/product/settings/settings-experience";
import { useWorkspaceNavigation } from "@/product/workspace-navigation";

export const Route = createFileRoute("/settings")({
	validateSearch: (search): { section?: SettingsNavValue } => ({
		section: settingsNavItems.find((item) => item.label === search.section)
			?.label,
	}),
	component: SettingsPage,
});

function SettingsPage() {
	const { workspace, store } = usePrototype();
	const { section } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { openProjects } = useWorkspaceNavigation();
	if (!workspace) return <Navigate to="/login" replace />;
	return (
		<>
			<ConnectedHeader />
			<SettingsExperience
				projects={workspace.projects}
				credits={demoCredits}
				projectUsage={
					store.activeWorkspace === "demo" ? demoProjectUsage : undefined
				}
				initialSection={section}
				onSectionChange={(next) => void navigate({ search: { section: next } })}
				onBack={() => openProjects()}
			/>
		</>
	);
}
