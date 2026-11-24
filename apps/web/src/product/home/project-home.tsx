import { AmbientBottomGradient } from "@agentplace/ui/components/ap-ambient";
import {
	NewProjectPrompt,
	ProjectCard,
} from "@agentplace/ui/components/ap-builder";
import { ConfirmDialog } from "@agentplace/ui/components/ap-dialog";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	MenuPopover,
	type ProjectAction,
	ProjectFilter,
	type ProjectFilterValue,
	ProjectSearchResults,
} from "@agentplace/ui/components/ap-menus";
import {
	defaultModelMode,
	type ModelMode,
} from "@agentplace/ui/components/ap-model-picker";
import { useScrollEntrance } from "@agentplace/ui/components/ap-motion";
import { SourceAttachmentDialog } from "@agentplace/ui/components/ap-source-dialog";
import { Button } from "@agentplace/ui/components/button";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
	ProjectEntry,
	ProjectSource,
	PrototypeProject,
} from "../prototype-data";
import "./project-home.css";

const suggestions = [
	{
		label: "Customer support",
		icon: "message-circle-question-mark",
		prompt:
			"Build a customer support agent that answers common questions and helps customers find the next step.",
	},
	{
		label: "Recommend services",
		icon: "briefcase-business",
		prompt:
			"Build an agent that recommends the right services based on a visitor’s needs, timeline, and budget.",
	},
	{
		label: "Book appointments",
		icon: "calendar",
		prompt:
			"Build an appointment assistant that helps visitors find a time and request a booking.",
	},
	{
		label: "Start from my website",
		icon: "globe",
		prompt:
			"Build an agent based on my website that explains what we do and answers visitors’ questions.",
	},
];

const filterLabels: Record<ProjectFilterValue, string> = {
	all: "All projects",
	published: "Published",
	unpublished: "Unpublished",
};

export interface ProjectHomeProps {
	projects: PrototypeProject[];
	onOpen: (id: string, entry?: ProjectEntry) => void;
	onCreate: (
		prompt: string,
		sources: ProjectSource[],
		mode: ModelMode,
	) => void | Promise<void>;
	onChangeCover: (id: string, cover: string) => void | Promise<void>;
	onDelete: (id: string) => void | Promise<void>;
	focusPromptRequest?: number;
	initialFilter?: ProjectFilterValue;
	initialQuery?: string;
	initialPanel?: "filter" | "search";
	initialActionsId?: string;
	initialDeleteId?: string;
	initialCopied?: boolean;
}

export function ProjectHome({
	projects,
	onOpen,
	onCreate,
	onChangeCover,
	onDelete,
	focusPromptRequest = 0,
	initialFilter = "all",
	initialQuery = "",
	initialPanel,
	initialActionsId,
	initialDeleteId,
	initialCopied = false,
}: ProjectHomeProps) {
	const [prompt, setPrompt] = useState("");
	const [sources, setSources] = useState<ProjectSource[]>([]);
	const [modelMode, setModelMode] = useState<ModelMode>(defaultModelMode);
	const [attachmentOpen, setAttachmentOpen] = useState(false);
	const [filter, setFilter] = useState(initialFilter);
	const [query, setQuery] = useState(initialQuery);
	const [searchOpen, setSearchOpen] = useState(initialPanel === "search");
	const [deleteProject, setDeleteProject] = useState(() =>
		projects.find((project) => project.id === initialDeleteId),
	);
	const [deleteOpen, setDeleteOpen] = useState(Boolean(deleteProject));
	const [notice, setNotice] = useState<{ message: string } | null>(
		initialCopied ? { message: "Live link copied" } : null,
	);
	const [manualLink, setManualLink] = useState("");
	const [coverErrors, setCoverErrors] = useState<Record<string, string>>({});
	const [readingCovers, setReadingCovers] = useState<string[]>([]);
	const [sourceAnnouncement, setSourceAnnouncement] = useState("");
	const [creating, setCreating] = useState(false);
	const promptArea = useRef<HTMLElement>(null);
	const projectArea = useRef<HTMLElement>(null);
	const searchTrigger = useRef<HTMLButtonElement>(null);
	const filterTrigger = useRef<HTMLButtonElement>(null);
	const deleteReturnFocus = useRef<HTMLElement>(null);
	const linkReturnFocus = useRef<HTMLElement | null>(null);
	const sourceList = useRef<HTMLUListElement>(null);
	const moveCaretToEnd = useRef(false);
	const coverTarget = useRef("");
	const coverFile = useRef<HTMLInputElement>(null);
	const coverReaders = useRef(new Map<string, FileReader>());
	const attachmentTrigger = useRef<HTMLElement>(null);
	useScrollEntrance(projectArea);
	useEffect(() => {
		const readers = coverReaders.current;
		return () => {
			for (const [id, reader] of readers) {
				readers.delete(id);
				reader.abort();
			}
		};
	}, []);
	const queryText = query.trim();
	const empty = projects.length === 0;
	const candidates = projects.filter(
		(project) => filter === "all" || project.status.toLowerCase() === filter,
	);
	const filtered = candidates.filter((project) =>
		project.name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()),
	);

	useEffect(() => {
		if (!focusPromptRequest) return;
		promptArea.current?.querySelector("textarea")?.focus();
	}, [focusPromptRequest]);

	useEffect(() => {
		if (!notice || initialCopied) return;
		const timer = window.setTimeout(() => setNotice(null), 3500);
		return () => window.clearTimeout(timer);
	}, [notice, initialCopied]);

	useLayoutEffect(() => {
		if (!moveCaretToEnd.current) return;
		moveCaretToEnd.current = false;
		const textarea = promptArea.current?.querySelector("textarea");
		textarea?.setSelectionRange(prompt.length, prompt.length);
	}, [prompt]);

	function useSuggestion(starter: string) {
		const hasCustomPrompt =
			prompt.trim() && !suggestions.some((item) => item.prompt === prompt);
		const next = !hasCustomPrompt
			? starter
			: prompt.split("\n\n").includes(starter)
				? prompt
				: `${prompt.trimEnd()}\n\n${starter}`;
		const textarea = promptArea.current?.querySelector("textarea");
		textarea?.focus();
		textarea?.setSelectionRange(prompt.length, prompt.length);
		moveCaretToEnd.current = next !== prompt;
		setPrompt(next);
	}

	function addSource(source: ProjectSource) {
		if (
			sources.some(
				(item) => item.kind === source.kind && item.value === source.value,
			)
		) {
			throw new Error("This source is already attached.");
		}
		setSources((previous) => [...previous, source]);
		setSourceAnnouncement(
			source.kind === "website"
				? "Website attached."
				: `${source.value} attached.`,
		);
	}

	function removeSource(source: ProjectSource, index: number) {
		const buttons = sourceList.current?.querySelectorAll("button");
		(
			buttons?.[index + 1] ??
			buttons?.[index - 1] ??
			attachmentTrigger.current
		)?.focus();
		setSources((previous) => previous.filter((item) => item !== source));
		setSourceAnnouncement(
			source.kind === "website"
				? "Website removed."
				: `${source.value} removed.`,
		);
	}

	function projectActionButton(id: string) {
		return (
			projectArea.current?.querySelectorAll<HTMLElement>(
				".ap-project-overflow",
			)[filtered.findIndex((project) => project.id === id)] ?? null
		);
	}

	function clearQuery() {
		setQuery("");
		searchTrigger.current?.focus();
	}

	async function removeProject() {
		if (!deleteProject) return;
		const index = filtered.findIndex(
			(project) => project.id === deleteProject.id,
		);
		const nextProject = filtered[index + 1] ?? filtered[index - 1];
		const nextButton = nextProject ? projectActionButton(nextProject.id) : null;
		await onDelete(deleteProject.id);
		deleteReturnFocus.current = nextButton?.isConnected
			? nextButton
			: projects.length > 1
				? queryText
					? searchTrigger.current
					: filterTrigger.current
				: projectArea.current;
		setNotice({ message: "Project deleted" });
	}

	function clearCoverError(id: string) {
		setCoverErrors((previous) => {
			const next = { ...previous };
			delete next[id];
			return next;
		});
	}

	function chooseCover(id: string, file: File) {
		function showError(message: string) {
			setCoverErrors((previous) => ({ ...previous, [id]: message }));
		}
		if (coverReaders.current.has(id)) return;
		if (
			!["image/gif", "image/jpeg", "image/png", "image/webp"].includes(
				file.type,
			) ||
			file.size > 1024 * 1024
		) {
			showError("Choose a GIF, JPEG, PNG or WebP image up to 1 MB.");
			return;
		}
		clearCoverError(id);
		const reader = new FileReader();
		const current = () => coverReaders.current.get(id) === reader;
		const finish = () => {
			if (!current()) return;
			coverReaders.current.delete(id);
			setReadingCovers((previous) =>
				previous.filter((candidate) => candidate !== id),
			);
		};
		coverReaders.current.set(id, reader);
		setReadingCovers((previous) => [...previous, id]);
		reader.onload = async () => {
			const cover = reader.result;
			try {
				if (typeof cover !== "string") throw new Error();
				const image = new Image();
				image.src = cover;
				await image.decode();
			} catch {
				if (current()) showError("Couldn’t open this image. Try another file.");
				finish();
				return;
			}
			if (!current() || typeof cover !== "string") return;
			try {
				await onChangeCover(id, cover);
				if (current()) setNotice({ message: "Project cover updated" });
			} catch (error) {
				if (current())
					showError(
						error instanceof Error
							? error.message
							: "Couldn’t update the cover. Try again.",
					);
			} finally {
				finish();
			}
		};
		reader.onerror = () => {
			if (current()) showError("Couldn’t read this image. Try another file.");
			finish();
		};
		reader.readAsDataURL(file);
	}

	async function handleAction(action: ProjectAction, id: string) {
		switch (action) {
			case "open":
				onOpen(id);
				break;
			case "branding":
			case "publish":
			case "unpublish":
				onOpen(id, action);
				break;
			case "delete": {
				const project = projects.find((candidate) => candidate.id === id);
				if (!project) break;
				deleteReturnFocus.current =
					projectActionButton(id) ?? projectArea.current;
				setDeleteProject(project);
				setDeleteOpen(true);
				break;
			}
			case "copy": {
				const url = projects.find((project) => project.id === id)?.liveUrl;
				if (!url) break;
				try {
					await navigator.clipboard.writeText(url);
					setManualLink("");
					setNotice({ message: "Live link copied" });
				} catch {
					linkReturnFocus.current = projectActionButton(id);
					setNotice(null);
					setManualLink(url);
				}
				break;
			}
		}
	}

	return (
		<main className="ap-project-home">
			<AmbientBottomGradient variant="page" className="ap-home-ambient" />
			<div className="ap-home-content">
				<section
					ref={promptArea}
					className="ap-home-start"
					data-ap-enter=""
					aria-labelledby="ap-home-title"
				>
					<div className="ap-home-intro">
						<h1 id="ap-home-title">
							{empty ? "Create your first project" : "Start a new project"}
						</h1>
						<p>
							Describe the agent you want. We’ll help you build it together.
						</p>
					</div>
					<div className="ap-home-prompt">
						<NewProjectPrompt
							value={prompt}
							onValueChange={setPrompt}
							modelMode={modelMode}
							onModelModeChange={setModelMode}
							onSubmit={async (value) => {
								setCreating(true);
								try {
									await onCreate(value, sources, modelMode);
								} finally {
									setCreating(false);
								}
							}}
							onAttach={(trigger) => {
								attachmentTrigger.current = trigger;
								setAttachmentOpen(true);
							}}
						/>
						<p className="sr-only" role="status">
							{sourceAnnouncement}
						</p>
						{sources.length > 0 && (
							<ul
								ref={sourceList}
								className="ap-home-sources"
								aria-label="Attached context"
							>
								{sources.map((source, index) => (
									<li key={source.kind + source.value} data-ap-enter="message">
										<Button
											variant="secondary"
											icon={<Icon name="close" />}
											aria-label={`Remove ${source.value}`}
											disabled={creating}
											onClick={() => removeSource(source, index)}
										>
											<span
												className="ap-home-source-label"
												title={source.value}
											>
												{source.value}
											</span>
										</Button>
									</li>
								))}
							</ul>
						)}
					</div>
					<fieldset
						className="ap-home-suggestions"
						aria-label="Start with an idea"
					>
						{suggestions.map((suggestion) => (
							<Button
								key={suggestion.label}
								variant="secondary"
								icon={<Icon name={suggestion.icon} />}
								disabled={creating}
								onClick={() => useSuggestion(suggestion.prompt)}
							>
								{suggestion.label}
							</Button>
						))}
					</fieldset>
				</section>
				<section
					ref={projectArea}
					className="ap-home-projects"
					aria-label="Projects"
					tabIndex={-1}
				>
					{empty ? (
						<div className="ap-home-empty">
							<Icon name="briefcase-business" size={20} />
							<h2>Your projects will appear here</h2>
							<p>
								Describe your first agent above, or choose a suggestion to get
								started.
							</p>
						</div>
					) : (
						<>
							<div className="ap-home-project-bar">
								<h2>{queryText ? "Search results" : "Recent projects"}</h2>
								<MenuPopover
									defaultOpen={initialPanel === "filter"}
									align="end"
									trigger={
										<Button
											ref={filterTrigger}
											variant="ghost"
											icon={<Icon name="chevron-down" />}
											data-filter-active={filter !== "all" || undefined}
										>
											{filterLabels[filter]}
										</Button>
									}
								>
									{(close) => (
										<ProjectFilter
											projects={projects}
											value={filter}
											onChange={(value) => {
												setFilter(value);
												close();
											}}
											onClose={close}
										/>
									)}
								</MenuPopover>
								<MenuPopover
									open={searchOpen}
									onOpenChange={setSearchOpen}
									align="end"
									trigger={
										<Button
											ref={searchTrigger}
											variant="ghost"
											aria-label="Find a project"
											icon={<Icon name="search" />}
											data-filter-active={Boolean(queryText) || undefined}
										/>
									}
								>
									{(close) => (
										<ProjectSearchResults
											projects={candidates}
											query={query}
											onQueryChange={setQuery}
											onSelect={(id) => {
												close();
												onOpen(id);
											}}
											onClose={close}
										/>
									)}
								</MenuPopover>
							</div>
							{queryText && !searchOpen && (
								<div className="ap-home-query" data-ap-enter="message">
									<Button
										variant="secondary"
										icon={<Icon name="close" />}
										aria-label={`Clear search for ${queryText}`}
										onClick={clearQuery}
									>
										<span className="ap-home-source-label" title={queryText}>
											{queryText}
										</span>
									</Button>
								</div>
							)}
							<p className="sr-only" role="status">
								{!searchOpen && (queryText || filter !== "all")
									? `${filtered.length} ${filtered.length === 1 ? "project" : "projects"} shown`
									: ""}
							</p>
							<div className="ap-home-grid">
								{filtered.map((project) => (
									<div className="ap-home-project-slot" key={project.id}>
										<ProjectCard
											project={project}
											cover={{
												background: project.coverBackground,
												image: project.cover,
												preparing: readingCovers.includes(project.id),
											}}
											defaultActionsOpen={initialActionsId === project.id}
											onOpen={onOpen}
											onCoverEdit={(id) => {
												coverTarget.current = id;
												coverFile.current?.click();
											}}
											onAction={(action, id) => void handleAction(action, id)}
										/>
										{coverErrors[project.id] && (
											<p
												className="ap-home-error"
												role="alert"
												data-ap-enter="message"
											>
												{coverErrors[project.id]}
											</p>
										)}
									</div>
								))}
							</div>
							{!searchOpen && filtered.length === 0 && (
								<div className="ap-home-no-matches" data-ap-enter="message">
									<p>
										{queryText
											? "No matching projects"
											: `No ${filter} projects`}
									</p>
									<Button
										variant="ghost"
										onClick={() => {
											if (queryText) clearQuery();
											else {
												setFilter("all");
												filterTrigger.current?.focus();
											}
										}}
									>
										{queryText ? "Clear search" : "Show all projects"}
									</Button>
								</div>
							)}
						</>
					)}
				</section>
			</div>
			<footer className="ap-home-footer">
				Projects save automatically. Publish when you’re ready to share.
			</footer>
			{notice && (
				<div className="ap-home-notice" role="status" data-ap-enter="message">
					<Icon name="check" />
					{notice.message}
				</div>
			)}
			{manualLink && (
				<div className="ap-home-manual-link" data-ap-enter="message">
					<p className="sr-only" role="status">
						Clipboard unavailable. The live link is available to copy manually.
					</p>
					<label htmlFor="ap-home-manual-link">Copy this live link</label>
					<input
						id="ap-home-manual-link"
						readOnly
						value={manualLink}
						onFocus={(event) => event.currentTarget.select()}
					/>
					<Button
						variant="ghost"
						aria-label="Dismiss live link"
						icon={<Icon name="close" />}
						onClick={() => {
							setManualLink("");
							(linkReturnFocus.current?.isConnected
								? linkReturnFocus.current
								: projectArea.current
							)?.focus();
						}}
					/>
				</div>
			)}
			<ConfirmDialog
				open={deleteOpen}
				className="ap-home-delete"
				backdropClassName="ap-home-delete-backdrop"
				title={
					deleteProject ? `Delete ${deleteProject.name}?` : "Delete project?"
				}
				returnFocus={deleteReturnFocus}
				onOpenChange={setDeleteOpen}
				onConfirm={removeProject}
			/>
			<input
				ref={coverFile}
				hidden
				type="file"
				accept="image/gif,image/jpeg,image/png,image/webp"
				onChange={(event) => {
					const file = event.currentTarget.files?.[0];
					const id = coverTarget.current;
					event.currentTarget.value = "";
					if (file && id) chooseCover(id, file);
				}}
			/>
			<SourceAttachmentDialog
				open={attachmentOpen}
				onOpenChange={setAttachmentOpen}
				returnFocus={attachmentTrigger}
				onAddWebsite={(url) => addSource({ kind: "website", value: url })}
				onAddFile={(file) => addSource({ kind: "file", value: file.name })}
			/>
		</main>
	);
}
