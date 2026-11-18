import { AmbientBottomGradient } from "@agentplace/ui/components/ap-ambient";
import { ChatComposer } from "@agentplace/ui/components/ap-builder";
import { Badge, Spinner } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	MenuItem,
	MenuPanel,
	MenuPopover,
} from "@agentplace/ui/components/ap-menus";
import { WorkingIndicator } from "@agentplace/ui/components/ap-working-indicator";
import { Button } from "@agentplace/ui/components/button";
import { type ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import type { ProjectSource } from "../prototype-data";
import type { BuilderConversation } from "./builder-model";
import { BuilderNote, BuilderTitle } from "./builder-primitives";

const modelOptions = ["Automatic", "Fast", "Detailed"];

export function BuilderChat({
	conversation,
	working,
	onSubmit,
	onBranding,
	onReview,
	onDestination,
	onSkipDestination,
	destination,
	sources = [],
	usesWebsite,
}: {
	conversation?: BuilderConversation;
	working: boolean;
	onSubmit: (message: string) => void;
	onBranding: () => void;
	onReview: () => void;
	onDestination: () => void;
	onSkipDestination: () => void;
	destination?: string;
	sources?: ProjectSource[];
	usesWebsite: boolean;
}) {
	const [model, setModel] = useState("Model");
	const [attachment, setAttachment] = useState<File>();
	const file = useRef<HTMLInputElement>(null);
	const messageList = useRef<HTMLDivElement>(null);
	const pendingScroll = useRef(false);
	const updates = conversation?.messages.slice(1) ?? [];
	const initial = conversation?.messages[0];
	const firstConversation = conversation?.id === "build";

	useLayoutEffect(() => {
		if (
			pendingScroll.current &&
			conversation?.messages.length &&
			messageList.current
		) {
			messageList.current.scrollTop = messageList.current.scrollHeight;
			pendingScroll.current = false;
		}
	}, [conversation]);

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
				<BuilderTitle
					title={working ? "Let’s build your agent" : "Edit your agent"}
					description={
						working
							? "A few details will help shape the first draft."
							: "Describe a change. We’ll take care of the build."
					}
				/>
				{firstConversation && initial && (
					<>
						<Message speaker="you" text={initial.text} sources={sources} />
						<Message
							speaker="agent"
							text={getDraftReply(working, usesWebsite)}
						/>
						{working ? (
							<>
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
						) : (
							<>
								<BuilderNote title="Ready to test" tone="success">
									Company knowledge, branding and lead storage are connected.
								</BuilderNote>
								<div className="ap-builder-quick-actions">
									<Button variant="secondary" onClick={onBranding}>
										Customize branding
									</Button>
									<Button variant="ghost" onClick={onReview}>
										Review setup
									</Button>
								</div>
							</>
						)}
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
					modelControl={
						<MenuPopover
							trigger={
								<Button variant="ghost" icon={<Icon name="chevron-down" />}>
									{model}
								</Button>
							}
						>
							{(close) => (
								<MenuPanel title="Model" onClose={close}>
									<div className="ap-menu-list" role="menu" aria-label="Models">
										{modelOptions.map((option) => (
											<MenuItem
												key={option}
												label={option}
												icon={model === option ? "check" : null}
												data-menu-choice
												role="menuitem"
												onClick={() => {
													setModel(option);
													close();
												}}
											/>
										))}
									</div>
								</MenuPanel>
							)}
						</MenuPopover>
					}
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
		<div className="ap-builder-message" data-role={speaker}>
			<div>
				{speaker === "agent" && (
					<span className="ap-builder-agent-bolt" aria-hidden="true" />
				)}
				{speaker === "you" ? "You" : "Agentplace"}
			</div>
			<p>{text}</p>
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
		</div>
	);
}

function getDraftReply(working: boolean, usesWebsite: boolean) {
	if (working) {
		return usesWebsite
			? "I’ll use your website to draft the services and visitor experience. Where should new enquiries be sent?"
			: "I’ll use your brief to draft the visitor experience. Where should new enquiries be sent?";
	}
	return usesWebsite
		? "Your first draft is ready. I imported your services and created an enquiry flow. Try it in the preview before publishing."
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
