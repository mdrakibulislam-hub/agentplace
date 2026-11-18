import {
	type CSSProperties,
	type FormEvent,
	type KeyboardEvent,
	useId,
	useRef,
	useState,
} from "react";
import { Mascot } from "./ap-brand";
import { ProjectActions } from "./ap-controls";
import { Avatar, Badge } from "./ap-data";
import { Icon } from "./ap-icon";
import {
	MenuPopover,
	type MenuProject,
	type ProjectAction,
	ProjectActionsMenu,
} from "./ap-menus";
import { Button } from "./button";
import "../styles/ap-builder.css";

export type CoverPresentation = "empty" | "added" | "default-mascot";
export type CoverContext = "home-card" | "branding-upload";
export interface ProjectCoverProps {
	context?: CoverContext;
	image?: string | null;
	alt?: string;
	objectPosition?: CSSProperties["objectPosition"];
	canEdit?: boolean;
	onEdit?: () => void;
	presentation?: CoverPresentation;
	className?: string;
}
export function coverPresentation(
	context: CoverContext,
	hasImage: boolean,
	editable: boolean,
	engaged: boolean,
): CoverPresentation {
	if (editable && engaged) return "empty";
	if (hasImage) return "added";
	return context === "home-card" ? "default-mascot" : "empty";
}
export function ProjectCover({
	context = "home-card",
	image,
	alt = "Project cover",
	objectPosition = "center",
	canEdit = false,
	onEdit,
	presentation,
	className = "",
}: ProjectCoverProps) {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const state =
		canEdit && (hovered || focused)
			? "empty"
			: (presentation ??
				coverPresentation(context, Boolean(image), canEdit, false));
	const content = (
		<>
			<span
				className="ap-cover-art ap-cover-empty"
				aria-hidden={state !== "empty"}
			>
				<Icon name="upload" />
				<span>Add a project cover</span>
			</span>
			<span
				className="ap-cover-art ap-cover-mascot"
				aria-hidden={state !== "default-mascot"}
			>
				<Mascot animated={state === "default-mascot"} />
			</span>
			<span
				className="ap-cover-art ap-cover-added"
				aria-hidden={state !== "added"}
			>
				{image && <img src={image} alt={alt} style={{ objectPosition }} />}
			</span>
			{canEdit && state !== "empty" && (
				<span className="ap-cover-touch-action">
					<Icon name="upload" />
					{image ? "Change cover" : "Add cover"}
				</span>
			)}
		</>
	);
	return canEdit ? (
		<button
			type="button"
			aria-label={image ? "Change project cover" : "Add project cover"}
			className={`ap-project-cover ${className}`}
			data-presentation={state}
			onPointerEnter={(event) => {
				if (event.pointerType !== "touch") setHovered(true);
			}}
			onPointerLeave={() => setHovered(false)}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			onClick={(event) => {
				event.stopPropagation();
				onEdit?.();
			}}
		>
			{content}
		</button>
	) : (
		<div className={`ap-project-cover ${className}`} data-presentation={state}>
			{content}
		</div>
	);
}

export interface ProjectCardProps {
	project: MenuProject;
	cover?: Omit<ProjectCoverProps, "context">;
	canEdit?: boolean;
	onOpen?: (projectId: string) => void;
	onCoverEdit?: (projectId: string) => void;
	onAction?: (action: ProjectAction, projectId: string) => void;
	defaultActionsOpen?: boolean;
	className?: string;
}
export function ProjectCard({
	project,
	cover,
	canEdit = true,
	onOpen,
	onCoverEdit,
	onAction,
	defaultActionsOpen,
	className = "",
}: ProjectCardProps) {
	return (
		<article className={`ap-project-card ${className}`}>
			<button
				type="button"
				className="ap-project-open"
				aria-label={`Open ${project.name}`}
				onClick={() => onOpen?.(project.id)}
			/>
			<ProjectCover
				{...cover}
				context="home-card"
				canEdit={canEdit}
				onEdit={() => onCoverEdit?.(project.id)}
			/>
			<div className="ap-project-details">
				<div className="ap-project-card-heading">
					<div className="ap-project-name-status">
						<h3 title={project.name}>{project.name}</h3>
						<Badge
							tone={project.status === "Published" ? "success" : "neutral"}
						>
							{project.status}
						</Badge>
					</div>
					<div className="ap-builder-spacer" />
					<MenuPopover
						align="end"
						side="top"
						sideOffset={-12}
						defaultOpen={defaultActionsOpen}
						trigger={
							<ProjectActions
								className="ap-project-overflow"
								label={`Actions for ${project.name}`}
							/>
						}
					>
						{(close) => (
							<ProjectActionsMenu
								project={project}
								canEdit={canEdit}
								onClose={close}
								onAction={(action, id) => {
									onAction?.(action, id);
									close();
								}}
							/>
						)}
					</MenuPopover>
				</div>
				<p className="ap-project-edited">{project.updated}</p>
			</div>
		</article>
	);
}

interface ComposerProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	onSubmit?: (value: string) => void | Promise<void>;
	onAttach?: () => void;
	submitting?: boolean;
	error?: string;
	className?: string;
}
export function NewProjectPrompt({
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	onSubmit,
	onAttach,
	submitting = false,
	error,
	className = "",
}: ComposerProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const value = controlledValue ?? internalValue;
	const textarea = useRef<HTMLTextAreaElement>(null);
	const inFlight = useRef(false);
	const [pending, setPending] = useState(false);
	const [localError, setLocalError] = useState("");
	const errorId = useId();
	const busy = submitting || pending;
	function change(value: string) {
		setInternalValue(value);
		onValueChange?.(value);
	}
	async function submit(event?: FormEvent) {
		event?.preventDefault();
		if (busy || inFlight.current) return;
		if (!value.trim()) {
			setLocalError("Describe the agent you want to build.");
			textarea.current?.focus();
			return;
		}
		inFlight.current = true;
		setPending(true);
		setLocalError("");
		try {
			await onSubmit?.(value.trim());
		} catch (cause) {
			setLocalError(
				cause instanceof Error
					? cause.message
					: "The request could not be completed. Try again.",
			);
		} finally {
			inFlight.current = false;
			setPending(false);
			textarea.current?.focus();
		}
	}
	function key(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			void submit();
		}
	}
	return (
		<div>
			<form
				aria-label="New project prompt"
				className={`ap-new-project-prompt ${className}`}
				onSubmit={submit}
			>
				<textarea
					ref={textarea}
					aria-label="Describe the agent you want to build"
					aria-invalid={Boolean(error || localError)}
					aria-describedby={error || localError ? errorId : undefined}
					placeholder="Describe the agent you want to build…"
					value={value}
					onInput={(event) => change(event.currentTarget.value)}
					onKeyDown={key}
					disabled={busy}
				/>
				<div className="ap-prompt-actions">
					<Button
						type="button"
						variant="ghost"
						onClick={onAttach}
						icon={<Icon name="plus" />}
						disabled={busy}
					>
						Add website or file
					</Button>
					<div className="ap-builder-spacer" />
					<Button
						type="submit"
						variant="default"
						icon={<Icon name="arrow-right" />}
						loading={busy}
					>
						Create project
					</Button>
				</div>
			</form>
			{(error || localError) && (
				<p id={errorId} role="alert" className="ap-composer-error">
					{error || localError}
				</p>
			)}
		</div>
	);
}

export function ChatComposer({
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	onSubmit,
	onAttach,
	onModel,
	submitting = false,
	error,
	placeholder = "Describe a change to your agent…",
	model = "Model",
	className = "",
}: ComposerProps & {
	onModel?: () => void;
	placeholder?: string;
	model?: string;
}) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const value = controlledValue ?? internalValue;
	const textarea = useRef<HTMLTextAreaElement>(null);
	const lock = useRef(false);
	const [pending, setPending] = useState(false);
	const [localError, setLocalError] = useState("");
	const errorId = useId();
	const busy = submitting || pending;
	function change(value: string) {
		setInternalValue(value);
		onValueChange?.(value);
	}
	async function submit(event?: FormEvent) {
		event?.preventDefault();
		if (!value.trim() || busy || lock.current) return;
		lock.current = true;
		setPending(true);
		setLocalError("");
		try {
			await onSubmit?.(value.trim());
			change("");
		} catch (cause) {
			setLocalError(
				cause instanceof Error
					? cause.message
					: "The message could not be sent. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
			textarea.current?.focus();
		}
	}
	function key(event: KeyboardEvent<HTMLTextAreaElement>) {
		if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!event.nativeEvent.isComposing
		) {
			event.preventDefault();
			void submit();
		}
	}
	return (
		<div>
			<form
				aria-label="Chat composer"
				className={`ap-chat-composer ${className}`}
				onSubmit={submit}
			>
				<textarea
					ref={textarea}
					aria-label="Message your agent builder"
					aria-invalid={Boolean(error || localError)}
					aria-describedby={error || localError ? errorId : undefined}
					placeholder={placeholder}
					value={value}
					onInput={(event) => change(event.currentTarget.value)}
					onKeyDown={key}
					disabled={busy}
				/>
				<div className="ap-prompt-actions">
					<button
						type="button"
						className="ap-composer-icon"
						aria-label="Attach a file"
						onClick={onAttach}
						disabled={busy}
					>
						<Icon name="paperclip" />
					</button>
					<Button
						type="button"
						variant="ghost"
						onClick={onModel}
						icon={<Icon name="chevron-down" />}
						disabled={busy}
					>
						{model}
					</Button>
					<div className="ap-builder-spacer" />
					<button
						type="submit"
						className="ap-composer-send"
						aria-label={busy ? "Sending message" : "Send message"}
						aria-busy={busy}
						disabled={busy || !value.trim()}
					>
						<Icon name={busy ? "loader" : "arrow-up"} />
					</button>
				</div>
			</form>
			{(error || localError) && (
				<p id={errorId} role="alert" className="ap-composer-error">
					{error || localError}
				</p>
			)}
		</div>
	);
}

export interface AgentPreviewProps {
	company: string;
	companyInitials?: string;
	companyLogo?: string;
	title: string;
	description: string;
	suggestions: string[];
	coverImage?: string | null;
	onSuggestion?: (question: string) => void;
	onSend?: (message: string) => void | Promise<void>;
	onCall?: () => void;
	onDevice?: () => void;
	onOpenExternal?: () => void;
	submitting?: boolean;
	className?: string;
}
export function AgentPreview({
	company,
	companyInitials = "",
	companyLogo,
	title,
	description,
	suggestions,
	coverImage,
	onSuggestion,
	onSend,
	onCall,
	onDevice,
	onOpenExternal,
	submitting = false,
	className = "",
}: AgentPreviewProps) {
	const [value, setValue] = useState("");
	const [pending, setPending] = useState(false);
	const [sendError, setSendError] = useState("");
	const errorId = useId();
	const lock = useRef(false);
	const input = useRef<HTMLInputElement>(null);
	const busy = submitting || pending;
	async function send(event: FormEvent) {
		event.preventDefault();
		if (!value.trim() || busy || lock.current) return;
		lock.current = true;
		setPending(true);
		setSendError("");
		try {
			await onSend?.(value.trim());
			setValue("");
		} catch (error) {
			setSendError(
				error instanceof Error
					? error.message
					: "The message could not be sent. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
			input.current?.focus();
		}
	}
	return (
		<section
			className={`ap-agent-preview ${className}`}
			aria-label="Agent preview"
		>
			<div className="ap-preview-diffusion" aria-hidden="true" />
			<div className="ap-preview-toolbar">
				<Icon name="eye" />
				<span>Test as a visitor</span>
				<div className="ap-builder-spacer" />
				<Button
					variant="ghost"
					icon={<Icon name="monitor" />}
					onClick={onDevice}
				>
					Desktop
				</Button>
				<button
					type="button"
					aria-label="Open preview in new window"
					className="ap-composer-icon"
					onClick={onOpenExternal}
				>
					<Icon name="external-link" />
				</button>
			</div>
			<div className="ap-visitor-experience">
				<div className="ap-preview-company">
					<Avatar
						initials={companyInitials}
						src={companyLogo}
						alt={company}
						size="large"
					/>
					<span>{company}</span>
				</div>
				<div className="ap-preview-cover">
					{coverImage && <img src={coverImage} alt="" />}
				</div>
				<h1>
					<span className="ap-glyph-heading-xl">{title}</span>
				</h1>
				<p className="ap-preview-description">
					<span className="ap-glyph-body-base">{description}</span>
				</p>
				<div className="ap-preview-suggestions">
					{suggestions.map((suggestion) => (
						<button
							type="button"
							key={suggestion}
							onClick={() => {
								setValue(suggestion);
								onSuggestion?.(suggestion);
								input.current?.focus();
							}}
						>
							{suggestion}
							<Icon name="arrow-right" />
						</button>
					))}
				</div>
				<div className="ap-builder-spacer" />
				<div className="ap-visitor-footer">
					<p className="ap-preview-test-mode">
						<Icon name="shield-check" />
						Test mode · No live enquiries are created
					</p>
					<div className="ap-visitor-input-call">
						<form className="ap-visitor-input" onSubmit={send}>
							<input
								ref={input}
								aria-label="Ask your agent a question"
								aria-invalid={Boolean(sendError)}
								aria-describedby={sendError ? errorId : undefined}
								placeholder="Ask your agent a question…"
								value={value}
								onInput={(e) => setValue(e.currentTarget.value)}
								disabled={busy}
							/>
							<button
								type="submit"
								aria-label="Send question"
								className="ap-composer-send"
								disabled={busy || !value.trim()}
								aria-busy={busy}
							>
								<Icon name={busy ? "loader" : "arrow-up"} />
							</button>
						</form>
						<button type="button" className="ap-visitor-call" onClick={onCall}>
							<Icon name="phone" />
							Call
						</button>
					</div>
					{sendError && (
						<p id={errorId} role="alert" className="ap-composer-error">
							{sendError}
						</p>
					)}
				</div>
			</div>
		</section>
	);
}
