import { AmbientBottomGradient } from "@agentplace/ui/components/ap-ambient";
import { ChatComposer } from "@agentplace/ui/components/ap-builder";
import {
	ConversationJump,
	ConversationMessage,
	ConversationStatus,
} from "@agentplace/ui/components/ap-conversation";
import { Badge } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import type { ModelMode } from "@agentplace/ui/components/ap-model-picker";
import {
	SOURCE_FILE_ACCEPT,
	sourceFileError,
} from "@agentplace/ui/components/ap-source-dialog";
import { Button } from "@agentplace/ui/components/button";
import { useConversationScroll } from "@agentplace/ui/hooks/use-conversation-scroll";
import { type ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import type { ProjectSource } from "../prototype-data";
import type { BuilderConversation } from "./builder-model";
import { BuilderNote } from "./builder-primitives";

export function BuilderChat({
	conversation,
	needsFirstDraft,
	submitting = false,
	requestState,
	requestError,
	onRetry,
	onStop,
	onPreview,
	onSubmit,
	onDestination,
	onSkipDestination,
	destination,
	sources = [],
	defaultModelMode,
	usesWebsite,
	focusOnMount,
	onFocusHandled,
}: {
	conversation?: BuilderConversation;
	needsFirstDraft: boolean;
	submitting?: boolean;
	requestState?: "working" | "error" | "stopped";
	requestError?: string;
	onRetry?: () => void;
	onStop?: () => void;
	onPreview?: () => void;
	onSubmit: (message: string, mode: ModelMode) => void;
	onDestination: () => void;
	onSkipDestination: () => void;
	destination?: string;
	sources?: ProjectSource[];
	defaultModelMode?: ModelMode;
	usesWebsite: boolean;
	focusOnMount?: boolean;
	onFocusHandled?: () => void;
}) {
	const [attachment, setAttachment] = useState<File>();
	const [attachmentError, setAttachmentError] = useState("");
	const [initialMessageIds] = useState(
		() => new Set(conversation?.messages.map(({ id }) => id)),
	);
	const file = useRef<HTMLInputElement>(null);
	const compose = useRef<HTMLDivElement>(null);
	const updates = conversation?.messages.slice(1) ?? [];
	const initial = conversation?.messages[0];
	const firstConversation = needsFirstDraft && conversation?.id === "build";
	const lastMessage = conversation?.messages.at(-1);
	const { listRef, onScroll, canScroll, showJump, followLatest, jumpToLatest } =
		useConversationScroll(`${lastMessage?.id ?? ""}:${requestState ?? ""}`);

	useLayoutEffect(() => {
		if (!focusOnMount) return;
		compose.current?.querySelector("textarea")?.focus({ preventScroll: true });
		onFocusHandled?.();
	}, [focusOnMount, onFocusHandled]);

	function selectFile(event: ChangeEvent<HTMLInputElement>) {
		const selected = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!selected) return;
		const error = sourceFileError(selected);
		if (error) {
			setAttachmentError(error);
			return;
		}
		setAttachmentError("");
		setAttachment(selected);
	}

	return (
		<section
			className="ap-builder-editor ap-builder-chat"
			aria-label="Conversation"
			data-ap-enter=""
		>
			<div className="ap-conversation-scroll-area">
				<div
					ref={listRef}
					onScroll={onScroll}
					tabIndex={canScroll ? 0 : -1}
					role="log"
					aria-label="Builder messages"
					className="ap-builder-chat-scroll"
				>
					<div className="ap-chat-thread">
						{!lastMessage && (
							<p className="ap-builder-small">
								Start this chat with a change you’d like to make to the draft.
							</p>
						)}
						{firstConversation && initial && (
							<>
								<Message speaker="you" text={initial.text} sources={sources} />
								<Message
									speaker="agent"
									text={
										usesWebsite
											? "Your project is saved with the website reference. Where should new enquiries be sent?"
											: "Your project brief is saved. Where should new enquiries be sent?"
									}
								/>

								{destination ? (
									<BuilderNote title="Enquiry destination">
										{destination}
									</BuilderNote>
								) : (
									<div className="ap-builder-quick-actions">
										<Button variant="secondary" onClick={onDestination}>
											Connect a destination
										</Button>
										<Button variant="ghost" onClick={onSkipDestination}>
											Set up later
										</Button>
									</div>
								)}
							</>
						)}
						{(firstConversation ? updates : conversation?.messages)?.map(
							(message) => (
								<Message
									key={message.id}
									speaker={message.role}
									text={message.text}
									entering={!initialMessageIds.has(message.id)}
								/>
							),
						)}
						<ConversationStatus
							state={
								requestState ??
								(conversation?.messages.at(-1)?.role === "agent"
									? "ready"
									: "idle")
							}
							error={requestError}
							onRetry={
								onRetry &&
								(() => {
									followLatest();
									onRetry();
								})
							}
							onStop={onStop}
							onPreview={onPreview}
						/>
					</div>
				</div>
				{showJump && <ConversationJump onClick={jumpToLatest} />}
			</div>
			<div ref={compose} className="ap-builder-chat-compose">
				{attachment && (
					<div className="ap-builder-attachment" data-ap-enter="message">
						<Icon name="file-text" />
						<span role="status">{attachment.name}</span>
						<button
							type="button"
							aria-label={`Remove attachment ${attachment.name}`}
							onClick={() => {
								setAttachment(undefined);
								compose.current
									?.querySelector("textarea")
									?.focus({ preventScroll: true });
							}}
						>
							<Icon name="close" />
						</button>
					</div>
				)}
				<input
					ref={file}
					hidden
					type="file"
					accept={SOURCE_FILE_ACCEPT}
					aria-label="Choose a file to attach"
					onChange={selectFile}
				/>
				<ChatComposer
					submitting={submitting}
					defaultModelMode={defaultModelMode}
					onStop={onStop}
					onAttach={() => file.current?.click()}
					onSubmit={(message, mode) => {
						followLatest();
						onSubmit(
							attachment
								? `${message}\nAttachment: ${attachment.name}`
								: message,
							mode,
						);
						setAttachment(undefined);
					}}
				/>
				{attachmentError && (
					<p className="ap-composer-error" role="alert">
						{attachmentError}
					</p>
				)}
			</div>
		</section>
	);
}

function Message({
	speaker,
	text,
	sources,
	entering,
}: {
	speaker: "you" | "agent";
	text: string;
	sources?: ProjectSource[];
	entering?: boolean;
}) {
	return (
		<ConversationMessage speaker={speaker} text={text} entering={entering}>
			{Boolean(sources?.length) && (
				<ul className="ap-builder-sources" aria-label="Project sources">
					{sources?.map(({ kind, value }) => (
						<li key={`${kind}-${value}`}>
							<Icon name={kind === "website" ? "link" : "file-text"} />
							<span>{value}</span>
						</li>
					))}
				</ul>
			)}
		</ConversationMessage>
	);
}

export function BuilderFirstDraft({
	onReady,
	usesWebsite,
	saving,
	disabled,
}: {
	onReady: () => void;
	usesWebsite: boolean;
	saving?: boolean;
	disabled?: boolean;
}) {
	return (
		<section className="ap-builder-progress" aria-label="First draft">
			<AmbientBottomGradient variant="preview" motion="Still" />
			<div className="ap-builder-progress-card">
				<Badge tone="info">Ready to review</Badge>
				<h2>Your project is saved</h2>
				<p>Open the first draft to review and test the visitor experience.</p>
				<ul>
					{[
						usesWebsite ? "Website reference saved" : "Project brief saved",
						"First draft outlined",
					].map((step) => (
						<li key={step}>
							<Icon name="check" />
							{step}
						</li>
					))}
				</ul>
				<Button
					size="medium"
					reserveLoadingSpace
					loading={saving}
					disabled={disabled}
					icon={<Icon name="arrow-right" />}
					onClick={onReady}
				>
					View first draft
				</Button>
			</div>
		</section>
	);
}
