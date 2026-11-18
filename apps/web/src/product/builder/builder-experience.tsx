import { SelectField, Textarea } from "@agentplace/ui/components/ap-controls";
import {
	ProjectNavigation,
	type ProjectNavValue,
	ProjectToolbar,
	type SettingsNavValue,
	Tabs,
} from "@agentplace/ui/components/ap-navigation";
import { Button } from "@agentplace/ui/components/button";
import { useState } from "react";
import { liveProjectPath, type PrototypeProject } from "../prototype-data";
import { BuilderBranding } from "./builder-branding";
import { BuilderChat, BuilderProgress } from "./builder-chat";
import {
	BuilderHistory,
	BuilderInstructions,
	BuilderSkills,
} from "./builder-configuration";
import {
	type BrandingDraft,
	type BuilderData,
	type BuilderVersion,
	initialBuilderData,
	type PublishedSnapshot,
	recordVersion,
	skills,
} from "./builder-model";
import { BuilderDialog } from "./builder-primitives";
import {
	ManagePublication,
	ReviewPublish,
	UnpublishAgent,
} from "./builder-publishing";
import { BuilderVisitorPreview } from "./visitor-experience";
import "./builder.css";

type PublishAction = "publish" | "unpublish";
type BuilderOverlay =
	| { type: PublishAction | "destination" | "skills" | "preview" }
	| { type: "configure"; id: string }
	| { type: "view" | "restore"; version: BuilderVersion };

export interface BuilderExperienceProps {
	project: PrototypeProject;
	onProjectChange: (updates: Partial<PrototypeProject>) => void;
	onBack: () => void;
	onSettings: (section?: SettingsNavValue) => void;
	onOpenVisitor?: (projectId: string, published: boolean) => void;
	initialSection?: ProjectNavValue;
	initialPublishAction?: PublishAction;
	initialManagePublish?: boolean;
	initialCoverMenu?: boolean;
	demoCover?: boolean;
	staffCount?: number;
}

export function BuilderExperience({
	project,
	onProjectChange,
	onBack,
	onSettings,
	onOpenVisitor,
	initialSection = "Chat",
	initialPublishAction,
	initialManagePublish = false,
	initialCoverMenu = false,
	demoCover = false,
	staffCount = 3,
}: BuilderExperienceProps) {
	const [section, setSection] = useState(initialSection);
	const [conversationId, setConversationId] = useState("build");
	const [view, setView] = useState("editor");
	const [overlay, setOverlay] = useState<BuilderOverlay | undefined>(
		initialPublishAction ? { type: initialPublishAction } : undefined,
	);
	const [manage, setManage] = useState(initialManagePublish);
	const [configValue, setConfigValue] = useState("");
	const data = initialBuilderData(project);
	const working = Boolean(project.needsFirstDraft);
	const live = project.status === "Published";
	const published = project.published ?? (live ? snapshot(data) : undefined);
	const currentVersion = data.versions[0];
	const draftChanges = live && published?.versionId !== currentVersion?.id;
	const stagedBranding = data.stagedBranding ?? data.branding;
	const stagedInstructions = data.stagedInstructions ?? data.instructions;
	const dirty =
		Boolean(data.stagedBranding) || stagedInstructions !== data.instructions;
	const url =
		project.liveUrl ??
		new URL(liveProjectPath(project.id), window.location.origin).href;
	const activeConversation =
		data.conversations.find(
			(conversation) => conversation.id === conversationId,
		) ?? data.conversations[0];
	const splitView = section === "Chat" || section === "Branding";
	const selectedSkills = data.skills;

	function showSection(next: ProjectNavValue) {
		setSection(next);
		setView("editor");
	}

	function change(next: BuilderData, updates?: Partial<PrototypeProject>) {
		onProjectChange({ builder: next, published, ...updates });
	}

	function save(
		next: BuilderData,
		label: string,
		updates?: Partial<PrototypeProject>,
	) {
		change(recordVersion(next, label), {
			updated: "Edited just now",
			...updates,
		});
	}

	function stageBranding(updates: Partial<BrandingDraft>) {
		const next = { ...stagedBranding, ...updates };
		change({
			...data,
			stagedBranding: sameBranding(data.branding, next) ? undefined : next,
		});
	}

	function saveBranding() {
		if (!data.stagedBranding) return;
		const branding = {
			...stagedBranding,
			name: stagedBranding.name.trim(),
			company: stagedBranding.company.trim(),
		};
		if (!branding.name || !branding.company) return;
		save(
			{ ...data, branding, stagedBranding: undefined },
			"Updated company branding",
			{
				name: branding.name,
				company: branding.company,
				cover: branding.cover,
			},
		);
	}

	function selectConversation(id: string) {
		setConversationId(id);
		showSection("Chat");
	}

	function newConversation() {
		const id = crypto.randomUUID();
		change({
			...data,
			conversations: [
				...data.conversations,
				{ id, title: "New conversation", messages: [] },
			],
		});
		selectConversation(id);
	}

	function submitChat(text: string) {
		if (!activeConversation) return;
		const conversations = data.conversations.map((conversation) => {
			if (conversation.id !== activeConversation.id) return conversation;
			return {
				...conversation,
				title: conversation.messages.length
					? conversation.title
					: text.slice(0, 40),
				messages: [
					...conversation.messages,
					{ id: crypto.randomUUID(), role: "you" as const, text },
					{
						id: crypto.randomUUID(),
						role: "agent" as const,
						text: working
							? "I’ve added that direction to your first draft."
							: "I’ve added your change to the draft instructions. You can review it before publishing an update.",
					},
				],
			};
		});
		save(
			{
				...data,
				conversations,
				instructions: `${data.instructions}\n\n## Builder direction\n${text}`,
			},
			"Updated from a conversation",
		);
	}

	function completeFirstDraft() {
		save(data, "Created first draft", { needsFirstDraft: false });
		setView("preview");
	}

	function saveInstructions() {
		if (stagedInstructions === data.instructions || !stagedInstructions.trim())
			return;
		save(
			{
				...data,
				instructions: stagedInstructions,
				stagedInstructions: undefined,
			},
			"Updated agent instructions",
		);
	}

	function setSkill(id: string, enabled: boolean) {
		save(
			{ ...data, skills: { ...data.skills, [id]: enabled } },
			"Updated project skills",
		);
	}

	function restore(version: BuilderVersion) {
		const configuration = version.configuration;
		save(
			{
				...data,
				...configuration,
				stagedBranding: undefined,
				stagedInstructions: undefined,
			},
			`Restored V${version.id} to draft`,
			{
				name: configuration.branding.name,
				company: configuration.branding.company,
				cover: configuration.branding.cover,
			},
		);
		setOverlay(undefined);
	}

	function publish(audience: string, requireSignIn: boolean) {
		if (dirty || working) return;
		change(data, {
			status: "Published",
			published: { ...snapshot(data), audience, requireSignIn },
		});
		setOverlay(undefined);
		setManage(true);
	}

	function openVisitor(isLive: boolean) {
		if (onOpenVisitor) onOpenVisitor(project.id, isLive);
		else setOverlay({ type: "preview" });
	}

	const close = () => setOverlay(undefined);

	return (
		<div className="ap-builder-workspace">
			<ProjectNavigation
				active={section}
				onChange={showSection}
				onHome={onBack}
				onNewConversation={newConversation}
				onManageAccess={() => onSettings("Staff & roles")}
				onConversation={selectConversation}
				staffCount={staffCount}
				conversations={data.conversations.map((conversation) => ({
					id: conversation.id,
					title: conversation.title,
					detail: `Today · ${conversation.id === "build" ? Math.max(4, conversation.messages.length) : conversation.messages.length} messages`,
					selected:
						section === "Chat" && conversation.id === activeConversation?.id,
				}))}
			/>
			<main className="ap-builder-main">
				<ProjectToolbar
					name={project.name}
					saved={!dirty}
					status={draftChanges ? "changes" : live ? "published" : "draft"}
					publishDisabled={working}
					onPublish={() => setOverlay({ type: "publish" })}
					publishControl={
						live ? (
							<ManagePublication
								url={url}
								draftChanges={draftChanges}
								open={manage}
								onOpenChange={setManage}
								onPublishUpdate={() => setOverlay({ type: "publish" })}
								onUnpublish={() => setOverlay({ type: "unpublish" })}
								onOpenLive={() => openVisitor(true)}
							/>
						) : undefined
					}
				/>
				{splitView && (
					<>
						<div className="ap-builder-layout-tabs">
							<Tabs
								tabs={[
									{ value: "editor", label: section },
									{ value: "preview", label: "Preview" },
								]}
								label="Builder panels"
								value={view}
								onChange={setView}
							/>
						</div>
						<div className="ap-builder-split" data-view={view}>
							{section === "Chat" ? (
								<BuilderChat
									key={activeConversation?.id}
									conversation={activeConversation}
									working={working}
									destination={data.destination}
									onSubmit={submitChat}
									onBranding={() => showSection("Branding")}
									onReview={() => showSection("Skills")}
									onDestination={() => {
										setConfigValue("");
										setOverlay({ type: "destination" });
									}}
									onSkipDestination={completeFirstDraft}
								/>
							) : (
								<BuilderBranding
									branding={stagedBranding}
									initialCoverMenu={initialCoverMenu}
									demoCover={demoCover}
									saved={!data.stagedBranding}
									onChange={stageBranding}
									onSave={saveBranding}
									onBack={() => showSection("Chat")}
								/>
							)}
							{section === "Chat" && working ? (
								<BuilderProgress onReady={completeFirstDraft} />
							) : (
								<BuilderVisitorPreview
									branding={
										section === "Branding" ? stagedBranding : data.branding
									}
									showCover={section === "Chat" || demoCover ? true : undefined}
									onOpenExternal={() => openVisitor(false)}
								/>
							)}
						</div>
					</>
				)}
				{section === "Instructions.md" && (
					<BuilderInstructions
						projectName={project.name}
						value={stagedInstructions}
						version={currentVersion}
						skillCount={Object.values(selectedSkills).filter(Boolean).length}
						onChange={(next) => change({ ...data, stagedInstructions: next })}
						onSave={saveInstructions}
						onSkills={() => showSection("Skills")}
						onHistory={() => showSection("History")}
					/>
				)}
				{section === "Skills" && (
					<BuilderSkills
						selected={selectedSkills}
						onToggle={setSkill}
						onConfigure={(id) => {
							setConfigValue(data.skillNotes?.[id] ?? "");
							setOverlay({ type: "configure", id });
						}}
						onAdd={(id) => setSkill(id, true)}
						onPick={() => setOverlay({ type: "skills" })}
						onLibrary={() => onSettings("Skills library")}
					/>
				)}
				{section === "History" && (
					<BuilderHistory
						versions={data.versions}
						conversations={data.conversations}
						liveVersion={published?.versionId}
						onView={(version) => setOverlay({ type: "view", version })}
						onRestore={(version) => setOverlay({ type: "restore", version })}
						onConversation={selectConversation}
					/>
				)}
			</main>
			{overlay?.type === "publish" && (
				<ReviewPublish
					name={project.name}
					url={url}
					draftChanges={draftChanges}
					ready={!dirty && !working}
					audience={published?.audience}
					requireSignIn={published?.requireSignIn}
					onConfirm={publish}
					onClose={close}
				/>
			)}
			{overlay?.type === "unpublish" && (
				<UnpublishAgent
					url={url}
					onConfirm={() => {
						change(data, {
							status: "Unpublished",
							published: undefined,
							liveUrl: undefined,
						});
						close();
					}}
					onClose={close}
				/>
			)}
			{overlay?.type === "destination" && (
				<BuilderDialog
					title="Connect a destination"
					description="Choose where this project collects visitor enquiries."
					onClose={close}
				>
					<SelectField
						label="Enquiry destination"
						showSupportingText={false}
						placeholder="Choose a destination"
						options={[
							{ value: "Workspace inbox", label: "Workspace inbox" },
							{ value: "Project enquiry list", label: "Project enquiry list" },
						]}
						value={configValue}
						onChange={(event) => setConfigValue(event.target.value)}
					/>
					<div className="ap-builder-dialog-actions">
						<Button
							data-initial-focus
							variant="secondary"
							size="medium"
							onClick={close}
						>
							Cancel
						</Button>
						<Button
							size="medium"
							disabled={!configValue}
							onClick={() => {
								save(
									{ ...data, destination: configValue },
									"Set enquiry destination",
								);
								close();
							}}
						>
							Connect destination
						</Button>
					</div>
				</BuilderDialog>
			)}
			{overlay?.type === "skills" && (
				<BuilderDialog
					title="Add a project skill"
					description="Choose a skill the agent can use in this project."
					onClose={close}
				>
					{skills
						.filter((skill) => !selectedSkills[skill.id])
						.map((skill) => (
							<Button
								variant="secondary"
								key={skill.id}
								onClick={() => {
									setSkill(skill.id, true);
									close();
								}}
							>
								{skill.name}
							</Button>
						))}
					{Object.values(selectedSkills).filter(Boolean).length ===
						skills.length && (
						<p>All workspace skills are enabled in this project.</p>
					)}
				</BuilderDialog>
			)}
			{overlay?.type === "configure" && (
				<BuilderDialog
					title={
						skills.find((skill) => skill.id === overlay.id)?.name ??
						"Configure skill"
					}
					description="Set the instructions that apply to this project."
					onClose={close}
				>
					<Textarea
						label="Skill instructions"
						showSupportingText={false}
						value={configValue}
						onChange={(event) => setConfigValue(event.target.value)}
					/>
					<div className="ap-builder-dialog-actions">
						<Button variant="secondary" size="medium" onClick={close}>
							Cancel
						</Button>
						<Button
							size="medium"
							onClick={() => {
								save(
									{
										...data,
										skillNotes: {
											...data.skillNotes,
											[overlay.id]: configValue,
										},
									},
									"Configured project skill",
								);
								close();
							}}
						>
							Save configuration
						</Button>
					</div>
				</BuilderDialog>
			)}
			{overlay?.type === "view" && (
				<BuilderDialog
					title={overlay.version.title}
					description={`Version ${overlay.version.id} · ${overlay.version.meta}`}
					onClose={close}
				>
					<pre className="ap-builder-version-snapshot">
						{overlay.version.configuration.instructions}
					</pre>
					<Button
						size="medium"
						variant="secondary"
						data-initial-focus
						onClick={close}
					>
						Done
					</Button>
				</BuilderDialog>
			)}
			{overlay?.type === "restore" && (
				<BuilderDialog
					title={`Restore V${overlay.version.id} to draft?`}
					description="This creates a new draft from the saved version. Your live agent stays unchanged until you publish an update."
					onClose={close}
				>
					<div className="ap-builder-dialog-actions">
						<Button
							size="medium"
							variant="secondary"
							data-initial-focus
							onClick={close}
						>
							Cancel
						</Button>
						<Button size="medium" onClick={() => restore(overlay.version)}>
							Restore to draft
						</Button>
					</div>
				</BuilderDialog>
			)}
			{overlay?.type === "preview" && (
				<BuilderDialog title="Visitor experience" onClose={close} wide>
					<BuilderVisitorPreview branding={data.branding} standalone />
				</BuilderDialog>
			)}
		</div>
	);
}

function sameBranding(left: BrandingDraft, right: BrandingDraft) {
	return Object.keys(right).every(
		(key) =>
			left[key as keyof BrandingDraft] === right[key as keyof BrandingDraft],
	);
}

function snapshot(data: BuilderData): PublishedSnapshot {
	return { ...data.branding, versionId: data.versions[0]?.id };
}
