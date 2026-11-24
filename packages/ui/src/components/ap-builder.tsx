import {
	type CSSProperties,
	type FormEvent,
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	type ProjectCoverBackground,
	projectCoverBackgrounds,
} from "../lib/project-cover-backgrounds";
import { AmbientBottomGradient } from "./ap-ambient";
import { Mascot } from "./ap-brand";
import { ProjectActions } from "./ap-controls";
import { Avatar, Badge, LoadingStatus, Spinner } from "./ap-data";
import { Icon } from "./ap-icon";
import {
	MenuPopover,
	type MenuProject,
	type ProjectAction,
	ProjectActionsMenu,
	Tooltip,
} from "./ap-menus";
import {
	defaultModelMode,
	type ModelMode,
	ModelPicker,
} from "./ap-model-picker";
import { useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import "../styles/ap-builder.css";

export type CoverPresentation = "empty" | "added" | "default-mascot";
export type CoverContext = "home-card" | "branding-upload";
export interface ProjectCoverProps {
	context?: CoverContext;
	background?: ProjectCoverBackground;
	image?: string | null;
	alt?: string;
	objectPosition?: CSSProperties["objectPosition"];
	canEdit?: boolean;
	preparing?: boolean;
	onEdit?: () => void;
	presentation?: CoverPresentation;
	emptyLabel?: string;
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
	background,
	image,
	alt = "Project cover",
	objectPosition = "center",
	canEdit = false,
	preparing = false,
	onEdit,
	presentation,
	emptyLabel,
	className = "",
}: ProjectCoverProps) {
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const actionLabel = image ? "Change project cover" : "Add project cover";
	const label = emptyLabel
		? image
			? `${emptyLabel} for this project`
			: `${actionLabel}. ${emptyLabel}`
		: actionLabel;
	const backgroundImage =
		context === "home-card" && !image && background
			? projectCoverBackgrounds[background]?.image
			: undefined;
	const state =
		canEdit && !preparing && (hovered || focused)
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
				<span>{emptyLabel ?? actionLabel}</span>
			</span>
			<span
				className="ap-cover-art ap-cover-mascot"
				aria-hidden={state !== "default-mascot"}
			>
				{backgroundImage && <img src={backgroundImage} alt="" />}
				<Mascot animated={state === "default-mascot"} />
			</span>
			<span
				className="ap-cover-art ap-cover-added"
				aria-hidden={state !== "added"}
			>
				{image && <img src={image} alt={alt} style={{ objectPosition }} />}
			</span>
			{canEdit && !preparing && state !== "empty" && (
				<span className="ap-cover-touch-action">
					<Icon name="upload" />
					{emptyLabel ?? actionLabel}
				</span>
			)}
		</>
	);
	return canEdit ? (
		<button
			type="button"
			aria-label={label}
			aria-disabled={preparing || undefined}
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
				if (!preparing) onEdit?.();
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
			{cover?.preparing && (
				<LoadingStatus className="ap-cover-loading">
					Preparing image…
				</LoadingStatus>
			)}
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

interface PromptPlaceholder {
	text: string;
	fadeOut?: boolean;
}

type PromptPlaceholderFrame = PromptPlaceholder & { delay: number };

const projectPromptPlaceholder: PromptPlaceholder = {
	text: "Describe the agent you want to build…",
};
const projectPromptLines = [
	"Answer common customer questions",
	"Recommend the right service",
	"Help visitors book appointments",
	projectPromptPlaceholder.text,
];
const projectPromptIntro: PromptPlaceholderFrame[] = [
	{ ...projectPromptPlaceholder, fadeOut: true, delay: 1100 },
	{ text: "", delay: 220 },
];
const projectPromptFrames: PromptPlaceholderFrame[] = [
	...projectPromptIntro,
	...projectPromptLines.flatMap((line, lineIndex) => {
		const instructional = line === projectPromptPlaceholder.text;
		const prefix = instructional ? "" : "e.g. ";
		const longerPause = lineIndex >= projectPromptLines.length - 2;
		const startDelay = lineIndex === 0 || instructional ? 660 : 460;
		const readingDelay = longerPause ? 2700 : 2200;
		const eraseDelay = longerPause ? 40 : 32;
		const typing = Array.from({ length: line.length }, (_, index) => {
			const characterDelay =
				line[index - 1] === " " ? 90 : 48 + (index % 3) * 5;
			return {
				text: prefix + line.slice(0, index + 1),
				delay: index === 0 ? startDelay : characterDelay,
			};
		});
		const erasing = Array.from({ length: line.length }, (_, index) => ({
			text:
				index === line.length - 1
					? ""
					: prefix + line.slice(0, line.length - index - 1),
			delay: index === 0 ? readingDelay : eraseDelay,
		}));
		return [...typing, ...erasing];
	}),
];

function useProjectPromptPlaceholder(
	ref: RefObject<HTMLTextAreaElement | null>,
	enabled: boolean,
) {
	const { reduced, paused } = useMotionEnvironment();
	const nextFrame = useRef(0);
	const [example, setExample] = useState(projectPromptPlaceholder);

	useEffect(() => {
		const field = ref.current;
		if (!field || !enabled || reduced || paused) return;

		let timer: number | undefined;
		function advance() {
			const frame = projectPromptFrames[nextFrame.current];
			if (!frame) return;
			timer = window.setTimeout(() => {
				setExample(frame);
				nextFrame.current =
					nextFrame.current === projectPromptFrames.length - 1
						? projectPromptIntro.length
						: nextFrame.current + 1;
				advance();
			}, frame.delay);
		}
		const observer = new IntersectionObserver(([entry]) => {
			window.clearTimeout(timer);
			if (entry?.isIntersecting) advance();
		});
		observer.observe(field);
		return () => {
			observer.disconnect();
			window.clearTimeout(timer);
		};
	}, [enabled, paused, reduced, ref]);

	return enabled && !paused && !reduced ? example : projectPromptPlaceholder;
}

export function NewProjectPrompt({
	value: controlledValue,
	defaultValue = "",
	onValueChange,
	onSubmit,
	onAttach,
	modelMode,
	onModelModeChange,
	submitting = false,
	error,
	className = "",
}: Omit<ComposerProps, "onAttach"> & {
	onAttach?: (trigger: HTMLButtonElement) => void;
	modelMode?: ModelMode;
	onModelModeChange?: (mode: ModelMode) => void;
}) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const value = controlledValue ?? internalValue;
	const textarea = useRef<HTMLTextAreaElement>(null);
	const inFlight = useRef(false);
	const [pending, setPending] = useState(false);
	const [localError, setLocalError] = useState<{
		message: string;
		value: string;
	}>();
	const [promptInteracted, setPromptInteracted] = useState(false);
	const errorId = useId();
	const busy = submitting || pending;
	const feedback =
		error || (localError?.value === value ? localError.message : "");
	const placeholder = useProjectPromptPlaceholder(
		textarea,
		!(value || busy || feedback || promptInteracted),
	);
	function change(value: string) {
		setLocalError(undefined);
		setInternalValue(value);
		onValueChange?.(value);
	}
	async function submit(event?: FormEvent) {
		event?.preventDefault();
		if (busy || inFlight.current) return;
		if (!value.trim()) {
			setLocalError({
				message: "Describe the agent you want to build.",
				value,
			});
			textarea.current?.focus();
			return;
		}
		inFlight.current = true;
		setPending(true);
		setLocalError(undefined);
		try {
			await onSubmit?.(value.trim());
		} catch (cause) {
			setLocalError({
				message:
					cause instanceof Error
						? cause.message
						: "The request could not be completed. Try again.",
				value,
			});
		} finally {
			inFlight.current = false;
			setPending(false);
			if (document.activeElement === document.body)
				textarea.current?.focus({ preventScroll: true });
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
				onFocus={() => setPromptInteracted(true)}
				onPointerDown={() => setPromptInteracted(true)}
				onSubmit={submit}
			>
				<textarea
					ref={textarea}
					aria-label="Describe the agent you want to build"
					aria-invalid={Boolean(feedback)}
					aria-describedby={feedback ? errorId : undefined}
					placeholder={placeholder.text}
					data-placeholder-fade-out={placeholder.fadeOut || undefined}
					value={value}
					onInput={(event) => change(event.currentTarget.value)}
					onKeyDown={key}
					readOnly={busy}
				/>
				<div className="ap-prompt-actions">
					<div className="ap-new-project-tools">
						<Tooltip label="Add website or file">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="ap-new-project-attach"
								aria-label="Add website or file"
								aria-haspopup="dialog"
								onClick={(event) => onAttach?.(event.currentTarget)}
								icon={<Icon name="paperclip" />}
								disabled={busy}
							/>
						</Tooltip>
						<ModelPicker
							side="bottom"
							value={modelMode}
							onValueChange={onModelModeChange}
							disabled={busy}
						/>
					</div>
					<Button
						type="submit"
						variant="default"
						aria-label="Create project"
						className="ap-create-project-button"
						icon={
							<Icon name="arrow-right" className="ap-create-project-icon" />
						}
						loading={busy}
					>
						<span className="ap-create-project-label">Create project</span>
						<span className="ap-create-project-short">Create</span>
					</Button>
				</div>
			</form>
			{feedback && (
				<p id={errorId} role="alert" className="ap-composer-error">
					{feedback}
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
	onStop,
	submitting = false,
	error,
	placeholder = "Describe a change to your agent…",
	model,
	modelControl,
	defaultModelMode: initialModelMode = defaultModelMode,
	className = "",
}: Omit<ComposerProps, "onSubmit"> & {
	onSubmit?: (message: string, mode: ModelMode) => void | Promise<void>;
	onModel?: () => void;
	onStop?: () => void;
	placeholder?: string;
	model?: string;
	modelControl?: ReactNode;
	defaultModelMode?: ModelMode;
}) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [selectedModel, setSelectedModel] = useState(initialModelMode);
	const value = controlledValue ?? internalValue;
	const textarea = useRef<HTMLTextAreaElement>(null);
	const lock = useRef(false);
	const [pending, setPending] = useState(false);
	const [localError, setLocalError] = useState("");
	const errorId = useId();
	const busy = submitting || pending;
	const wasBusy = useRef(false);
	const send = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		const focused = document.activeElement;
		if (
			wasBusy.current &&
			!busy &&
			(focused === document.body || focused === send.current) &&
			!document.querySelector("dialog[open], [role=dialog]:not([inert])")
		)
			textarea.current?.focus({ preventScroll: true });
		wasBusy.current = busy;
	}, [busy]);
	function change(value: string) {
		setLocalError("");
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
			await onSubmit?.(value.trim(), selectedModel);
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
					readOnly={busy}
				/>
				<div className="ap-prompt-actions">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Attach a file"
						onClick={onAttach}
						icon={<Icon name="paperclip" />}
						disabled={busy}
					/>
					{modelControl ??
						(onModel || model !== undefined ? (
							<Button
								type="button"
								variant="ghost"
								className="ap-model-picker-trigger"
								onClick={onModel}
								icon={<Icon name="chevron-down" />}
								disabled={busy}
							>
								{model ?? "Model"}
							</Button>
						) : (
							<ModelPicker
								value={selectedModel}
								onValueChange={setSelectedModel}
								disabled={busy}
							/>
						))}
					<div className="ap-builder-spacer" />
					<button
						ref={send}
						type={busy && onStop ? "button" : "submit"}
						onClick={busy && onStop ? onStop : undefined}
						className="ap-composer-send"
						aria-label={
							busy && onStop
								? "Stop editing"
								: busy
									? "Sending message"
									: "Send message"
						}
						aria-busy={busy}
						disabled={busy ? !onStop : !value.trim()}
					>
						{busy && onStop ? (
							<span className="ap-composer-stop-mark" />
						) : busy ? (
							<Spinner aria-hidden="true" />
						) : (
							<Icon name="arrow-up" />
						)}
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
	agentName?: string;
	conversation?: boolean;
	onReset?: () => void;
	onStop?: () => void;
	title: string;
	description: string;
	suggestions: string[];
	coverImage?: string | null;
	device?: "Desktop" | "Mobile";
	mode?: "test" | "standalone" | "public";
	children?: ReactNode;
	onSuggestion?: (question: string) => void;
	onSend?: (message: string) => void | Promise<void>;
	onCall?: () => void;
	onDevice?: () => void;
	onOpenExternal?: () => void;
	submitting?: boolean;
	inputRef?: RefObject<HTMLInputElement | null>;
	className?: string;
}
export function AgentPreview({
	company,
	companyInitials = "",
	companyLogo,
	agentName,
	conversation = false,
	onReset,
	onStop,
	title,
	description,
	suggestions,
	coverImage,
	device = "Desktop",
	mode = "test",
	children,
	onSuggestion,
	onSend,
	onCall,
	onDevice,
	onOpenExternal,
	submitting = false,
	inputRef,
	className = "",
}: AgentPreviewProps) {
	const [value, setValue] = useState("");
	const [pending, setPending] = useState(false);
	const [sendError, setSendError] = useState("");
	const errorId = useId();
	const lock = useRef(false);
	const internalInput = useRef<HTMLInputElement>(null);
	const draftRevision = useRef(0);
	const resetFocus = useRef(false);
	const input = inputRef ?? internalInput;
	const busy = submitting || pending;
	const canSend = Boolean(onSend && value.trim() && !busy);

	useLayoutEffect(() => {
		if (!conversation && resetFocus.current) {
			resetFocus.current = false;
			input.current?.focus();
		}
	}, [conversation, input]);

	function changeValue(next: string) {
		draftRevision.current += 1;
		setValue(next);
		setSendError("");
	}

	async function send(event: FormEvent) {
		event.preventDefault();
		if (!onSend || !canSend || lock.current) return;
		input.current?.focus({ preventScroll: true });
		const draft = value;
		const submittedRevision = draftRevision.current;
		lock.current = true;
		setPending(true);
		setValue("");
		setSendError("");
		try {
			const result = onSend(draft.trim());
			if (result) await result;
		} catch (error) {
			if (draftRevision.current === submittedRevision) setValue(draft);
			setSendError(
				error instanceof Error
					? error.message
					: "The message could not be sent. Try again.",
			);
		} finally {
			lock.current = false;
			setPending(false);
		}
	}
	return (
		<section
			className={`ap-agent-preview ${className}`}
			data-mode={mode}
			aria-label={mode === "test" ? "Agent preview" : "Visitor experience"}
		>
			{mode === "test" && (
				<>
					<AmbientBottomGradient variant="preview" />
					<div className="ap-preview-toolbar">
						<Icon name="eye" />
						<span>Test as a visitor</span>
						<div className="ap-builder-spacer" />
						{onDevice && (
							<Tooltip
								label={
									device === "Desktop"
										? "Switch to mobile"
										: "Switch to desktop"
								}
							>
								<Button
									variant="ghost"
									icon={<Icon name="monitor" />}
									aria-pressed={device === "Mobile"}
									onClick={onDevice}
								>
									{device}
								</Button>
							</Tooltip>
						)}
						{onOpenExternal && (
							<Tooltip label="Open preview in new window">
								<button
									type="button"
									aria-label="Open preview in new window"
									className="ap-composer-icon"
									onClick={onOpenExternal}
								>
									<Icon name="external-link" />
								</button>
							</Tooltip>
						)}
					</div>
				</>
			)}
			<div
				className="ap-visitor-experience"
				data-conversation={conversation || undefined}
			>
				{conversation ? (
					<div
						className="ap-preview-conversation-header"
						data-ap-enter="message"
					>
						<Avatar
							initials={companyInitials}
							src={companyLogo}
							alt={company}
							size="large"
						/>
						<div>
							<p>{agentName || company}</p>
							<span>{company}</span>
						</div>
						{onReset && (
							<Tooltip label="Start a new conversation">
								<button
									type="button"
									className="ap-composer-icon"
									aria-label="Start new visitor conversation"
									onClick={() => {
										resetFocus.current = true;
										onReset();
										changeValue("");
									}}
								>
									<Icon name="refresh" />
								</button>
							</Tooltip>
						)}
					</div>
				) : (
					<>
						{coverImage ? (
							<div className="ap-preview-cover">
								<img src={coverImage} alt={company} />
							</div>
						) : (
							<div className="ap-preview-company">
								<Avatar
									initials={companyInitials}
									src={companyLogo}
									alt={company}
									size="large"
								/>
								<span>{company}</span>
							</div>
						)}
						<h1>
							<span className="ap-glyph-heading-xl">{title}</span>
						</h1>
						<p className="ap-preview-description">
							<span className="ap-glyph-body-base">{description}</span>
						</p>
						<div className="ap-preview-suggestions" data-ap-enter="message">
							{suggestions.map((suggestion) => (
								<button
									type="button"
									key={suggestion}
									onClick={() => {
										changeValue(suggestion);
										onSuggestion?.(suggestion);
										input.current?.focus();
									}}
								>
									{suggestion}
									<Icon name="arrow-right" />
								</button>
							))}
						</div>
					</>
				)}
				{children}
				{!conversation && <div className="ap-builder-spacer" />}
				<div className="ap-visitor-footer">
					{mode !== "public" && (
						<p className="ap-preview-test-mode">
							<Icon name="shield-check" />
							Test mode · No live enquiries are created
						</p>
					)}
					<div className="ap-visitor-input-call">
						<form className="ap-visitor-input" onSubmit={send}>
							<input
								ref={input}
								aria-label="Ask your agent a question"
								aria-invalid={Boolean(sendError)}
								aria-describedby={sendError ? errorId : undefined}
								placeholder={
									conversation
										? "Message the agent…"
										: "Ask your agent a question…"
								}
								value={value}
								onInput={(event) => changeValue(event.currentTarget.value)}
							/>
							<button
								type={busy && onStop ? "button" : "submit"}
								onClick={
									busy && onStop
										? () => {
												onStop();
												input.current?.focus({ preventScroll: true });
											}
										: undefined
								}
								aria-label={busy && onStop ? "Stop reply" : "Send question"}
								className="ap-composer-send"
								disabled={busy ? !onStop : !canSend}
								aria-busy={busy && !onStop ? true : undefined}
							>
								{busy && onStop ? (
									<span className="ap-composer-stop-mark" />
								) : busy ? (
									<Spinner aria-hidden="true" />
								) : (
									<Icon name="arrow-up" />
								)}
							</button>
						</form>
						{onCall && (
							<button
								type="button"
								className="ap-visitor-call"
								onClick={onCall}
							>
								<Icon name="phone" />
								Call
							</button>
						)}
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
