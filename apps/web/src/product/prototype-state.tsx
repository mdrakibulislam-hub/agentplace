import type { ModelMode } from "@agentplace/ui/components/ap-model-picker";
import { projectCoverBackgroundIds } from "@agentplace/ui/lib/project-cover-backgrounds";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { initialBuilderData, recordVersion } from "./builder/builder-model";
import {
	demoProjects,
	type ProjectSource,
	type PrototypeProject,
} from "./prototype-data";
import { SettingsStateProvider } from "./settings/settings-state";

interface Workspace {
	projects: PrototypeProject[];
	selectedId?: string;
}

interface Store {
	activeWorkspace: string | null;
	workspaces: Record<string, Workspace>;
}

interface PrototypeState {
	store: Store;
	workspace?: Workspace;
	focusPromptRequest: number;
	focusPrompt: () => void;
	signIn: (account: { email?: string; isNewAccount: boolean }) => void;
	signOut: () => void;
	createProject: (
		prompt: string,
		sources: ProjectSource[],
		mode: ModelMode,
	) => string;
	selectProject: (id: string) => void;
	updateProject: (id: string, updates: Partial<PrototypeProject>) => void;
	saveProject: (id: string, updates: Partial<PrototypeProject>) => void;
	updateCover: (id: string, cover: string) => void;
	deleteProject: (id: string) => void;
}

const storageKey = "agentplace.prototype.workspace.v1";
const Context = createContext<PrototypeState | null>(null);

function seedDemoProjects() {
	return demoProjects.map((project) => {
		if (project.status !== "Published") return project;
		const data = initialBuilderData(project);
		return {
			...project,
			published: { ...data.branding, versionId: data.versions[0]?.id },
		};
	});
}

function assignSavedCoverBackgrounds(
	projects: PrototypeProject[],
	isDemo: boolean,
) {
	const demoSamples = isDemo ? demoProjects : [];
	const fillingDemoRow = demoSamples.some((_, index) => {
		const project = projects[index];
		return project && !project.coverBackground && !project.cover;
	});

	return projects.map((project, index) => {
		const demoBackground = demoSamples[index]?.coverBackground;
		// While filling an old demo row, let seeded cards complete the palette.
		const placeSample =
			fillingDemoRow &&
			demoBackground &&
			demoSamples.some(({ id }) => id === project.id);
		if (project.coverBackground && !placeSample) return project;

		return {
			...project,
			coverBackground:
				demoBackground ??
				projectCoverBackgroundIds[index % projectCoverBackgroundIds.length],
		};
	});
}

function withCover(project: PrototypeProject, cover: string): PrototypeProject {
	const data = initialBuilderData(project);
	const published =
		project.published ??
		(project.status === "Published"
			? { ...data.branding, versionId: data.versions[0]?.id }
			: undefined);
	const next = {
		...data,
		branding: { ...data.branding, cover },
		stagedBranding: data.stagedBranding
			? { ...data.stagedBranding, cover }
			: undefined,
	};
	return {
		...project,
		cover,
		builder: project.needsFirstDraft
			? next
			: recordVersion(next, "Updated project cover"),
		published,
		updated: "Edited just now",
	};
}

function readStore(): Store {
	try {
		const saved = localStorage.getItem(storageKey);
		if (saved) {
			const parsed = JSON.parse(saved) as Store;
			if (
				parsed.workspaces &&
				(parsed.activeWorkspace === null ||
					typeof parsed.activeWorkspace === "string")
			) {
				for (const [key, workspace] of Object.entries(parsed.workspaces)) {
					if (Array.isArray(workspace?.projects)) {
						workspace.projects = assignSavedCoverBackgrounds(
							workspace.projects,
							key === "demo",
						);
					}
				}
				return parsed;
			}
		}
	} catch {
		// The prototype can operate in memory when browser storage is unavailable.
	}
	return { activeWorkspace: null, workspaces: {} };
}

export function PrototypeProvider({ children }: { children: ReactNode }) {
	const [store, setStore] = useState(readStore);
	const latestStore = useRef(store);
	const [focusPromptRequest, setFocusPromptRequest] = useState(0);
	const workspace = store.activeWorkspace
		? store.workspaces[store.activeWorkspace]
		: undefined;

	useEffect(() => {
		if (store !== latestStore.current) return;
		try {
			localStorage.setItem(storageKey, JSON.stringify(store));
		} catch {
			// Keep the current workspace usable when the browser storage quota is reached.
		}
	}, [store]);

	function replaceStore(next: Store) {
		latestStore.current = next;
		setStore(next);
	}

	function changeWorkspace(
		change: (workspace: Workspace) => Workspace,
		persist = false,
	) {
		const current = latestStore.current;
		const key = current.activeWorkspace;
		if (!key || !current.workspaces[key]) {
			if (persist) throw new Error("Your workspace is no longer available.");
			return;
		}
		const next = {
			...current,
			workspaces: {
				...current.workspaces,
				[key]: change(current.workspaces[key]),
			},
		};
		if (persist) saveStore(next);
		else replaceStore(next);
	}

	function saveProject(id: string, updates: Partial<PrototypeProject>) {
		const current = latestStore.current;
		const key = current.activeWorkspace;
		const active = key ? current.workspaces[key] : undefined;
		if (!key || !active?.projects.some((project) => project.id === id)) {
			throw new Error("This project is no longer available in your workspace.");
		}
		const next = {
			...current,
			workspaces: {
				...current.workspaces,
				[key]: {
					...active,
					projects: active.projects.map((project) =>
						project.id === id ? { ...project, ...updates } : project,
					),
				},
			},
		};
		saveStore(next);
	}

	function saveStore(next: Store) {
		try {
			localStorage.setItem(storageKey, JSON.stringify(next));
		} catch (error) {
			throw new Error(
				error instanceof DOMException && error.name === "QuotaExceededError"
					? "Browser storage is full. Free up space or choose smaller images, then try again."
					: "Couldn’t save to browser storage. Allow local storage and try again.",
			);
		}
		replaceStore(next);
	}

	return (
		<Context.Provider
			value={{
				store,
				workspace,
				focusPromptRequest,
				focusPrompt: () => setFocusPromptRequest((current) => current + 1),
				signIn: ({ email, isNewAccount }) => {
					const accountKey = email
						? `email:${email.trim().toLowerCase()}`
						: "demo";
					const current = latestStore.current;
					const key =
						isNewAccount || current.workspaces[accountKey]
							? accountKey
							: "demo";
					replaceStore({
						activeWorkspace: key,
						workspaces: {
							...current.workspaces,
							[key]: current.workspaces[key] ?? {
								projects: isNewAccount ? [] : seedDemoProjects(),
								selectedId: isNewAccount ? undefined : demoProjects[0]?.id,
							},
						},
					});
				},
				signOut: () =>
					replaceStore({ ...latestStore.current, activeWorkspace: null }),
				createProject: (prompt, sources, modelMode) => {
					const id = crypto.randomUUID();
					const words = prompt
						.trim()
						.replace(/^(build|create|design|make)\s+(an?\s+)?/i, "")
						.split(/\s+/)
						.slice(0, 5)
						.join(" ");
					const name = words.length > 42 ? `${words.slice(0, 39)}…` : words;
					const project: PrototypeProject = {
						id,
						name: name
							? name.charAt(0).toUpperCase() + name.slice(1)
							: "New project",
						prompt,
						sources,
						modelMode,
						coverBackground:
							projectCoverBackgroundIds[
								Math.floor(Math.random() * projectCoverBackgroundIds.length)
							],
						needsFirstDraft: true,
						status: "Unpublished",
						updated: "Edited just now",
						icon: "briefcase-business",
					};
					changeWorkspace(
						(current) => ({
							projects: [project, ...current.projects],
							selectedId: id,
						}),
						true,
					);
					return id;
				},
				selectProject: (id) =>
					changeWorkspace((current) => ({ ...current, selectedId: id })),
				updateProject: (id, updates) =>
					changeWorkspace((current) => ({
						...current,
						projects: current.projects.map((project) =>
							project.id === id ? { ...project, ...updates } : project,
						),
					})),
				saveProject,
				updateCover: (id, cover) =>
					changeWorkspace((current) => {
						if (!current.projects.some((project) => project.id === id)) {
							throw new Error(
								"This project is no longer available in your workspace.",
							);
						}
						return {
							...current,
							projects: current.projects.map((project) =>
								project.id === id ? withCover(project, cover) : project,
							),
						};
					}, true),
				deleteProject: (id) =>
					changeWorkspace((current) => {
						const projects = current.projects.filter(
							(project) => project.id !== id,
						);
						return {
							projects,
							selectedId:
								current.selectedId === id
									? projects[0]?.id
									: current.selectedId,
						};
					}, true),
			}}
		>
			<SettingsStateProvider workspaceId={store.activeWorkspace}>
				{children}
			</SettingsStateProvider>
		</Context.Provider>
	);
}

export function usePrototype() {
	const state = useContext(Context);
	if (!state) throw new Error("Prototype pages require a workspace provider");
	return state;
}
