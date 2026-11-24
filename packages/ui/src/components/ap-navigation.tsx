import { AnimatePresence, motion } from "motion/react";
import type {
	ComponentProps,
	FocusEvent,
	KeyboardEvent,
	PointerEvent,
	ReactNode,
	RefObject,
} from "react";
import { useId, useRef, useState } from "react";
import { Logo } from "./ap-brand";
import { Switch } from "./ap-controls";
import { Avatar, Badge, CreditRing } from "./ap-data";
import { ConfirmDialog } from "./ap-dialog";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import "../styles/ap-navigation.css";

function useNavigationHighlight() {
	const id = useId();
	const { reduced } = useMotionEnvironment();
	const [hovered, setHovered] = useState<string>();
	const [focused, setFocused] = useState<string>();
	const active = hovered ?? focused;

	return {
		clearHover: () => setHovered(undefined),
		itemEvents: (value: string, disabled = false) => ({
			onPointerEnter: (event: PointerEvent<HTMLElement>) => {
				if (event.pointerType === "mouse") {
					setHovered(disabled ? undefined : value);
				}
			},
			onFocus: (event: FocusEvent<HTMLElement>) => {
				if (event.target.matches(":focus-visible")) {
					setHovered(undefined);
					setFocused(value);
				}
			},
			onBlur: (event: FocusEvent<HTMLElement>) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					setFocused((current) => (current === value ? undefined : current));
				}
			},
		}),
		highlight: (value: string) => (
			<AnimatePresence>
				{active === value && (
					<motion.span
						aria-hidden="true"
						className="ap-nav-highlight"
						layoutId={reduced ? undefined : id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							layout: springs.layout,
							opacity: { duration: reduced ? 0 : 0.12, ease: "easeOut" },
						}}
					/>
				)}
			</AnimatePresence>
		),
	};
}

export interface GlobalHeaderProps {
	project: string;
	type?: "default" | "secondary";
	remainingCredits?: number | null;
	allocatedCredits?: number | null;
	initials?: string;
	logo?: ReactNode;
	projectSwitcher?: ReactNode;
	themeSwitch?: ReactNode;
	accountMenu?: ReactNode;
	onProjectSwitch?: () => void;
	onCredits?: () => void;
	onAccount?: () => void;
	className?: string;
}
export function GlobalHeader({
	project,
	type = "default",
	remainingCredits = null,
	allocatedCredits = null,
	initials = "AP",
	logo,
	projectSwitcher,
	themeSwitch,
	accountMenu,
	onProjectSwitch,
	onCredits,
	onAccount,
	className = "",
}: GlobalHeaderProps) {
	const creditsLabel =
		remainingCredits === null
			? "Credits unavailable"
			: `${new Intl.NumberFormat().format(remainingCredits)} credits`;
	return (
		<header className={`ap-global-header ${className}`} data-type={type}>
			<div className="ap-global-header-start">
				{logo ?? <Logo />}
				{projectSwitcher ?? (
					<button
						type="button"
						className="ap-project-switch-trigger"
						onClick={onProjectSwitch}
					>
						<span>{project}</span>
						<Icon name="chevrons-up-down" />
					</button>
				)}
			</div>
			<div className="ap-nav-spacer" />
			<div className="ap-global-header-end">
				<button
					type="button"
					className="ap-header-credits"
					aria-label={creditsLabel}
					onClick={onCredits}
				>
					<CreditRing
						remaining={remainingCredits}
						allocation={allocatedCredits}
						size={16}
					/>
					<span>{creditsLabel}</span>
				</button>
				{themeSwitch}
				{accountMenu ?? (
					<button
						type="button"
						aria-label={`Open account menu for ${initials}`}
						className="ap-header-account"
						onClick={onAccount}
					>
						<Avatar initials={initials} size="medium" />
					</button>
				)}
			</div>
		</header>
	);
}

export function ThemeSwitch({
	dark,
	onDarkChange,
}: {
	dark: boolean;
	onDarkChange: (dark: boolean) => void;
}) {
	const { reduced } = useMotionEnvironment();
	return (
		<Switch
			className="ap-theme-switch"
			label="Dark theme"
			checked={dark}
			onCheckedChange={onDarkChange}
			thumb={
				<motion.span
					className="ap-theme-switch-thumb"
					initial={false}
					animate={{ x: dark ? 22 : 0 }}
					transition={reduced ? { duration: 0 } : springs.layout}
				>
					<Icon name={dark ? "moon" : "sun"} size={14} />
				</motion.span>
			}
		/>
	);
}

export const projectNavItems = [
	{ label: "Skills", icon: "puzzle" },
	{ label: "Instructions.md", icon: "file-text" },
	{ label: "History", icon: "history" },
	{ label: "Branding", icon: "palette" },
] as const;
export type ProjectNavValue =
	| "Chat"
	| (typeof projectNavItems)[number]["label"];
export const settingsNavItems = [
	{ label: "General", icon: "settings" },
	{ label: "Billing & usage", icon: "credit-card" },
	{ label: "Skills library", icon: "puzzle" },
	{ label: "Plugins", icon: "link" },
	{ label: "Staff & roles", icon: "users" },
] as const;
export type SettingsNavValue = (typeof settingsNavItems)[number]["label"];

interface SidebarProps {
	onHome?: () => void;
	className?: string;
}

function SidebarLinks<Value extends string>({
	items,
	active,
	label,
	onChange,
	disabled,
}: {
	items: readonly { label: Value; icon: ComponentProps<typeof Icon>["name"] }[];
	active?: NoInfer<Value>;
	label: string;
	onChange?: (value: Value) => void;
	disabled?: boolean;
}) {
	const { clearHover, itemEvents, highlight } = useNavigationHighlight();
	return (
		<motion.nav
			className="ap-sidebar-links"
			aria-label={label}
			onPointerLeave={clearHover}
			layoutScroll
		>
			{items.map((item) => (
				<button
					key={item.label}
					type="button"
					className="ap-sidebar-link"
					aria-current={active === item.label ? "page" : undefined}
					disabled={disabled}
					onClick={() => onChange?.(item.label)}
					{...itemEvents(item.label, disabled)}
				>
					{highlight(item.label)}
					<Icon name={item.icon} />
					{item.label}
				</button>
			))}
		</motion.nav>
	);
}

export function ProjectNavigation({
	active = "Chat",
	disabled,
	onChange,
	onHome,
	onNewConversation,
	onManageAccess,
	onConversation,
	onDeleteConversation,
	conversations = [],
	className = "",
}: SidebarProps & {
	active?: ProjectNavValue;
	disabled?: boolean;
	onChange?: (value: ProjectNavValue) => void;
	onNewConversation?: () => void;
	onManageAccess?: () => void;
	onConversation?: (id: string) => void;
	onDeleteConversation?: (id: string) => void | Promise<void>;
	conversations?: {
		id: string;
		title: string;
		selected?: boolean;
	}[];
}) {
	const newChat = useRef<HTMLButtonElement>(null);
	return (
		<motion.aside
			className={`ap-sidebar ap-project-sidebar ${className}`}
			aria-label="Project navigation"
			layoutScroll
		>
			<button type="button" className="ap-sidebar-home" onClick={onHome}>
				<Icon name="arrow-left" />
				All projects
			</button>
			<nav className="ap-sidebar-conversations" aria-label="Conversations">
				<button
					type="button"
					ref={newChat}
					className="ap-sidebar-new"
					onClick={onNewConversation}
					disabled={disabled}
				>
					<Icon name="plus" />
					New chat
				</button>
				<ConversationList
					conversations={conversations.map((item) => ({
						...item,
						selected: active === "Chat" && item.selected,
					}))}
					onSelect={onConversation}
					onDelete={onDeleteConversation}
					fallbackFocus={newChat}
					disabled={disabled}
				/>
			</nav>
			<SidebarLinks
				items={projectNavItems}
				active={active === "Chat" ? undefined : active}
				label="Project"
				onChange={onChange}
				disabled={disabled}
			/>
			<div className="ap-nav-spacer" />
			<button
				type="button"
				className="ap-sidebar-access"
				onClick={onManageAccess}
			>
				<Icon name="users" />
				Project access
			</button>
		</motion.aside>
	);
}

export interface ConversationListItem {
	id: string;
	title: string;
	selected?: boolean;
}

/** Shared by desktop navigation and the compact conversation picker. */
export function ConversationList({
	conversations,
	onSelect,
	onDelete,
	fallbackFocus,
	disabled,
}: {
	conversations: ConversationListItem[];
	onSelect?: (id: string) => void;
	onDelete?: (id: string) => void | Promise<void>;
	fallbackFocus?: RefObject<HTMLElement | null>;
	disabled?: boolean;
}) {
	const [target, setTarget] = useState<ConversationListItem>();
	const [open, setOpen] = useState(false);
	const list = useRef<HTMLDivElement>(null);
	const returnFocus = useRef<HTMLElement | null>(null);
	const { clearHover, itemEvents, highlight } = useNavigationHighlight();
	return (
		<>
			<div
				ref={list}
				className="ap-conversation-list"
				tabIndex={-1}
				onPointerLeave={clearHover}
			>
				{conversations.map((conversation) => (
					<div
						className="ap-conversation-row"
						data-selected={conversation.selected || undefined}
						key={conversation.id}
						{...itemEvents(conversation.id, disabled)}
					>
						{highlight(conversation.id)}
						<button
							type="button"
							className="ap-conversation-item"
							aria-current={conversation.selected ? "true" : undefined}
							title={conversation.title}
							onClick={() => onSelect?.(conversation.id)}
							disabled={disabled}
						>
							<span>{conversation.title}</span>
						</button>
						{onDelete && (
							<button
								type="button"
								className="ap-conversation-delete"
								disabled={disabled}
								aria-label={`Delete conversation “${conversation.title}”`}
								onClick={(event) => {
									returnFocus.current = event.currentTarget;
									setTarget(conversation);
									setOpen(true);
								}}
							>
								<Icon name="trash" size={16} />
							</button>
						)}
					</div>
				))}
			</div>
			<ConfirmDialog
				open={open}
				onOpenChange={setOpen}
				returnFocus={returnFocus}
				title="Delete conversation?"
				description={
					<>
						Permanently delete “{target?.title}”? Your agent and published
						version will stay as they are.
					</>
				}
				confirmLabel="Delete conversation"
				onConfirm={async () => {
					if (!target || !onDelete) return;
					await onDelete(target.id);
					returnFocus.current =
						fallbackFocus?.current ??
						list.current?.querySelector<HTMLButtonElement>(
							".ap-conversation-item",
						) ??
						list.current;
				}}
			/>
		</>
	);
}

export function SettingsNavigation({
	active = "Billing & usage",
	onChange,
	onHome,
	workspace,
	className = "",
}: SidebarProps & {
	active?: SettingsNavValue;
	onChange?: (value: SettingsNavValue) => void;
	workspace: string;
}) {
	return (
		<aside
			className={`ap-sidebar ${className}`}
			aria-label="Workspace settings"
		>
			<button type="button" className="ap-sidebar-home" onClick={onHome}>
				<Icon name="arrow-left" />
				All projects
			</button>
			<div className="ap-sidebar-top-space" />
			<p className="ap-sidebar-heading">WORKSPACE SETTINGS</p>
			<SidebarLinks
				items={settingsNavItems}
				active={active}
				label="Workspace"
				onChange={onChange}
			/>
			<div className="ap-nav-spacer" />
			<div className="ap-sidebar-workspace">
				<p>{workspace} workspace</p>
				<span>Settings apply across your projects.</span>
			</div>
		</aside>
	);
}

export function ProjectToolbar({
	name,
	status = "draft",
	saved = true,
	activity,
	publishing = false,
	publishDisabled,
	publishButtonRef,
	publishControl,
	onPublish,
	className = "",
}: {
	name: string;
	status?: "draft" | "published" | "changes";
	saved?: boolean;
	activity?: string;
	publishing?: boolean;
	publishDisabled?: boolean;
	publishButtonRef?: RefObject<HTMLButtonElement | null>;
	publishControl?: ReactNode;
	onPublish?: () => void;
	className?: string;
}) {
	return (
		<div className={`ap-project-toolbar ${className}`}>
			<h2>{name}</h2>
			<Badge tone={status === "draft" ? "neutral" : "success"}>
				{status === "draft" ? "Unpublished" : "Published"}
			</Badge>
			{status === "changes" && <Badge tone="warning">Draft changes</Badge>}
			<div className="ap-nav-spacer" />
			<span className="ap-toolbar-save" role="status">
				{saved && !activity && <Icon name="check" />}
				{activity ?? (saved ? "All changes saved" : "Unsaved changes")}
			</span>
			{publishControl ?? (
				<Button
					ref={publishButtonRef}
					variant="default"
					loading={publishing}
					disabled={publishDisabled}
					onClick={onPublish}
				>
					{status === "draft" ? "Publish" : "Manage publish"}
				</Button>
			)}
		</div>
	);
}

export type TabState = "default" | "hover" | "selected" | "focus" | "disabled";
export function Tab({
	state = "default",
	children = "Preview",
	className = "",
	disabled,
	...props
}: ComponentProps<"button"> & { state?: TabState }) {
	return (
		<button
			type="button"
			role="tab"
			aria-selected={state === "selected"}
			data-state={state}
			className={`ap-tab ${className}`}
			disabled={disabled || state === "disabled"}
			{...props}
		>
			{typeof children === "string" || typeof children === "number" ? (
				<span className="ap-tab-label">{children}</span>
			) : (
				children
			)}
		</button>
	);
}
export function Tabs({
	tabs,
	value,
	onChange,
	label = "View",
}: {
	tabs: { value: string; label: string; disabled?: boolean }[];
	value: string;
	onChange: (value: string) => void;
	label?: string;
}) {
	const { clearHover, itemEvents, highlight } = useNavigationHighlight();
	function navigate(event: KeyboardEvent<HTMLDivElement>) {
		if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
		const enabled = tabs.filter((tab) => !tab.disabled);
		const current = enabled.findIndex((tab) => tab.value === value);
		const next =
			event.key === "Home"
				? 0
				: event.key === "End"
					? enabled.length - 1
					: (current + (event.key === "ArrowRight" ? 1 : -1) + enabled.length) %
						enabled.length;
		const selected = enabled[next];
		if (!selected) return;
		event.preventDefault();
		onChange(selected.value);
		event.currentTarget
			.querySelector<HTMLButtonElement>(
				`[data-value="${CSS.escape(selected.value)}"]`,
			)
			?.focus();
	}
	return (
		<div
			className="ap-tabs"
			role="tablist"
			aria-label={label}
			onKeyDown={navigate}
			onPointerLeave={clearHover}
		>
			{tabs.map((tab) => (
				<Tab
					key={tab.value}
					data-value={tab.value}
					tabIndex={tab.value === value ? 0 : -1}
					state={
						tab.disabled
							? "disabled"
							: tab.value === value
								? "selected"
								: "default"
					}
					onClick={() => onChange(tab.value)}
					{...itemEvents(tab.value, tab.disabled)}
				>
					{!tab.disabled && highlight(tab.value)}
					<span className="ap-tab-label">{tab.label}</span>
				</Tab>
			))}
		</div>
	);
}
