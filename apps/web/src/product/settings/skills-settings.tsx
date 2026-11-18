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
import { type FormEvent, useState } from "react";
import {
	SettingsDialog,
	SettingsHeading,
	SettingsNote,
} from "./settings-parts";
import type { WorkspaceConnection, WorkspaceSkill } from "./settings-state";

export function SkillsSettings({
	skills,
	connections,
	projects,
	onSkillsChange,
}: {
	skills: WorkspaceSkill[];
	connections: WorkspaceConnection[];
	projects: readonly MenuProject[];
	onSkillsChange: (skills: WorkspaceSkill[]) => void;
}) {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(skills[0]?.id ?? "");
	const [drafts, setDrafts] = useState<Record<string, WorkspaceSkill>>({});
	const [adding, setAdding] = useState(false);
	const [assigning, setAssigning] = useState(false);
	const [projectId, setProjectId] = useState("");
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const saved = skills.find((skill) => skill.id === selectedId);
	const selected = drafts[selectedId] ?? saved;
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
	function edit(updates: Partial<WorkspaceSkill>) {
		if (!selected) return;
		setDrafts((previous) => ({
			...previous,
			[selected.id]: { ...selected, ...updates },
		}));
		setError("");
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
		setNotice("");
	}
	function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!selected) return;
		const name = selected.name.trim();
		if (!name) {
			setError("Enter a skill name.");
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
			return;
		}
		const next = { ...selected, name };
		onSkillsChange(
			saved
				? skills.map((skill) => (skill.id === selected.id ? next : skill))
				: [...skills, next],
		);
		clearDraft(selected.id);
		setAdding(false);
		setNotice(`Saved ${name}.`);
	}
	return (
		<>
			<SettingsHeading
				title="Skills library"
				description="Create reusable capabilities and add them to individual projects."
				action={
					<Button onClick={create} disabled={adding}>
						Create skill
					</Button>
				}
			/>
			<div className="product-settings-split">
				<Surface className="product-settings-card product-settings-skill-list">
					<h2>Workspace skills</h2>
					<FormField
						label="Find a skill"
						showLabel={false}
						showSupportingText={false}
						placeholder="Find a skill..."
						type="search"
						value={query}
						onChange={(event) => setQuery(event.currentTarget.value)}
					/>
					{filteredSkills.length ? (
						<div className="product-settings-skill-options">
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
											setNotice("");
										}}
									/>
								);
							})}
						</div>
					) : (
						<p className="product-settings-muted">No matching skills.</p>
					)}
				</Surface>
				<Surface className="product-settings-card product-settings-detail product-settings-skill-detail">
					{selected ? (
						<form onSubmit={save} noValidate>
							<div className="product-settings-panel-title">
								<h2>{saved?.name ?? "New skill"}</h2>
								<Badge>Workspace skill</Badge>
							</div>
							{selected.description && (
								<p className="product-settings-muted">{selected.description}</p>
							)}
							<FormField
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
								<Button type="submit" size="medium">
									Save skill
								</Button>
								{adding ? (
									<Button
										variant="secondary"
										size="medium"
										onClick={() => {
											clearDraft(selected.id);
											setSelectedId(skills[0]?.id ?? "");
											setAdding(false);
											setError("");
										}}
									>
										Cancel
									</Button>
								) : (
									<Button
										size="medium"
										variant="secondary"
										onClick={() => {
											setProjectId(available[0]?.id ?? "");
											setAssigning(true);
										}}
									>
										Add to project
									</Button>
								)}
								{notice && (
									<p role="status" className="product-settings-muted">
										{notice}
									</p>
								)}
							</div>
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
				>
					{available.length ? (
						<SelectField
							label="Project"
							showSupportingText={false}
							value={projectId}
							options={available.map((project) => ({
								value: project.id,
								label: project.name,
							}))}
							onChange={(event) => setProjectId(event.currentTarget.value)}
						/>
					) : (
						<p className="product-settings-muted">
							All workspace projects already have this skill.
						</p>
					)}
					<div className="product-settings-dialog-actions">
						<Button variant="secondary" onClick={() => setAssigning(false)}>
							Cancel
						</Button>
						<Button
							disabled={!available.some((item) => item.id === projectId)}
							onClick={() => {
								const assignments = [...saved.projects, projectId];
								onSkillsChange(
									skills.map((skill) =>
										skill.id === saved.id
											? { ...skill, projects: assignments }
											: skill,
									),
								);
								if (drafts[saved.id]) edit({ projects: assignments });
								setNotice(
									`Added ${saved.name} to ${projects.find((project) => project.id === projectId)?.name}.`,
								);
								setAssigning(false);
							}}
						>
							Add skill
						</Button>
					</div>
				</SettingsDialog>
			)}
		</>
	);
}
