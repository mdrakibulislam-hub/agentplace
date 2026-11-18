import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import type { PrototypeProject } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import { coverFixture } from "./branding-story-fixtures";
import {
	BuilderExperience,
	type BuilderExperienceProps,
} from "./builder-experience";
import { initialBuilderData } from "./builder-model";

const base: PrototypeProject = {
	id: "whiteframe-advisor",
	name: "WhiteFrame Advisor",
	company: "WhiteFrame Creative",
	status: "Unpublished",
	updated: "Edited 2 hours ago",
	prompt:
		"Create an advisor for whiteframe.agency that recommends services and collects project enquiries.",
};

const authoredData = initialBuilderData(base);
const configuration = {
	branding: authoredData.branding,
	instructions: authoredData.instructions.replace(
		"# WhiteFrame Advisor",
		"# WhiteFrame Project Advisor",
	),
	skills: authoredData.skills,
};
const authoredVersions = [
	{
		id: 4,
		title: "Updated company branding",
		meta: "Today, 11:15 · Rakib",
		configuration,
	},
	{
		id: 3,
		title: "Published service advisor",
		meta: "Today, 10:40 · Rakib",
		configuration,
	},
	{
		id: 2,
		title: "Added enquiry collection",
		meta: "Today, 10:25 · Maya",
		configuration,
	},
	{
		id: 1,
		title: "Created from website",
		meta: "Today, 10:12 · Rakib",
		configuration,
	},
];
const ready = {
	...base,
	builder: {
		...authoredData,
		...configuration,
		conversations: authoredData.conversations.map((conversation) => ({
			...conversation,
			title: "Build project advisor",
		})),
		versions: authoredVersions.slice(1),
	},
};
const withCover = {
	...ready,
	cover: coverFixture,
	builder: {
		...ready.builder,
		branding: { ...ready.builder.branding, cover: coverFixture },
	},
};
const published: PrototypeProject = {
	...ready,
	status: "Published",
	builder: { ...ready.builder, versions: authoredVersions },
	published: { ...authoredData.branding, versionId: 3 },
	liveUrl: "whiteframe.run.agentplace.io",
};

type FixtureProps = Omit<
	BuilderExperienceProps,
	"onProjectChange" | "onSaveDraft" | "onBack" | "onSettings"
> & {
	failSaveOnce?: boolean;
	failReplyOnce?: boolean;
	onPersist?: (updates: Partial<PrototypeProject>) => void;
};
function BuilderFixture({
	project: initialProject,
	failSaveOnce = false,
	failReplyOnce = false,
	onPersist,
	...args
}: FixtureProps) {
	const [project, setProject] = useState(initialProject);
	const attemptedSave = useRef(false);
	const attemptedReply = useRef(false);
	return (
		<>
			<WorkspaceHeader
				projects={[project]}
				currentProjectId={project.id}
				showProjectName
				onProject={() => undefined}
				onProjects={() => undefined}
				onCreate={() => undefined}
				onSettings={() => undefined}
				onBilling={() => undefined}
				onSignOut={() => undefined}
			/>
			<BuilderExperience
				{...args}
				visitorReply={
					failReplyOnce
						? async () => {
								if (!attemptedReply.current) {
									attemptedReply.current = true;
									throw new Error("Your message is still here.");
								}
								return {
									text: "Happy to help. What would you like your new website to do better?",
								};
							}
						: args.visitorReply
				}
				project={project}
				onProjectChange={(updates) =>
					setProject((current) => ({ ...current, ...updates }))
				}
				onSaveDraft={async (updates) => {
					if (failSaveOnce && !attemptedSave.current) {
						attemptedSave.current = true;
						throw new Error("Couldn’t save. Try again.");
					}
					onPersist?.(updates);
					setProject((current) => ({ ...current, ...updates }));
				}}
				onBack={() => undefined}
				onSettings={() => undefined}
			/>
		</>
	);
}

const meta = {
	title: "Product/Agent builder",
	component: BuilderFixture,
	parameters: { layout: "fullscreen" },
	args: { project: ready },
} satisfies Meta<typeof BuilderFixture>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CreatingDraft: Story = {
	args: { project: { ...base, needsFirstDraft: true } },
	parameters: { design: figma("54:1385"), figmaNodeId: "54:1385" },
};

export const ChatAndPreview: Story = {
	parameters: { design: figma("54:1624"), figmaNodeId: "54:1624" },
};

export const Instructions: Story = {
	args: { initialSection: "Instructions.md" },
	parameters: { design: figma("57:1158"), figmaNodeId: "57:1158" },
};

export const ProjectSkills: Story = {
	args: { initialSection: "Skills" },
	parameters: { design: figma("57:1400"), figmaNodeId: "57:1400" },
};

export const VersionHistory: Story = {
	args: { initialSection: "History", project: published },
	parameters: { design: figma("57:1664"), figmaNodeId: "57:1664" },
};

export const BrandingWithoutCover: Story = {
	args: { initialSection: "Branding" },
	parameters: { design: figma("135:6409"), figmaNodeId: "135:6409" },
};

export const BrandingWithCover: Story = {
	args: { initialSection: "Branding", project: withCover },
	parameters: { design: figma("54:1876"), figmaNodeId: "54:1876" },
};

export const ReplaceOrRemoveCover: Story = {
	args: {
		initialSection: "Branding",
		initialCoverMenu: true,
		project: withCover,
	},
	parameters: { design: figma("140:4811"), figmaNodeId: "140:4811" },
};

export const ReviewAndPublish: Story = {
	args: {
		project: { ...ready, liveUrl: "whiteframe.run.agentplace.io" },
		initialPublishAction: "publish",
	},
	parameters: { design: figma("57:1936"), figmaNodeId: "57:1936" },
};

export const PublishedWithDraftChanges: Story = {
	args: { project: published, initialManagePublish: true },
	parameters: { design: figma("57:2270"), figmaNodeId: "57:2270" },
};

export const UnpublishConfirmation: Story = {
	args: {
		project: {
			...published,
			published: { ...published.published, name: published.name, versionId: 4 },
		},
		initialPublishAction: "unpublish",
	},
	parameters: { design: figma("57:2585"), figmaNodeId: "57:2585" },
};

const builderMessages = [
	{
		id: "request-1",
		role: "you" as const,
		text: "Make the welcome message shorter and more conversational.",
	},
	{
		id: "response-1",
		role: "agent" as const,
		text: "Done. The welcome now gets straight to the point and invites visitors to tell us what they need.",
	},
	{
		id: "request-2",
		role: "you" as const,
		text: "Ask what they want to improve before suggesting a service.",
	},
	{
		id: "response-2",
		role: "agent" as const,
		text: "Updated. The agent now asks about the visitor’s goal first, then suggests a relevant service.",
	},
];
const visitorMessages = [
	{
		id: "visitor-1",
		role: "you" as const,
		text: "We’re planning a website redesign.",
	},
	{
		id: "agent-1",
		role: "agent" as const,
		text: "Happy to help. What would you like your new website to do better?",
	},
	{
		id: "visitor-2",
		role: "you" as const,
		text: "Explain our services more clearly and bring in better enquiries.",
	},
	{
		id: "agent-2",
		role: "agent" as const,
		text: "A clearer service structure and enquiry flow sound like a good fit.\n\nDo you already have a website we can look at?",
	},
];
const conversationProject = {
	...ready,
	builder: {
		...ready.builder,
		conversations: [
			{ id: "refine", title: "Refine conversation", messages: builderMessages },
		],
	},
};
const conversationArgs = {
	project: conversationProject,
	initialVisitorMessages: visitorMessages,
	initialVisitorSuggestions: ["Yes, I have a website", "Starting from scratch"],
};

export const BothConversations: Story = {
	args: conversationArgs,
	parameters: { design: figma("317:6616"), figmaNodeId: "317:6616" },
};

const waitForAbort = (
	_text: string,
	_configuration: unknown,
	signal: AbortSignal,
): Promise<never> =>
	new Promise((_resolve, reject) =>
		signal.addEventListener(
			"abort",
			() => reject(new DOMException("Aborted", "AbortError")),
			{ once: true },
		),
	);
const pendingBuilderProject = {
	...conversationProject,
	builder: {
		...conversationProject.builder,
		conversations: [
			{
				id: "refine",
				title: "Refine conversation",
				messages: builderMessages.slice(0, 2),
			},
		],
	},
};
export const BuilderUpdating: Story = {
	args: {
		...conversationArgs,
		project: pendingBuilderProject,
		onBuild: waitForAbort,
	},
	parameters: { design: figma("317:6647"), figmaNodeId: "317:6647" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Message your agent builder" }),
			builderMessages[2].text,
		);
		await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
		await expect(await canvas.findByText("Updating your agent")).toBeVisible();
		await expect(
			canvas.getByRole("button", { name: "Publish" }),
		).toBeDisabled();
	},
};
export const BuilderRetry: Story = {
	args: {
		...conversationArgs,
		project: pendingBuilderProject,
		failSaveOnce: true,
		onPersist: fn(),
	},
	parameters: { design: figma("317:6678"), figmaNodeId: "317:6678" },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Message your agent builder" }),
			builderMessages[2].text,
		);
		await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
		await expect(
			await canvas.findByText("I couldn’t finish this update."),
		).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		await expect(
			await canvas.findByText(
				"Saved this direction to your draft instructions. Review it before publishing.",
			),
		).toBeVisible();
		await expect(canvas.getAllByText(builderMessages[2].text)).toHaveLength(1);
		await expect(args.onPersist).toHaveBeenCalledOnce();
	},
};
export const BuilderStop: Story = {
	args: {
		...conversationArgs,
		project: pendingBuilderProject,
		onBuild: waitForAbort,
		onPersist: fn(),
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Message your agent builder" }),
			builderMessages[2].text,
		);
		await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
		await userEvent.click(
			canvas.getAllByRole("button", { name: "Stop editing" })[0],
		);
		await expect(await canvas.findByText("Editing stopped.")).toBeVisible();
		await expect(args.onPersist).not.toHaveBeenCalled();
		await expect(canvas.getByRole("button", { name: "Publish" })).toBeEnabled();
	},
};

export const VisitorReplying: Story = {
	args: {
		...conversationArgs,
		initialVisitorMessages: visitorMessages.slice(0, 2),
		initialVisitorSuggestions: [],
		visitorReply: waitForAbort,
	},
	parameters: { design: figma("317:6709"), figmaNodeId: "317:6709" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Ask your agent a question" }),
			visitorMessages[2].text,
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Send question" }),
		);
		await expect(await canvas.findByText("Replying…")).toBeVisible();
		await expect(canvas.getByRole("button", { name: "Publish" })).toBeEnabled();
	},
};
export const VisitorRetryAndReset: Story = {
	args: {
		...conversationArgs,
		initialVisitorMessages: [],
		initialVisitorSuggestions: [],
		failReplyOnce: true,
	},
	parameters: { design: figma("317:6740"), figmaNodeId: "317:6740" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Ask your agent a question" }),
			visitorMessages[0].text,
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Send question" }),
		);
		await expect(
			await canvas.findByText("I couldn’t finish this reply."),
		).toBeVisible();
		await expect(
			canvas.queryByText("What are you working on?"),
		).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		await expect(
			await canvas.findByText(visitorMessages[1].text),
		).toBeVisible();
		await expect(canvas.getAllByText(visitorMessages[0].text)).toHaveLength(1);
		await userEvent.click(
			canvas.getByRole("button", { name: "Start new visitor conversation" }),
		);
		await expect(
			await canvas.findByText("What are you working on?"),
		).toBeVisible();
		await expect(
			canvas.queryByText(visitorMessages[0].text),
		).not.toBeInTheDocument();
	},
};
export const VisitorStop: Story = {
	args: {
		...conversationArgs,
		initialVisitorMessages: [],
		initialVisitorSuggestions: [],
		visitorReply: waitForAbort,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("textbox", { name: "Ask your agent a question" }),
			visitorMessages[0].text,
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Send question" }),
		);
		await userEvent.click(
			await canvas.findByRole("button", { name: "Stop reply" }),
		);
		await expect(await canvas.findByText("Reply stopped.")).toBeVisible();
		await expect(canvas.getAllByText(visitorMessages[0].text)).toHaveLength(1);
	},
};

export const ConversationDeletion: Story = {
	args: {
		...conversationArgs,
		project: {
			...conversationProject,
			published: published.published,
			builder: {
				...conversationProject.builder,
				conversations: [
					...conversationProject.builder.conversations,
					{ id: "followup", title: "Follow up", messages: [] },
				],
			},
		},
		onPersist: fn(),
	},
	parameters: { design: figma("325:348"), figmaNodeId: "325:348" },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const popup = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", {
			name: "Delete conversation “Follow up”",
		});
		await userEvent.tab();
		trigger.focus();
		await userEvent.click(trigger);
		const dialog = await popup.findByRole("dialog", {
			name: "Delete conversation?",
		});
		await waitFor(() =>
			expect(
				within(dialog).getByRole("button", { name: "Cancel" }),
			).toHaveFocus(),
		);
		await expect(
			within(dialog).getByText(/Permanently delete “Follow up”/),
		).toBeVisible();
		await userEvent.click(
			within(dialog).getByRole("button", { name: "Cancel" }),
		);
		await waitFor(() => expect(trigger).toHaveFocus());
		await expect(args.onPersist).not.toHaveBeenCalled();
		await userEvent.click(trigger);
		await userEvent.click(
			await popup.findByRole("button", {
				name: "Delete conversation",
			}),
		);
		await waitFor(() =>
			expect(
				canvas.queryByRole("button", { name: "Follow up" }),
			).not.toBeInTheDocument(),
		);
		await expect(
			canvas.getByRole("button", { name: "Refine conversation" }),
		).toHaveAttribute("aria-current", "true");
		await expect(args.onPersist).toHaveBeenLastCalledWith({
			builder: {
				...args.project.builder,
				conversations: [args.project.builder?.conversations[0]],
			},
		});
		await waitFor(() =>
			expect(canvas.getByRole("button", { name: "New chat" })).toHaveFocus(),
		);
	},
};
export const DeleteLastConversationWithRetry: Story = {
	args: { ...conversationArgs, failSaveOnce: true, onPersist: fn() },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const popup = within(canvasElement.ownerDocument.body);
		canvas
			.getByRole("button", {
				name: "Delete conversation “Refine conversation”",
			})
			.focus();
		await userEvent.click(
			canvas.getByRole("button", {
				name: "Delete conversation “Refine conversation”",
			}),
		);
		await userEvent.click(
			await popup.findByRole("button", {
				name: "Delete conversation",
			}),
		);
		await expect(await popup.findByRole("alert")).toHaveTextContent(
			"Couldn’t save. Try again.",
		);
		await expect(
			canvas.getByRole("button", { name: "Refine conversation", hidden: true }),
		).toBeInTheDocument();
		await userEvent.click(
			popup.getByRole("button", { name: "Delete conversation" }),
		);
		await waitFor(() =>
			expect(
				canvas.queryByRole("button", {
					name: "Refine conversation",
				}),
			).not.toBeInTheDocument(),
		);
		await expect(args.onPersist).toHaveBeenLastCalledWith({
			builder: { ...args.project.builder, conversations: [] },
		});
		await userEvent.click(canvas.getByRole("button", { name: "New chat" }));
		await expect(
			canvas.getAllByRole("button", { name: "New chat" })[1],
		).toBeVisible();
	},
};
