import { AgentPreview } from "@agentplace/ui/components/ap-builder";
import {
	type ChatMessage,
	ConversationMessage,
	ConversationStatus,
} from "@agentplace/ui/components/ap-conversation";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { useMotionEnvironment } from "@agentplace/ui/components/ap-motion";
import { Button } from "@agentplace/ui/components/button";
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
	const [call, setCall] = useState<"setup" | "connected">();
	const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
	const [suggestedReplies, setSuggestedReplies] =
		useState<string[]>(initialSuggestions);
	const [request, setRequest] = useState<{
		state: "working" | "error" | "stopped";
		message: ChatMessage;
		error?: string;
	}>();
	const operation = useRef<AbortController | null>(null);
	const transcript = useRef<HTMLDivElement>(null);
	const { reduced } = useMotionEnvironment();
	useEffect(() => () => operation.current?.abort(), []);
	useLayoutEffect(() => {
		if (messages.length && transcript.current && !reduced)
			transcript.current.scrollTop = transcript.current.scrollHeight;
	}, [messages, reduced]);
	const company = branding.company ?? branding.name;
	const companyLabel = company.replace(/ Creative$/, "");
	const displayName = companyLabel || branding.name;
	const colors = {
		"--ap-visitor-accent": branding.color,
		"--ap-visitor-accent-text": contrastText(branding.color),
	} as CSSProperties;

	async function reply(question: string, retry = false) {
		if (operation.current) return;
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
			setMessages((current) => [
				...current,
				{ id: crypto.randomUUID(), role: "agent", text: response.text },
			]);
			setSuggestedReplies(response.suggestions ?? []);
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
		operation.current?.abort();
		operation.current = null;
		setRequest((current) =>
			current ? { ...current, state: "stopped", error: undefined } : undefined,
		);
	}
	function reset() {
		operation.current?.abort();
		operation.current = null;
		setMessages([]);
		setRequest(undefined);
		setSuggestedReplies([]);
	}

	return (
		<div
			className={`ap-builder-visitor ${standalone ? "ap-builder-visitor-standalone" : ""}`}
			data-device={mobile ? "mobile" : "desktop"}
			data-appearance={branding.appearance ?? "light"}
			data-typography={branding.typography ?? "SF Pro"}
			style={colors}
		>
			<AgentPreview
				company={messages.length ? company : displayName.toUpperCase()}
				agentName={branding.name}
				conversation={messages.length > 0}
				onReset={reset}
				onStop={stop}
				submitting={request?.state === "working"}
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
				{messages.length > 0 && (
					<div
						ref={transcript}
						className="ap-visitor-transcript"
						role="log"
						aria-label="Visitor conversation"
					>
						{messages.map((message) => (
							<ConversationMessage
								key={message.id}
								{...message}
								speaker={message.role}
								experience="visitor"
								name={branding.name}
								avatar={branding.avatar}
							/>
						))}
						{request?.state === "working" ? (
							<ConversationMessage
								speaker="agent"
								text=""
								experience="visitor"
								name={branding.name}
								avatar={branding.avatar}
							>
								<ConversationStatus experience="visitor" state="working" />
							</ConversationMessage>
						) : (
							request && (
								<ConversationStatus
									experience="visitor"
									state={request.state}
									error={request.error}
									onRetry={() => {
										void reply(request.message.text, true);
									}}
								/>
							)
						)}
						{suggestedReplies.length > 0 && (
							<div className="ap-chat-reply-chips">
								{suggestedReplies.map((text) => (
									<button
										type="button"
										key={text}
										onClick={() => {
											void reply(text);
										}}
									>
										{text}
									</button>
								))}
							</div>
						)}
					</div>
				)}
			</AgentPreview>
			{call && (
				<BuilderDialog
					title={
						call === "setup" ? `Call ${branding.name}` : "Test call started"
					}
					description={
						call === "setup"
							? "Try the call controls in the visitor experience."
							: "You’re previewing the call interface."
					}
					onClose={() => setCall(undefined)}
				>
					<div className="ap-builder-dialog-actions">
						<Button
							data-initial-focus
							variant="secondary"
							size="medium"
							onClick={() => setCall(undefined)}
						>
							{call === "setup" ? "Cancel" : "End call"}
						</Button>
						{call === "setup" && (
							<Button
								size="medium"
								icon={<Icon name="phone" />}
								onClick={() => setCall("connected")}
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
	const red = Number.parseInt(color.slice(1, 3), 16);
	const green = Number.parseInt(color.slice(3, 5), 16);
	const blue = Number.parseInt(color.slice(5, 7), 16);
	return (red * 299 + green * 587 + blue * 114) / 1000 > 145
		? "#18181B"
		: "#FFFFFF";
}
