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
import { SourceAttachmentDialog } from "@agentplace/ui/components/ap-source-dialog";
import { Button } from "@agentplace/ui/components/button";
import { useEffect, useRef, useState } from "react";
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
	onCreate: (prompt: string, sources: ProjectSource[]) => void;
	onChangeCover: (id: string, cover: string) => void;
	onDelete: (id: string) => void;
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
	const [attachmentOpen, setAttachmentOpen] = useState(false);
	const [filter, setFilter] = useState(initialFilter);
	const [query, setQuery] = useState(initialQuery);
	const [searchOpen, setSearchOpen] = useState(initialPanel === "search");
	const [deleteId, setDeleteId] = useState(initialDeleteId);
	const [notice, setNotice] = useState(initialCopied ? "Live link copied" : "");
	const [manualLink, setManualLink] = useState("");
	const [coverError, setCoverError] = useState("");
	const promptArea = useRef<HTMLElement>(null);
	const projectArea = useRef<HTMLElement>(null);
	const deleteReturnFocus = useRef<HTMLElement>(null);
	const deleted = useRef(false);
	const coverTarget = useRef("");
	const coverFile = useRef<HTMLInputElement>(null);
	const attachmentReturnFocus = useRef<HTMLElement>(null);
	const queryText = query.trim();
	const empty = projects.length === 0;
	const candidates = projects.filter(
		(project) => filter === "all" || project.status.toLowerCase() === filter,
	);
	const filtered = candidates.filter((project) =>
		project.name.toLocaleLowerCase().includes(queryText.toLocaleLowerCase()),
	);
	const deleteProject = projects.find((project) => project.id === deleteId);

	useEffect(() => {
		if (!focusPromptRequest) return;
		promptArea.current?.querySelector("textarea")?.focus();
	}, [focusPromptRequest]);

	useEffect(() => {
		if (!notice || initialCopied) return;
		const timer = window.setTimeout(() => setNotice(""), 3500);
		return () => window.clearTimeout(timer);
	}, [notice, initialCopied]);

	function addSource(source: ProjectSource) {
		setSources((previous) =>
			previous.some(
				(item) => item.kind === source.kind && item.value === source.value,
			)
				? previous
				: [...previous, source],
		);
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
			case "delete":
				deleteReturnFocus.current =
					[
						...(projectArea.current?.querySelectorAll<HTMLElement>(
							".ap-project-overflow",
						) ?? []),
					][filtered.findIndex((project) => project.id === id)] ??
					projectArea.current;
				deleted.current = false;
				setDeleteId(id);
				break;
			case "copy": {
				const url = projects.find((project) => project.id === id)?.liveUrl;
				if (!url) break;
				try {
					await navigator.clipboard.writeText(url);
					setManualLink("");
					setNotice("Live link copied");
				} catch {
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
							onSubmit={(value) => onCreate(value, sources)}
							onAttach={() => {
								attachmentReturnFocus.current =
									document.activeElement instanceof HTMLElement
										? document.activeElement
										: null;
								setAttachmentOpen(true);
							}}
						/>
						{sources.length > 0 && (
							<ul className="ap-home-sources" aria-label="Attached context">
								{sources.map((source) => (
									<li key={source.kind + source.value}>
										<Button
											variant="secondary"
											icon={<Icon name="close" />}
											aria-label={`Remove ${source.value}`}
											onClick={() =>
												setSources(
													sources.filter((candidate) => candidate !== source),
												)
											}
										>
											{source.value}
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
								onClick={() => {
									setPrompt(suggestion.prompt);
									promptArea.current?.querySelector("textarea")?.focus();
								}}
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
										<Button variant="ghost" icon={<Icon name="chevron-down" />}>
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
											variant="ghost"
											aria-label="Find a project"
											icon={<Icon name="search" />}
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
							<div className="ap-home-grid">
								{filtered.map((project) => (
									<ProjectCard
										key={project.id}
										project={project}
										cover={{
											background: project.coverBackground,
											image: project.cover,
										}}
										defaultActionsOpen={initialActionsId === project.id}
										onOpen={onOpen}
										onCoverEdit={(id) => {
											coverTarget.current = id;
											coverFile.current?.click();
										}}
										onAction={(action, id) => void handleAction(action, id)}
									/>
								))}
							</div>
							{!searchOpen && filtered.length === 0 && (
								<div className="ap-home-no-matches">
									<p>
										{queryText
											? "No matching projects"
											: `No ${filter} projects`}
									</p>
									<Button
										variant="ghost"
										onClick={() => {
											setQuery("");
											if (!queryText) setFilter("all");
										}}
									>
										{queryText ? "Clear search" : "Show all projects"}
									</Button>
								</div>
							)}
						</>
					)}
					{coverError && (
						<p className="ap-home-error" role="alert">
							{coverError}
						</p>
					)}
				</section>
			</div>
			<footer className="ap-home-footer">
				Projects save automatically. Publish when you’re ready to share.
			</footer>
			{notice && (
				<div className="ap-home-notice" role="status">
					<Icon name="check" />
					{notice}
				</div>
			)}
			{manualLink && (
				<div className="ap-home-manual-link" role="status">
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
						onClick={() => setManualLink("")}
					/>
				</div>
			)}
			<ConfirmDialog
				open={Boolean(deleteProject)}
				className="ap-home-delete"
				backdropClassName="ap-home-delete-backdrop"
				title={
					deleteProject ? `Delete ${deleteProject.name}?` : "Delete project?"
				}
				returnFocus={deleteReturnFocus}
				onOpenChange={(open) => {
					if (!open && !deleted.current) setDeleteId(undefined);
				}}
				onConfirm={() => {
					if (!deleteId) return;
					deleted.current = true;
					deleteReturnFocus.current = projectArea.current;
					onDelete(deleteId);
					setDeleteId(undefined);
				}}
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
					if (!file || !id) return;
					if (
						!["image/gif", "image/jpeg", "image/png", "image/webp"].includes(
							file.type,
						) ||
						file.size > 1024 * 1024
					) {
						setCoverError("Choose a GIF, JPEG, PNG or WebP image up to 1 MB.");
						return;
					}
					setCoverError("");
					const reader = new FileReader();
					reader.onload = () => {
						if (typeof reader.result === "string")
							onChangeCover(id, reader.result);
					};
					reader.onerror = () =>
						setCoverError("Couldn’t read this image. Try another file.");
					reader.readAsDataURL(file);
				}}
			/>
			<SourceAttachmentDialog
				open={attachmentOpen}
				onOpenChange={setAttachmentOpen}
				returnFocus={attachmentReturnFocus}
				onAddWebsite={(url) => addSource({ kind: "website", value: url })}
				onAddFile={(file) => addSource({ kind: "file", value: file.name })}
			/>
		</main>
	);
}
