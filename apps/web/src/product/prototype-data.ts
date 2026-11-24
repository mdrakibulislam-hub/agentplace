import type { CreditValues } from "@agentplace/ui/components/ap-data";
import type { MenuProject } from "@agentplace/ui/components/ap-menus";
import type { ModelMode } from "@agentplace/ui/components/ap-model-picker";
import type { ProjectCoverBackground } from "@agentplace/ui/lib/project-cover-backgrounds";
import type { BuilderData, PublishedSnapshot } from "./builder/builder-model";

export interface ProjectSource {
	kind: "website" | "file";
	value: string;
}

export interface PrototypeProject extends MenuProject {
	company?: string;
	prompt?: string;
	cover?: string;
	coverBackground?: ProjectCoverBackground;
	sources?: ProjectSource[];
	modelMode?: ModelMode;
	needsFirstDraft?: boolean;
	builder?: BuilderData;
	published?: PublishedSnapshot;
}

export type ProjectEntry = "chat" | "branding" | "publish" | "unpublish";

export const demoCredits: CreditValues = { remaining: 1985, allocation: 2000 };

export const demoProjects: PrototypeProject[] = [
	{
		id: "whiteframe-advisor",
		name: "WhiteFrame Advisor",
		company: "Whiteframe Creative",
		prompt:
			"Create an advisor for whiteframe.agency that recommends services and collects project enquiries.",
		coverBackground: "blue-haze",
		status: "Published",
		updated: "Edited 2 hours ago",
		icon: "briefcase-business",
	},
	{
		id: "customer-support",
		name: "Customer Support",
		coverBackground: "blue-pink",
		status: "Unpublished",
		updated: "Edited yesterday",
		icon: "message-square",
	},
	{
		id: "booking-assistant",
		name: "Booking Assistant",
		coverBackground: "mint-peach",
		status: "Published",
		updated: "Edited 3 days ago",
		icon: "calendar",
	},
];

export const demoProjectUsage: Readonly<Record<string, number>> = {
	"whiteframe-advisor": 15,
	"customer-support": 0,
	"booking-assistant": 0,
};

export function liveProjectPath(id: string) {
	return `/agent/${encodeURIComponent(id)}`;
}

export function withLiveLink(project: PrototypeProject): PrototypeProject {
	return {
		...project,
		liveUrl:
			project.status === "Published"
				? new URL(liveProjectPath(project.id), window.location.origin).href
				: undefined,
	};
}
