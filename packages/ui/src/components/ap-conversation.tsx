import type { ReactNode } from "react";
import { Avatar, LoadingStatus } from "./ap-data";
import { Icon } from "./ap-icon";
import { WorkingIndicator } from "./ap-working-indicator";
import { Button } from "./button";
import "../styles/ap-conversation.css";

export function ConversationJump({ onClick }: { onClick: () => void }) {
	return (
		<Button
			variant="secondary"
			className="ap-conversation-jump"
			icon={<Icon name="chevron-down" />}
			onClick={onClick}
			data-ap-enter="message"
		>
			Jump to latest
		</Button>
	);
}

export interface ChatMessage {
	id: string;
	role: "you" | "agent";
	text: string;
}

export function ConversationMessage({
	speaker,
	text,
	experience = "builder",
	name = "Agentplace",
	avatar,
	entering = false,
	children,
}: {
	speaker: ChatMessage["role"];
	text: string;
	experience?: "builder" | "visitor";
	name?: string;
	avatar?: string;
	entering?: boolean;
	children?: ReactNode;
}) {
	return (
		<div
			className="ap-chat-message"
			data-role={speaker}
			data-experience={experience}
			data-ap-enter={entering ? "message" : undefined}
		>
			{speaker === "agent" && (
				<div className="ap-chat-message-avatar">
					{experience === "builder" ? (
						<Icon name="zap" />
					) : (
						<Avatar
							size="small"
							src={avatar}
							alt=""
							initials={name
								.split(/\s+/)
								.slice(0, 2)
								.map((word) => word[0])
								.join("")}
						/>
					)}
				</div>
			)}
			<div className="ap-chat-message-content">
				{speaker === "agent" && <p className="ap-chat-message-name">{name}</p>}
				<p className="ap-chat-message-text">{text}</p>
				{children}
			</div>
		</div>
	);
}

export function ConversationStatus({
	experience = "builder",
	state,
	error,
	onRetry,
	onStop,
	onPreview,
}: {
	experience?: "builder" | "visitor";
	state: "idle" | "working" | "error" | "ready" | "stopped";
	error?: string;
	onRetry?: () => void;
	onStop?: () => void;
	onPreview?: () => void;
}) {
	if (state === "idle") return null;
	if (state === "working")
		return experience === "builder" ? (
			<div className="ap-chat-status" data-ap-enter="message">
				<WorkingIndicator
					title="Updating your agent"
					detail="Refining the conversation flow…"
				/>
				{onStop && (
					<Button variant="ghost" onClick={onStop}>
						Stop editing
					</Button>
				)}
			</div>
		) : (
			<LoadingStatus className="ap-chat-replying">Replying…</LoadingStatus>
		);
	if (state === "error" || state === "stopped")
		return (
			<div
				className="ap-chat-status"
				data-ap-enter="message"
				role={state === "error" ? "alert" : "status"}
			>
				<p className={state === "error" ? "ap-chat-error" : undefined}>
					{state === "stopped"
						? experience === "builder"
							? "Editing stopped."
							: "Reply stopped."
						: experience === "builder"
							? "I couldn’t finish this update."
							: "I couldn’t finish this reply."}
				</p>
				<p className="ap-chat-status-detail">
					{error ||
						(experience === "builder"
							? "Your previous draft is unchanged."
							: "Your message is still here.")}
				</p>
				{onRetry && (
					<Button variant="secondary" onClick={onRetry}>
						Try again
					</Button>
				)}
			</div>
		);
	return experience === "builder" ? (
		<div className="ap-chat-result" role="status" data-ap-enter="message">
			<Icon name="check" />
			<span>Draft updated · Not published</span>
			{onPreview && (
				<Button
					variant="ghost"
					icon={<Icon name="arrow-right" />}
					onClick={onPreview}
				>
					Try in preview
				</Button>
			)}
		</div>
	) : null;
}
