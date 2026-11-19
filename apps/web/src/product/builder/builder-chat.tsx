import { AmbientBottomGradient } from "@agentplace/ui/components/ap-ambient";
import { ChatComposer } from "@agentplace/ui/components/ap-builder";
import {
	ConversationMessage,
	ConversationStatus,
} from "@agentplace/ui/components/ap-conversation";
import { Badge, Spinner } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import type { ModelMode } from "@agentplace/ui/components/ap-model-picker";
import { useMotionEnvironment } from "@agentplace/ui/components/ap-motion";
import { WorkingIndicator } from "@agentplace/ui/components/ap-working-indicator";
import { Button } from "@agentplace/ui/components/button";
import { type ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import type { ProjectSource } from "../prototype-data";
import type { BuilderConversation } from "./builder-model";
import { BuilderNote } from "./builder-primitives";

export function BuilderChat({
	conversation,
	working,
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
}: {
	conversation?: BuilderConversation;
	working: boolean;
	submitting?: boolean;
	requestState?: "working" | "error" | "stopped";
	requestError?: string;
	onRetry?: () => void;
	onStop?: () => void;
	onPreview?: () => void;
	onSubmit: (message: string) => void;
	onDestination: () => void;
	onSkipDestination: () => void;
	destination?: string;
	sources?: ProjectSource[];
	defaultModelMode?: ModelMode;
	usesWebsite: boolean;
}) {
	const [attachment, setAttachment] = useState<File>();
	const file = useRef<HTMLInputElement>(null);
	const messageList = useRef<HTMLDivElement>(null);
	const pendingScroll = useRef(false);
	const { reduced } = useMotionEnvironment();
	const updates = conversation?.messages.slice(1) ?? [];
	const initial = conversation?.messages[0];
	const firstConversation = working && conversation?.id === "build";

	useLayoutEffect(() => {
		if (
			pendingScroll.current &&
			conversation?.messages.length &&
			messageList.current
		) {
			if (!reduced)
				messageList.current.scrollTop = messageList.current.scrollHeight;
			pendingScroll.current = false;
		}
	}, [conversation, reduced]);

	function selectFile(event: ChangeEvent<HTMLInputElement>) {
		setAttachment(event.currentTarget.files?.[0]);
		event.currentTarget.value = "";
	}

	return (
		<section
			className="ap-builder-editor ap-builder-chat"
			aria-label="Conversation"
		>
			<div ref={messageList} className="ap-builder-chat-scroll">
				<div className="ap-chat-thread">
					{firstConversation && initial && (
						<>
							<Message speaker="you" text={initial.text} sources={sources} />
							<Message
								speaker="agent"
								text={getDraftReply(working, usesWebsite)}
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
							<WorkingIndicator />
						</>
					)}
					{(firstConversation ? updates : conversation?.messages)?.map(
						(message) => (
							<Message
								key={message.id}
								speaker={message.role}
								text={message.text}
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
						onRetry={onRetry}
						onStop={onStop}
						onPreview={onPreview}
					/>
				</div>
			</div>
			<div className="ap-builder-chat-compose">
				{attachment && (
					<div className="ap-builder-attachment">
						<Icon name="file-text" />
						<span>{attachment.name}</span>
						<button
							type="button"
							aria-label="Remove attachment"
							onClick={() => setAttachment(undefined)}
						>
							<Icon name="close" />
						</button>
					</div>
				)}
				<input
					ref={file}
					className="sr-only"
					tabIndex={-1}
					type="file"
					aria-label="Choose a file to attach"
					onChange={selectFile}
				/>
				<ChatComposer
					submitting={submitting}
					defaultModelMode={defaultModelMode}
					onStop={onStop}
					onAttach={() => file.current?.click()}
					onSubmit={(message) => {
						pendingScroll.current = true;
						onSubmit(
							attachment
								? `${message}\nAttachment: ${attachment.name}`
								: message,
						);
						setAttachment(undefined);
					}}
				/>
			</div>
		</section>
	);
}

function Message({
	speaker,
	text,
	sources,
}: {
	speaker: "you" | "agent";
	text: string;
	sources?: ProjectSource[];
}) {
	return (
		<ConversationMessage speaker={speaker} text={text}>
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

function getDraftReply(working: boolean, usesWebsite: boolean) {
	if (working) {
		return usesWebsite
			? "I’ll use your website to draft the services and visitor experience. Where should new enquiries be sent?"
			: "I’ll use your brief to draft the visitor experience. Where should new enquiries be sent?";
	}
	return usesWebsite
		? "Your draft is ready to review. Try the visitor experience in the preview before publishing."
		: "Your first draft is ready. Try the visitor experience in the preview before publishing.";
}

export function BuilderProgress({
	onReady,
	usesWebsite,
}: {
	onReady: () => void;
	usesWebsite: boolean;
}) {
	return (
		<section className="ap-builder-progress" aria-label="Build progress">
			<AmbientBottomGradient variant="preview" />
			<div className="ap-builder-progress-card">
				<Badge tone="info">In progress</Badge>
				<h2>Your project is saved</h2>
				<p>
					We’re turning your {usesWebsite ? "website" : "brief"} into a visitor
					experience. You can leave and return while it builds.
				</p>
				<ul>
					{[
						usesWebsite ? "Website imported" : "Project brief saved",
						usesWebsite ? "Services identified" : "First draft outlined",
						"Creating visitor experience",
						"Checking your draft",
					].map((step, index) => (
						<li key={step} data-complete={index < 2}>
							{index < 2 ? (
								<Icon name="check" />
							) : (
								<Spinner aria-hidden="true" />
							)}
							{step}
						</li>
					))}
				</ul>
				<Button
					size="medium"
					icon={<Icon name="arrow-right" />}
					onClick={onReady}
				>
					View first draft
				</Button>
			</div>
		</section>
	);
}
