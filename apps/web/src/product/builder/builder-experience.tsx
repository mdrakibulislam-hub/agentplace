import { SelectField, Textarea } from "@agentplace/ui/components/ap-controls";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	MenuItem,
	MenuPanel,
	MenuPopover,
} from "@agentplace/ui/components/ap-menus";
import {
	ConversationList,
	ProjectNavigation,
	type ProjectNavValue,
	ProjectToolbar,
	type SettingsNavValue,
	Tabs,
} from "@agentplace/ui/components/ap-navigation";
import { Button } from "@agentplace/ui/components/button";
import { useEffect, useRef, useState } from "react";
import { liveProjectPath, type PrototypeProject } from "../prototype-data";
import { useSettingsState } from "../settings/settings-state";
import { BuilderBranding } from "./builder-branding";
import { BuilderChat, BuilderProgress } from "./builder-chat";
import {
	BuilderHistory,
	BuilderInstructions,
	BuilderSkills,
} from "./builder-configuration";
import {
	type BrandingDraft,
	type BuilderConfiguration,
	type BuilderData,
	type BuilderVersion,
	type ConversationMessage,
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
import { BuilderSplit, defaultPreviewShare } from "./builder-split";
import { BuilderVisitorPreview } from "./visitor-experience";
import "./builder.css";

type PublishAction = "publish" | "unpublish";
type BuilderOverlay =
	| { type: PublishAction | "destination" | "skills" }
	| { type: "preview"; published: boolean }
	| { type: "configure"; id: string }
	| { type: "view" | "restore"; version: BuilderVersion };

export interface BuilderExperienceProps {
	project: PrototypeProject;
	onProjectChange: (updates: Partial<PrototypeProject>) => void;
	onSaveDraft: (updates: Partial<PrototypeProject>) => void | Promise<void>;
	onBack: () => void;
	onSettings: (section?: SettingsNavValue) => void;
	onOpenVisitor?: (projectId: string, published: boolean) => void;
	initialSection?: ProjectNavValue;
	initialPublishAction?: PublishAction;
	initialManagePublish?: boolean;
	initialCoverMenu?: boolean;
	/** Optional live provider. The local prototype otherwise saves directions to instructions. */
	onBuild?: (
		text: string,
		configuration: BuilderConfiguration,
		signal: AbortSignal,
	) => Promise<{ configuration: BuilderConfiguration; reply: string }>;
	visitorReply?: import("./visitor-experience").VisitorReply;
	initialVisitorSuggestions?: string[];
	initialVisitorMessages?: import("@agentplace/ui/components/ap-conversation").ChatMessage[];
}

export function BuilderExperience({
	project,
	onProjectChange,
	onSaveDraft,
	onBack,
	onSettings,
	onOpenVisitor,
	initialSection = "Chat",
	initialPublishAction,
	initialManagePublish = false,
	initialCoverMenu = false,
	onBuild,
	visitorReply,
	initialVisitorMessages,
	initialVisitorSuggestions,
}: BuilderExperienceProps) {
	const [request, setRequest] = useState<{
		conversationId: string;
		message: ConversationMessage;
		state: "working" | "error" | "stopped";
		error?: string;
	}>();
	const [unsavedMessages, setUnsavedMessages] = useState<
		Record<string, ConversationMessage[]>
	>({});
	const [committing, setCommitting] = useState(false);
	const operation = useRef<AbortController | null>(null);
	const latestData = useRef<BuilderData>(initialBuilderData(project));
	useEffect(() => () => operation.current?.abort(), []);
	const [workspace, setWorkspace] = useSettingsState();
	const [section, setSection] = useState(initialSection);
	const [conversationId, setConversationId] = useState("build");
	const [view, setView] = useState("editor");
	const [previewShare, setPreviewShare] = useState(defaultPreviewShare);
	const [overlay, setOverlay] = useState<BuilderOverlay | undefined>(
		initialPublishAction ? { type: initialPublishAction } : undefined,
	);
	const [manage, setManage] = useState(initialManagePublish);
	const [configValue, setConfigValue] = useState("");
	const data = initialBuilderData(project);
	latestData.current = data;
	const busy = request?.state === "working";
	const working = Boolean(project.needsFirstDraft);
	const usesWebsite =
		Boolean(project.sources?.some((source) => source.kind === "website")) ||
		/\b(?:https?:\/\/|www\.|[a-z0-9-]+\.(?:com|org|net|agency|io|co)\b)/i.test(
			project.prompt ?? "",
		);
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
	const selectedSkills = Object.fromEntries(
		workspace.skills
			.filter((skill) => skill.projects.includes(project.id))
			.map((skill) => [skill.id, data.skills[skill.id] ?? true]),
	);
	const catalog = workspace.skills.map(
		(skill) => skills.find((authored) => authored.id === skill.id) ?? skill,
	);

	function showSection(next: ProjectNavValue) {
		if (operation.current) return;
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

	async function saveBranding() {
		if (!data.stagedBranding) return;
		const branding = {
			...stagedBranding,
			name: stagedBranding.name.trim(),
			company: stagedBranding.company.trim(),
		};
		if (!branding.name || !branding.company) return;
		await onSaveDraft({
			builder: recordVersion(
				{ ...data, branding, stagedBranding: undefined },
				"Updated branding",
			),
			published,
			updated: "Edited just now",
			name: branding.name,
			company: branding.company,
			cover: branding.cover,
		});
	}

	function selectConversation(id: string) {
		setConversationId(id);
		showSection("Chat");
	}

	function newConversation() {
		if (operation.current || committing) return;
		const id = crypto.randomUUID();
		change({
			...data,
			conversations: [
				...data.conversations,
				{ id, title: "New chat", messages: [] },
			],
		});
		selectConversation(id);
	}

	async function deleteConversation(id: string) {
		if (operation.current || committing)
			throw new Error(
				"Wait for the current update to finish before deleting a conversation.",
			);
		const current = latestData.current;
		const conversations = current.conversations.filter(
			(item) => item.id !== id,
		);
		if (conversations.length === current.conversations.length) return;
		await onSaveDraft({ builder: { ...current, conversations } });
		if (request?.conversationId === id) setRequest(undefined);
		setUnsavedMessages((current) => {
			const next = { ...current };
			delete next[id];
			return next;
		});
		if (activeConversation?.id === id)
			setConversationId(conversations[0]?.id ?? "");
	}

	function stopChat() {
		if (committing) return;
		operation.current?.abort();
		operation.current = null;
		setRequest((current) =>
			current ? { ...current, state: "stopped", error: undefined } : undefined,
		);
	}

	async function runChat(text: string, retry = false) {
		if (operation.current || committing) return;
		const current = latestData.current;
		const existing = retry ? request : undefined;
		const id =
			existing?.conversationId ??
			activeConversation?.id ??
			request?.conversationId ??
			crypto.randomUUID();
		const message = existing?.message ?? {
			id: crypto.randomUUID(),
			role: "you" as const,
			text,
		};
		const pendingMessages = retry
			? (unsavedMessages[id] ?? [message])
			: [...(unsavedMessages[id] ?? []), message];
		setUnsavedMessages((current) => ({ ...current, [id]: pendingMessages }));
		const controller = new AbortController();
		operation.current = controller;
		setRequest({ conversationId: id, message, state: "working" });
		try {
			const configuration = {
				branding: current.branding,
				instructions: current.instructions,
				skills: current.skills,
				destination: current.destination,
				skillNotes: current.skillNotes,
			};
			const result = onBuild
				? await onBuild(message.text, configuration, controller.signal)
				: {
						configuration: {
							...configuration,
							instructions: `${current.instructions}\n\n## Builder direction\n${message.text}`,
						},
						reply:
							"Saved this direction to your draft instructions. Review it before publishing.",
					};
			if (controller.signal.aborted) return;
			setCommitting(true);
			const conversation = current.conversations.find(
				(item) => item.id === id,
			) ?? { id, title: "New chat", messages: [] };
			const nextConversation = {
				...conversation,
				title: conversation.messages.length
					? conversation.title
					: message.text.split("\n", 1)[0]?.trim() || "New chat",
				messages: [
					...conversation.messages,
					...pendingMessages,
					{
						id: crypto.randomUUID(),
						role: "agent" as const,
						text: result.reply,
					},
				],
			};
			const conversations = current.conversations.some((item) => item.id === id)
				? current.conversations.map((item) =>
						item.id === id ? nextConversation : item,
					)
				: [...current.conversations, nextConversation];
			await onSaveDraft({
				builder: recordVersion(
					{ ...current, ...result.configuration, conversations },
					"Updated from a conversation",
				),
				updated: "Edited just now",
			});
			setConversationId(id);
			setRequest(undefined);
			setUnsavedMessages((current) => {
				const next = { ...current };
				delete next[id];
				return next;
			});
		} catch (error) {
			if (!controller.signal.aborted)
				setRequest({
					conversationId: id,
					message,
					state: "error",
					error:
						error instanceof Error
							? error.message
							: "The update could not be saved. Try again.",
				});
		} finally {
			if (operation.current === controller) {
				operation.current = null;
				setCommitting(false);
			}
		}
	}

	function submitChat(text: string) {
		void runChat(text);
	}

	function completeFirstDraft() {
		bindSkills(Object.keys(data.skills), false);
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
		if (enabled) bindSkills([id], false);
		save(
			{ ...data, skills: { ...selectedSkills, [id]: enabled } },
			"Updated project skills",
		);
	}

	function restore(version: BuilderVersion) {
		const configuration = version.configuration;
		bindSkills(Object.keys(configuration.skills), true);
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

	function bindSkills(ids: string[], replace: boolean) {
		setWorkspace((current) => ({
			...current,
			skills: current.skills.map((skill) => {
				const hasProject = skill.projects.includes(project.id);
				if (ids.includes(skill.id) && !hasProject) {
					return { ...skill, projects: [...skill.projects, project.id] };
				}
				if (replace && hasProject && !ids.includes(skill.id)) {
					return {
						...skill,
						projects: skill.projects.filter((id) => id !== project.id),
					};
				}
				return skill;
			}),
		}));
	}

	function publish(audience: string, requireSignIn: boolean) {
		if (dirty || working || busy) return;
		change(data, {
			status: "Published",
			published: { ...snapshot(data), audience, requireSignIn },
		});
		setOverlay(undefined);
		setManage(true);
	}

	function openVisitor(isLive: boolean) {
		if (onOpenVisitor) onOpenVisitor(project.id, isLive);
		else setOverlay({ type: "preview", published: isLive });
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
				onDeleteConversation={deleteConversation}
				conversations={data.conversations.map((conversation) => ({
					id: conversation.id,
					title: conversation.title,
					selected:
						section === "Chat" && conversation.id === activeConversation?.id,
				}))}
			/>
			<main className="ap-builder-main">
				<div className="ap-builder-mobile-actions">
					<MenuPopover
						trigger={
							<Button variant="ghost" icon={<Icon name="message-square" />}>
								Conversations
							</Button>
						}
					>
						{(dismiss) => (
							<MenuPanel
								title="Conversations"
								className="ap-builder-conversation-menu"
								onClose={dismiss}
							>
								<nav
									className="ap-menu-list"
									aria-label="Project conversations"
								>
									<MenuItem
										label="New chat"
										icon="plus"
										onClick={() => {
											dismiss();
											newConversation();
										}}
									/>
									<ConversationList
										conversations={data.conversations.map((item) => ({
											...item,
											selected: item.id === activeConversation?.id,
										}))}
										onSelect={(id) => {
											dismiss();
											selectConversation(id);
										}}
										onDelete={deleteConversation}
									/>
								</nav>
							</MenuPanel>
						)}
					</MenuPopover>
					<Button
						variant="ghost"
						icon={<Icon name="users" />}
						onClick={() => onSettings("Staff & roles")}
					>
						Project access
					</Button>
				</div>
				<ProjectToolbar
					name={project.name}
					saved={!dirty && !busy}
					status={draftChanges ? "changes" : live ? "published" : "draft"}
					publishDisabled={working || busy}
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
						<BuilderSplit
							view={view}
							previewShare={previewShare}
							onPreviewShareChange={setPreviewShare}
							preview={
								section === "Chat" && working ? (
									<BuilderProgress
										onReady={completeFirstDraft}
										usesWebsite={usesWebsite}
									/>
								) : (
									<BuilderVisitorPreview
										onReply={visitorReply}
										initialMessages={initialVisitorMessages}
										initialSuggestions={initialVisitorSuggestions}
										branding={
											section === "Branding" ? stagedBranding : data.branding
										}
										onOpenExternal={() => openVisitor(false)}
									/>
								)
							}
						>
							{section === "Chat" ? (
								<BuilderChat
									key={activeConversation?.id}
									conversation={
										activeConversation
											? {
													...activeConversation,
													messages: [
														...activeConversation.messages,
														...(unsavedMessages[activeConversation.id] ?? []),
													],
												}
											: request
												? {
														id: request.conversationId,
														title: "New chat",
														messages:
															unsavedMessages[request.conversationId] ?? [],
													}
												: undefined
									}
									requestState={
										request &&
										(request.conversationId === activeConversation?.id ||
											!activeConversation)
											? request.state
											: undefined
									}
									requestError={request?.error}
									onRetry={() => {
										if (request) void runChat(request.message.text, true);
									}}
									onStop={committing ? undefined : stopChat}
									submitting={busy}
									onPreview={() => setView("preview")}
									working={working}
									usesWebsite={usesWebsite}
									sources={project.sources}
									defaultModelMode={project.modelMode}
									destination={data.destination}
									onSubmit={submitChat}
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
									saved={!data.stagedBranding}
									onChange={stageBranding}
									onSave={saveBranding}
									onBack={() => showSection("Chat")}
								/>
							)}
						</BuilderSplit>
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
						catalog={catalog}
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
					ready={!dirty && !working && !busy}
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
					{catalog
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
						catalog.length && (
						<p>All workspace skills are enabled in this project.</p>
					)}
				</BuilderDialog>
			)}
			{overlay?.type === "configure" && (
				<BuilderDialog
					title={
						catalog.find((skill) => skill.id === overlay.id)?.name ??
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
					<BuilderVisitorPreview
						branding={
							overlay.published ? (published ?? data.branding) : stagedBranding
						}
						standalone
						published={overlay.published}
					/>
				</BuilderDialog>
			)}
		</div>
	);
}

function sameBranding(left: BrandingDraft, right: BrandingDraft) {
	return Object.keys({ ...left, ...right }).every(
		(key) =>
			left[key as keyof BrandingDraft] === right[key as keyof BrandingDraft],
	);
}

function snapshot(data: BuilderData): PublishedSnapshot {
	return { ...data.branding, versionId: data.versions[0]?.id };
}
