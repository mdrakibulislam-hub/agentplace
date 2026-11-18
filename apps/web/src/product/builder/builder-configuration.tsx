import { CapabilityRow, VersionRow } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { Tabs } from "@agentplace/ui/components/ap-navigation";
import { Button } from "@agentplace/ui/components/button";
import { useState } from "react";
import {
	type BuilderConversation,
	type BuilderVersion,
	skills,
} from "./builder-model";
import { BuilderNote, BuilderTitle } from "./builder-primitives";

export function BuilderInstructions({
	projectName,
	value,
	version,
	skillCount,
	onChange,
	onSave,
	onSkills,
	onHistory,
}: {
	projectName: string;
	value: string;
	version?: BuilderVersion;
	skillCount: number;
	onChange: (next: string) => void;
	onSave: () => void;
	onSkills: () => void;
	onHistory: () => void;
}) {
	const newLine = value.indexOf("\n");
	const heading = newLine === -1 ? value : value.slice(0, newLine);
	const body = newLine === -1 ? "" : value.slice(newLine + 1);
	return (
		<section
			className="ap-builder-config ap-builder-instructions"
			aria-label="Project instructions"
		>
			<BuilderTitle
				title="Instructions.md"
				description="Define what your agent does and where its boundaries are."
				action={
					<Button onClick={onSave} disabled={!value.trim()}>
						Save instructions
					</Button>
				}
			/>
			<div className="ap-builder-instructions-layout">
				<div className="ap-builder-markdown">
					<input
						aria-label="Instructions heading"
						value={heading}
						onChange={(event) => onChange(`${event.target.value}\n${body}`)}
					/>
					<textarea
						aria-label="Markdown instructions"
						value={body}
						onChange={(event) => onChange(`${heading}\n${event.target.value}`)}
						spellCheck={false}
					/>
					<div className="ap-builder-markdown-meta">
						<small className="ap-builder-small">
							{version
								? `Last saved ${version.meta.toLowerCase()} · Version ${version.id}`
								: "New draft"}
						</small>
						<Button variant="ghost" onClick={onHistory}>
							Version history
						</Button>
					</div>
				</div>
				<aside aria-label="Instruction guidance">
					<BuilderNote title="Project instructions">
						These instructions apply only to {projectName}.
					</BuilderNote>
					<BuilderNote title="Skills">
						{skillCount} project{" "}
						{skillCount === 1 ? "skill follows" : "skills follow"} these
						instructions.
					</BuilderNote>
					<Button variant="secondary" onClick={onSkills}>
						View project skills
					</Button>
					<div className="ap-builder-grow" />
					<BuilderNote title="Keep sensitive data out">
						Store credentials in a plugin connection, never in instructions.
					</BuilderNote>
				</aside>
			</div>
		</section>
	);
}

export function BuilderSkills({
	selected,
	onToggle,
	onConfigure,
	onAdd,
	onPick,
	onLibrary,
}: {
	selected: Record<string, boolean>;
	onToggle: (id: string, enabled: boolean) => void;
	onConfigure: (id: string) => void;
	onAdd: (id: string) => void;
	onPick: () => void;
	onLibrary: () => void;
}) {
	return (
		<section className="ap-builder-config" aria-label="Project skills">
			<BuilderTitle
				title="Project skills"
				description="Capabilities this agent can use. Connections stay scoped to this project."
				action={<Button onClick={onPick}>Add skill</Button>}
			/>
			<div className="ap-builder-skill-list">
				{skills.map((skill) => (
					<CapabilityRow
						key={skill.id}
						name={skill.name}
						description={skill.description}
						state={Object.hasOwn(selected, skill.id) ? "enabled" : "available"}
						enabled={selected[skill.id] ?? false}
						onEnabledChange={(next) => onToggle(skill.id, next)}
						onConfigure={() => onConfigure(skill.id)}
						onAdd={() => onAdd(skill.id)}
					/>
				))}
			</div>
			<BuilderNote title="Project scope">
				Disabling a skill here does not remove it from other projects.
			</BuilderNote>
			<Button
				className="ap-builder-fit"
				variant="ghost"
				icon={<Icon name="arrow-right" />}
				onClick={onLibrary}
			>
				Manage workspace skills library
			</Button>
		</section>
	);
}

export function BuilderHistory({
	versions,
	conversations,
	liveVersion,
	onView,
	onRestore,
	onConversation,
}: {
	versions: BuilderVersion[];
	conversations: BuilderConversation[];
	liveVersion?: number;
	onView: (version: BuilderVersion) => void;
	onRestore: (version: BuilderVersion) => void;
	onConversation: (id: string) => void;
}) {
	const [tab, setTab] = useState("versions");
	return (
		<section className="ap-builder-config" aria-label="Project history">
			<BuilderTitle
				title="History"
				description="Track changes and return to an earlier version of your agent."
			/>
			<Tabs
				tabs={[
					{ value: "versions", label: "Versions" },
					{ value: "conversations", label: "Conversations" },
				]}
				value={tab}
				onChange={setTab}
				label="History"
			/>
			{tab === "versions" ? (
				<>
					<BuilderNote title="Restoring creates a draft">
						Your live agent stays unchanged until you publish an update.
					</BuilderNote>
					<div className="ap-builder-version-list">
						{versions.length ? (
							versions.map((version, index) => (
								<VersionRow
									key={version.id}
									version={`V${version.id}`}
									title={version.title}
									meta={version.meta}
									current={index === 0}
									status={
										index === 0
											? "Current draft"
											: version.id === liveVersion
												? "Live version"
												: "Draft"
									}
									actionLabel={index === 0 ? "View" : "Restore to draft"}
									onView={() =>
										index === 0 ? onView(version) : onRestore(version)
									}
								/>
							))
						) : (
							<p className="ap-builder-small">
								Your first draft will appear here when it’s ready.
							</p>
						)}
					</div>
				</>
			) : (
				<div className="ap-builder-version-list">
					{conversations.map((conversation) => (
						<VersionRow
							key={conversation.id}
							version="Chat"
							title={conversation.title}
							meta={`${conversation.messages.length} messages`}
							current={false}
							onView={() => onConversation(conversation.id)}
						/>
					))}
				</div>
			)}
		</section>
	);
}
