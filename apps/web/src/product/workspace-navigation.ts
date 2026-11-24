import type { SettingsNavValue } from "@agentplace/ui/components/ap-navigation";
import { useNavigate } from "@tanstack/react-router";
import type { ProjectEntry } from "./prototype-data";
import { usePrototype } from "./prototype-state";

export function useWorkspaceNavigation() {
	const navigate = useNavigate();
	const state = usePrototype();

	function openProject(projectId: string, entry?: ProjectEntry) {
		state.selectProject(projectId);
		return navigate({
			to: "/projects/$projectId",
			params: { projectId },
			search: { entry },
		});
	}

	function openProjects(focusPrompt = false) {
		if (focusPrompt) state.focusPrompt();
		void navigate({ to: "/projects" });
	}

	function openSettings(section: SettingsNavValue = "Billing & usage") {
		void navigate({ to: "/settings", search: { section } });
	}

	return { openProject, openProjects, openSettings };
}
