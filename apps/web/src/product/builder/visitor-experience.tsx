import { AgentPreview } from "@agentplace/ui/components/ap-builder";
import {
	type ChatMessage,
	ConversationJump,
	ConversationMessage,
	ConversationStatus,
} from "@agentplace/ui/components/ap-conversation";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { Button } from "@agentplace/ui/components/button";
import { useConversationScroll } from "@agentplace/ui/hooks/use-conversation-scroll";
import {
	type CSSProperties,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import type { PrototypeProject } from "../prototype-data";
import {
	type BrandingDraft,
	initialBuilderData,
	type PublishedSnapshot,
	previewDescription,
	previewSuggestions,
} from "./builder-model";
import { BuilderDialog } from "./builder-primitives";
import "./builder.css";
import "./visitor-experience.css";

type VisitorBranding = BrandingDraft | PublishedSnapshot;
export type VisitorReply = (
	question: string,
	history: ChatMessage[],
	signal: AbortSignal,
) => Promise<{ text: string; suggestions?: string[] }>;

/** Local prototype only. A live runtime can supply onReply without changing the UI. */
const prototypeReply: VisitorReply = async (question) => {
	if (/website|web design/i.test(question))
		return {
			text: "Are you starting a new website or redesigning an existing one?",
		};
	if (/ux|product|research/i.test(question))
		return { text: "What part of the product would you like to improve?" };
	return {
		text: "Tell me a little about your project and what you’d like to achieve.",
	};
};

export function BuilderVisitorPreview({
	branding,
	standalone = false,
	published = false,
	onOpenExternal,
	onReply = prototypeReply,
	initialMessages = [],
	initialSuggestions = [],
}: {
	branding: VisitorBranding;
	standalone?: boolean;
	published?: boolean;
	onOpenExternal?: () => void;
	onReply?: VisitorReply;
	initialMessages?: ChatMessage[];
	initialSuggestions?: string[];
}) {
	const [mobile, setMobile] = useState(false);
	const [call, setCall] = useState<"setup" | "demo">();
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [initialMessageIds] = useState(
		() => new Set(initialMessages.map(({ id }) => id)),
	);
	const [suggestedReplies, setSuggestedReplies] =
		useState<string[]>(initialSuggestions);
	const [request, setRequest] = useState<{
		state: "working" | "error" | "stopped";
		message: ChatMessage;
		error?: string;
	}>();
	const operation = useRef<AbortController | null>(null);
	const composer = useRef<HTMLInputElement>(null);
	const endCall = useRef<HTMLButtonElement>(null);
	const latestMessage = messages.at(-1);
	const { listRef, canScroll, onScroll, showJump, followLatest, jumpToLatest } =
		useConversationScroll(
			latestMessage
				? `${latestMessage.id}:${request?.state ?? "idle"}`
				: undefined,
		);
	useEffect(() => () => operation.current?.abort(), []);
	useLayoutEffect(() => {
		if (call === "demo") endCall.current?.focus();
	}, [call]);
	const company = branding.company?.trim() || branding.name;
	const displayName = company.replace(/ Creative$/, "") || branding.name;
	const colors = {
		"--ap-visitor-accent": branding.color,
		"--ap-visitor-accent-text": contrastText(branding.color),
	} as CSSProperties;

	async function reply(question: string, retry = false) {
		if (operation.current) return;
		followLatest();
		const message =
			retry && request
				? request.message
				: { id: crypto.randomUUID(), role: "you" as const, text: question };
		const history = retry ? messages : [...messages, message];
		if (!retry) setMessages(history);
		const controller = new AbortController();
		operation.current = controller;
		setRequest({ state: "working", message });
		setSuggestedReplies([]);
		try {
			const response = await onReply(message.text, history, controller.signal);
			if (controller.signal.aborted) return;
			if (!response?.text?.trim())
				throw new Error("The agent returned an empty reply. Try again.");
			const suggestions = [
				...new Set(
					response.suggestions?.map((text) => text.trim()).filter(Boolean),
				),
			];
			setMessages((current) => [
				...current,
				{ id: crypto.randomUUID(), role: "agent", text: response.text },
			]);
			setSuggestedReplies(suggestions);
			setRequest(undefined);
		} catch (error) {
			if (!controller.signal.aborted)
				setRequest({
					state: "error",
					message,
					error: error instanceof Error ? error.message : undefined,
				});
		} finally {
			if (operation.current === controller) operation.current = null;
		}
	}
	function stop() {
		if (!operation.current) return;
		operation.current.abort();
		operation.current = null;
		setRequest((current) =>
			current ? { ...current, state: "stopped", error: undefined } : undefined,
		);
	}
	function reset() {
		operation.current?.abort();
		operation.current = null;
		followLatest();
		setMessages([]);
		setRequest(undefined);
		setSuggestedReplies([]);
	}

	function replyFromTranscript(question: string, retry = false) {
		composer.current?.focus({ preventScroll: true });
		void reply(question, retry);
	}

	return (
		<div
			className={`ap-builder-visitor ${standalone ? "ap-builder-visitor-standalone" : ""}`}
			data-device={mobile ? "mobile" : "desktop"}
			data-appearance={branding.appearance ?? "light"}
			data-typography={branding.typography ?? "SF Pro"}
			data-conversation={Boolean(latestMessage) || undefined}
			data-ap-enter=""
			style={colors}
		>
			<AgentPreview
				company={company}
				agentName={branding.name}
				conversation={messages.length > 0}
				onReset={reset}
				onStop={stop}
				submitting={request?.state === "working"}
				inputRef={composer}
				companyInitials={displayName.slice(0, 1).toUpperCase()}
				companyLogo={branding.companyLogo}
				title="What are you working on?"
				description={previewDescription(displayName)}
				suggestions={previewSuggestions()}
				coverImage={branding.cover}
				device={mobile ? "Mobile" : "Desktop"}
				mode={published ? "public" : standalone ? "standalone" : "test"}
				onDevice={() => setMobile((current) => !current)}
				onOpenExternal={onOpenExternal}
				onSend={(question) => {
					void reply(question);
				}}
				onCall={() => setCall("setup")}
			>
				{latestMessage && (
					<div className="ap-conversation-scroll-area">
						<div
							ref={listRef}
							className="ap-visitor-transcript"
							role="log"
							aria-label="Visitor conversation"
							tabIndex={canScroll ? 0 : -1}
							onScroll={onScroll}
						>
							{messages.map((message) => (
								<ConversationMessage
									key={message.id}
									{...message}
									speaker={message.role}
									experience="visitor"
									name={branding.name}
									avatar={branding.avatar}
									entering={!initialMessageIds.has(message.id)}
								/>
							))}
							{request?.state === "working" ? (
								<ConversationMessage
									speaker="agent"
									text=""
									experience="visitor"
									name={branding.name}
									avatar={branding.avatar}
									entering
								>
									<ConversationStatus experience="visitor" state="working" />
								</ConversationMessage>
							) : (
								request && (
									<ConversationStatus
										experience="visitor"
										state={request.state}
										error={request.error}
										onRetry={() =>
											replyFromTranscript(request.message.text, true)
										}
									/>
								)
							)}
							{suggestedReplies.length > 0 && (
								<fieldset
									className="ap-chat-reply-chips"
									aria-label="Suggested replies"
									data-ap-enter="message"
								>
									{suggestedReplies.map((text) => (
										<button
											type="button"
											key={text}
											onClick={() => replyFromTranscript(text)}
										>
											{text}
										</button>
									))}
								</fieldset>
							)}
						</div>
						{showJump && <ConversationJump onClick={jumpToLatest} />}
					</div>
				)}
			</AgentPreview>
			{call && (
				<BuilderDialog
					title={
						published
							? "Call unavailable"
							: call === "setup"
								? `Call ${branding.name}`
								: "Test call controls"
					}
					description={
						published
							? "Voice calls are unavailable for this agent. You can continue in chat."
							: call === "setup"
								? "Try the controls in a simulated voice call."
								: "You’re previewing the controls for a simulated voice call."
					}
					onClose={() => setCall(undefined)}
				>
					<div className="ap-builder-dialog-actions">
						<Button
							data-initial-focus
							ref={endCall}
							variant="secondary"
							size="medium"
							onClick={() => setCall(undefined)}
						>
							{published
								? "Done"
								: call === "setup"
									? "Cancel"
									: "End test call"}
						</Button>
						{!published && call === "setup" && (
							<Button
								size="medium"
								icon={<Icon name="phone" />}
								onClick={() => setCall("demo")}
							>
								Start test call
							</Button>
						)}
					</div>
				</BuilderDialog>
			)}
		</div>
	);
}

export function VisitorExperience({
	project,
	published = true,
}: {
	project: PrototypeProject;
	published?: boolean;
}) {
	const data = initialBuilderData(project);
	const branding = published
		? (project.published ?? data.branding)
		: (data.stagedBranding ?? data.branding);
	return (
		<main className="ap-builder-visitor-page">
			<BuilderVisitorPreview
				branding={branding}
				standalone
				published={published}
			/>
		</main>
	);
}

function contrastText(color?: string) {
	if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return undefined;
	function linearChannel(hex: string) {
		const channel = Number.parseInt(hex, 16) / 255;
		return channel <= 0.04045
			? channel / 12.92
			: ((channel + 0.055) / 1.055) ** 2.4;
	}
	const luminance =
		0.2126 * linearChannel(color.slice(1, 3)) +
		0.7152 * linearChannel(color.slice(3, 5)) +
		0.0722 * linearChannel(color.slice(5, 7));
	return luminance >= 0.179
		? "var(--ap-primitive-color-000000)"
		: "var(--ap-primitive-color-ffffff)";
}
