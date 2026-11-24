import {
	FormField,
	SelectField,
	Textarea,
} from "@agentplace/ui/components/ap-controls";
import { Badge, Surface } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	type MenuProject,
	RichMenuItem,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useLayoutEffect, useRef, useState } from "react";
import {
	SettingsDialog,
	SettingsFeedback,
	SettingsHeading,
	SettingsNote,
	settingsError,
	useSettingsDetail,
	useSettingsDialog,
} from "./settings-parts";
import type { WorkspaceConnection, WorkspaceSkill } from "./settings-state";

export function SkillsSettings({
	skills,
	connections,
	projects,
	active,
	onSkillsChange,
}: {
	skills: WorkspaceSkill[];
	connections: WorkspaceConnection[];
	projects: readonly MenuProject[];
	active: boolean;
	onSkillsChange: (
		update: (skills: WorkspaceSkill[]) => WorkspaceSkill[],
	) => void;
}) {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(skills[0]?.id ?? "");
	const [drafts, setDrafts] = useState<Record<string, WorkspaceSkill>>({});
	const [adding, setAdding] = useState(false);
	const [assigning, setAssigning] = useSettingsDialog(active, false);
	const [projectId, setProjectId] = useState("");
	const [error, setError] = useState("");
	const [saveError, setSaveError] = useState("");
	const [assignmentError, setAssignmentError] = useState("");
	const [notice, setNotice] = useState("");
	const detail = useRef<HTMLDivElement>(null);
	const nameInput = useRef<HTMLInputElement>(null);
	const search = useRef<HTMLInputElement>(null);
	const createButton = useRef<HTMLButtonElement>(null);
	const assignButton = useRef<HTMLButtonElement>(null);
	const lastSelectedId = useRef(selectedId);
	const revealDetails = useSettingsDetail(detail, selectedId);
	const saved = skills.find((skill) => skill.id === selectedId);
	const selected = drafts[selectedId] ?? saved;
	const dirty = Boolean(
		adding ||
			(saved &&
				selected &&
				(saved.name !== selected.name ||
					saved.connection !== selected.connection ||
					saved.guidance !== selected.guidance)),
	);
	const filteredSkills = skills.filter((skill) =>
		skill.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
	);
	const assigned = (skill: WorkspaceSkill) =>
		projects.filter((project) => skill.projects.includes(project.id));
	const available = selected
		? projects.filter((project) => !selected.projects.includes(project.id))
		: [];
	const options = [
		{ value: "none", label: "No connection" },
		...connections.map((connection) => ({
			value: connection.id,
			label: connection.name,
		})),
	];
	useLayoutEffect(() => {
		if (adding) nameInput.current?.focus();
	}, [adding]);

	function clearSearch() {
		setQuery("");
		search.current?.focus({ preventScroll: true });
	}

	function edit(updates: Partial<WorkspaceSkill>) {
		if (!selected) return;
		setDrafts((previous) => ({
			...previous,
			[selected.id]: { ...selected, ...updates },
		}));
		setError("");
		setSaveError("");
		setNotice("");
	}
	function clearDraft(id: string) {
		setDrafts((previous) => {
			const updated = { ...previous };
			delete updated[id];
			return updated;
		});
	}
	function create() {
		const id = crypto.randomUUID();
		lastSelectedId.current = selectedId;
		setSelectedId(id);
		setDrafts((previous) => ({
			...previous,
			[id]: {
				id,
				name: "",
				connection: "none",
				description: "",
				guidance: "",
				projects: [],
			},
		}));
		setAdding(true);
		setError("");
		setSaveError("");
		setNotice("");
	}
	function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selected || !dirty) return;
		const name = selected.name.trim();
		if (!name) {
			setError("Enter a skill name.");
			nameInput.current?.focus();
			return;
		}
		if (
			skills.some(
				(skill) =>
					skill.id !== selected.id &&
					skill.name.toLowerCase() === name.toLowerCase(),
			)
		) {
			setError("A skill with this name already exists.");
			nameInput.current?.focus();
			return;
		}
		const next = { ...selected, name };
		try {
			onSkillsChange((current) =>
				saved
					? current.map((skill) =>
							skill.id === selected.id
								? { ...next, projects: skill.projects }
								: skill,
						)
					: [...current, next],
			);
			clearDraft(selected.id);
			setAdding(false);
			setSaveError("");
			setNotice(`Saved ${name}.`);
			nameInput.current?.focus({ preventScroll: true });
		} catch (cause) {
			setSaveError(settingsError(cause));
		}
	}

	function addToProject(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const project = available.find((item) => item.id === projectId);
		if (!saved || !project) return;
		try {
			onSkillsChange((current) =>
				current.map((skill) =>
					skill.id === saved.id && !skill.projects.includes(project.id)
						? { ...skill, projects: [...skill.projects, project.id] }
						: skill,
				),
			);
			if (drafts[saved.id]) edit({ projects: [...saved.projects, project.id] });
			setNotice(`Added ${saved.name} to ${project.name}.`);
			setAssigning(false);
		} catch (cause) {
			setAssignmentError(settingsError(cause));
		}
	}
	return (
		<>
			<SettingsHeading
				title="Skills library"
				description="Create reusable capabilities and add them to individual projects."
				action={
					<Button ref={createButton} onClick={create} disabled={adding}>
						Create skill
					</Button>
				}
			/>
			<div className="product-settings-split">
				<Surface className="product-settings-card product-settings-skill-list">
					<h2>Workspace skills</h2>
					<div className="product-settings-search">
						<FormField
							ref={search}
							label="Find a skill"
							showLabel={false}
							showSupportingText={false}
							placeholder="Find a skill…"
							type="search"
							value={query}
							onChange={(event) => setQuery(event.currentTarget.value)}
							onKeyDown={(event) => {
								if (event.key === "Escape" && query) {
									event.preventDefault();
									clearSearch();
								}
							}}
						/>
						{query && (
							<Button
								size="icon"
								variant="ghost"
								aria-label="Clear skill search"
								icon={<Icon name="close" />}
								onClick={clearSearch}
							/>
						)}
					</div>
					{filteredSkills.length ? (
						<div className="product-settings-list-options">
							{filteredSkills.map((skill) => {
								const count = assigned(skill).length;
								const selected = skill.id === selectedId;
								return (
									<RichMenuItem
										key={skill.id}
										label={skill.name}
										description={
											count
												? `Used in ${count} ${count === 1 ? "project" : "projects"}`
												: "Not enabled in any project"
										}
										icon={
											<Icon className="product-settings-muted" name="puzzle" />
										}
										state={selected ? "selected" : "default"}
										aria-pressed={selected}
										disabled={adding}
										onClick={() => {
											setSelectedId(skill.id);
											setError("");
											setSaveError("");
											setNotice("");
											revealDetails();
										}}
									/>
								);
							})}
						</div>
					) : (
						<p className="product-settings-muted" role="status">
							No matching skills.
						</p>
					)}
				</Surface>
				<Surface
					ref={detail}
					className="product-settings-card product-settings-detail product-settings-skill-detail"
				>
					{selected ? (
						<form onSubmit={save} noValidate>
							<div className="product-settings-panel-title">
								<h2 tabIndex={-1}>{saved?.name ?? "New skill"}</h2>
								<Badge>Workspace skill</Badge>
							</div>
							{selected.description && (
								<p className="product-settings-muted">{selected.description}</p>
							)}
							<FormField
								ref={nameInput}
								label="Skill name"
								placeholder="Service recommendations"
								required
								state={error ? "error" : "filled"}
								errorMessage={error}
								showSupportingText={Boolean(error)}
								value={selected.name}
								onChange={(event) => edit({ name: event.currentTarget.value })}
							/>
							<SelectField
								label="Default connection"
								showSupportingText={false}
								value={selected.connection}
								options={options}
								onChange={(event) =>
									edit({
										connection: event.currentTarget
											.value as WorkspaceSkill["connection"],
									})
								}
							/>
							<Textarea
								label="Guidance"
								showSupportingText={false}
								value={selected.guidance}
								onChange={(event) =>
									edit({ guidance: event.currentTarget.value })
								}
							/>
							{assigned(selected).length > 0 && (
								<SettingsNote
									warning
									title="Shared skill"
								>{`Editing this skill can affect ${assigned(selected).length} ${assigned(selected).length === 1 ? "project" : "projects"}. Review affected projects before applying updates.`}</SettingsNote>
							)}
							<div className="product-settings-panel-actions product-settings-actions">
								<Button type="submit" size="medium" disabled={!dirty}>
									Save skill
								</Button>
								{adding ? (
									<Button
										variant="secondary"
										size="medium"
										onClick={() => {
											clearDraft(selected.id);
											setSelectedId(lastSelectedId.current);
											setAdding(false);
											setError("");
											setSaveError("");
											requestAnimationFrame(() =>
												createButton.current?.focus({ preventScroll: true }),
											);
										}}
									>
										Cancel
									</Button>
								) : (
									<Button
										ref={assignButton}
										size="medium"
										variant="secondary"
										onClick={() => {
											setProjectId(available[0]?.id ?? "");
											setAssignmentError("");
											setAssigning(true);
										}}
									>
										Add to project
									</Button>
								)}
								{!adding && dirty && (
									<Button
										variant="ghost"
										size="medium"
										onClick={() => {
											clearDraft(selected.id);
											setError("");
											setSaveError("");
											setNotice("");
											nameInput.current?.focus({ preventScroll: true });
										}}
									>
										Reset changes
									</Button>
								)}
							</div>
							<SettingsFeedback
								notice={notice}
								error={saveError}
								dirty={dirty && !saveError}
							/>
						</form>
					) : (
						<p className="product-settings-muted">
							Choose or create a workspace skill.
						</p>
					)}
				</Surface>
			</div>
			{assigning && saved && (
				<SettingsDialog
					title="Add skill to a project"
					description={saved.name}
					onClose={() => setAssigning(false)}
					returnFocus={assignButton}
				>
					<form
						className="product-settings-dialog-form"
						onSubmit={addToProject}
					>
						{available.length ? (
							<SelectField
								data-initial-focus
								label="Project"
								showSupportingText={false}
								value={projectId}
								options={available.map((project) => ({
									value: project.id,
									label: project.name,
								}))}
								onChange={(event) => {
									setProjectId(event.currentTarget.value);
									setAssignmentError("");
								}}
							/>
						) : (
							<p className="product-settings-muted">
								All workspace projects already have this skill.
							</p>
						)}
						<SettingsFeedback error={assignmentError} />
						<div className="product-settings-dialog-actions">
							<Button
								data-initial-focus={!available.length ? "" : undefined}
								variant="secondary"
								onClick={() => setAssigning(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={!available.some((item) => item.id === projectId)}
							>
								Add skill
							</Button>
						</div>
					</form>
				</SettingsDialog>
			)}
		</>
	);
}
