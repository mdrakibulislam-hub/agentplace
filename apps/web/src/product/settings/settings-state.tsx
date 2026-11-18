import type { IconName } from "@agentplace/ui/components/ap-icon";
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";

export type WorkspaceRole = "Owner" | "Admin" | "Member";
export type ProjectRole = "Editor" | "Viewer";
export type ConnectionId = "leads" | "calendar" | "knowledge";

export interface WorkspaceSkill {
	id: string;
	name: string;
	description: string;
	connection: ConnectionId | "none";
	guidance: string;
	projects: string[];
}

export interface WorkspaceConnection {
	id: ConnectionId;
	name: string;
	icon: IconName;
	destination: string;
	description: string;
	permissions: string;
	connected: boolean;
	access: string[];
}

export interface WorkspaceMember {
	id: string;
	name: string;
	email: string;
	initials: string;
	role: WorkspaceRole;
	access: Record<string, ProjectRole>;
	invited?: boolean;
}

export interface WorkspaceSettings {
	name: string;
	members: WorkspaceMember[];
	connections: WorkspaceConnection[];
	skills: WorkspaceSkill[];
}

const initialSettings: WorkspaceSettings = {
	name: "WhiteFrame",
	members: [
		{
			id: "owner",
			name: "Rakib",
			email: "rakib@whiteframe.agency",
			initials: "RA",
			role: "Owner",
			access: {},
		},
		{
			id: "admin",
			name: "Maya",
			email: "maya@whiteframe.agency",
			initials: "MA",
			role: "Admin",
			access: {},
		},
		{
			id: "member",
			name: "Sam",
			email: "sam@whiteframe.agency",
			initials: "SA",
			role: "Member",
			access: { "whiteframe-advisor": "Editor", "customer-support": "Viewer" },
		},
	],
	connections: [
		{
			id: "leads",
			name: "Lead storage",
			icon: "database",
			destination: "WhiteFrame enquiries",
			description:
				"Used by the “Collect project enquiries” skill. Save visitor-approved enquiries to this destination.",
			permissions:
				"Can create enquiry records. Public visitors cannot browse saved records.",
			connected: true,
			access: ["whiteframe-advisor"],
		},
		{
			id: "calendar",
			name: "Calendar",
			icon: "calendar",
			destination: "Workspace calendar",
			description: "Check availability and let visitors book an appointment.",
			permissions:
				"Can check availability and create appointments with visitor consent.",
			connected: false,
			access: [],
		},
		{
			id: "knowledge",
			name: "Company knowledge",
			icon: "globe",
			destination: "WhiteFrame website",
			description:
				"Use approved company information to answer visitor questions.",
			permissions:
				"Can read approved company content. Cannot edit the source material.",
			connected: true,
			access: ["whiteframe-advisor", "customer-support"],
		},
	],
	skills: [
		{
			id: "services",
			name: "Service recommendations",
			description: "Recommend an approved service based on a visitor’s needs.",
			connection: "knowledge",
			guidance:
				"Ask about the visitor’s goal. Explain the recommendation and offer a next step.",
			projects: ["whiteframe-advisor", "customer-support"],
		},
		{
			id: "enquiries",
			name: "Collect project enquiries",
			description: "Collect visitor-approved details for a project enquiry.",
			connection: "leads",
			guidance:
				"Ask about the project and how to contact the visitor. Confirm before saving their details.",
			projects: ["whiteframe-advisor"],
		},
		{
			id: "appointments",
			name: "Appointment booking",
			description: "Help a visitor find and book a suitable appointment.",
			connection: "calendar",
			guidance:
				"Confirm the visitor’s timezone and preferred time before booking an appointment.",
			projects: [],
		},
	],
};

type SettingsState = [
	WorkspaceSettings,
	Dispatch<SetStateAction<WorkspaceSettings>>,
];
const SettingsStateContext = createContext<SettingsState | null>(null);
const storageKey = "agentplace.prototype.settings.v1";

function readSettings(): Record<string, WorkspaceSettings> {
	try {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			const parsed: unknown = JSON.parse(saved);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
				return Object.fromEntries(
					Object.entries(parsed).filter(
						([, item]) =>
							item &&
							typeof item.name === "string" &&
							Array.isArray(item.members) &&
							Array.isArray(item.connections) &&
							Array.isArray(item.skills),
					),
				);
			}
		}
	} catch {
		// The prototype also works without browser storage.
	}
	return {};
}

export function SettingsStateProvider({
	children,
	workspaceId = null,
}: {
	children: ReactNode;
	workspaceId?: string | null;
}) {
	const [workspaces, setWorkspaces] = useState(readSettings);
	const key = workspaceId ?? "prototype";
	const settings = workspaces[key] ?? initialSettings;
	useEffect(() => {
		try {
			localStorage.setItem(storageKey, JSON.stringify(workspaces));
		} catch {
			// Keep the current workspace usable when storage is unavailable.
		}
	}, [workspaces]);
	function setSettings(action: SetStateAction<WorkspaceSettings>) {
		setWorkspaces((previous) => ({
			...previous,
			[key]:
				typeof action === "function"
					? action(previous[key] ?? initialSettings)
					: action,
		}));
	}
	return (
		<SettingsStateContext.Provider value={[settings, setSettings]}>
			{children}
		</SettingsStateContext.Provider>
	);
}

export function useSettingsState(): SettingsState {
	const workspace = useContext(SettingsStateContext);
	const local = useState(initialSettings);
	return workspace ?? local;
}
