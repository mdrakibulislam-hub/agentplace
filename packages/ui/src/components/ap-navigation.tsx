import type { ComponentProps, KeyboardEvent, ReactNode } from "react";
import { Logo } from "./ap-brand";
import { Avatar, Badge, CreditRing } from "./ap-data";
import { Icon } from "./ap-icon";
import { Button } from "./button";
import "../styles/ap-navigation.css";

export interface GlobalHeaderProps {
	project: string;
	type?: "default" | "secondary";
	remainingCredits?: number | null;
	allocatedCredits?: number | null;
	initials?: string;
	logo?: ReactNode;
	projectSwitcher?: ReactNode;
	accountMenu?: ReactNode;
	onProjectSwitch?: () => void;
	onCredits?: () => void;
	onSettings?: () => void;
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
	accountMenu,
	onProjectSwitch,
	onCredits,
	onSettings,
	onAccount,
	className = "",
}: GlobalHeaderProps) {
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
			<button type="button" className="ap-header-credits" onClick={onCredits}>
				<CreditRing
					remaining={remainingCredits}
					allocation={allocatedCredits}
					size={16}
				/>
				<span>
					{remainingCredits === null
						? "Credits unavailable"
						: `${new Intl.NumberFormat().format(remainingCredits)} credits`}
				</span>
			</button>
			<Button
				variant="ghost"
				onClick={onSettings}
				icon={<Icon name="settings" />}
			>
				Settings
			</Button>
			{accountMenu ?? (
				<button
					type="button"
					aria-label="Open account menu"
					className="ap-header-account"
					onClick={onAccount}
				>
					<Avatar initials={initials} size="medium" />
				</button>
			)}
		</header>
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
export function ProjectNavigation({
	active = "Chat",
	onChange,
	onHome,
	onNewConversation,
	onManageAccess,
	onConversation,
	conversations = [],
	className = "",
}: SidebarProps & {
	active?: ProjectNavValue;
	onChange?: (value: ProjectNavValue) => void;
	onNewConversation?: () => void;
	onManageAccess?: () => void;
	onConversation?: (id: string) => void;
	conversations?: {
		id: string;
		title: string;
		selected?: boolean;
	}[];
}) {
	return (
		<aside
			className={`ap-sidebar ap-project-sidebar ${className}`}
			aria-label="Project navigation"
		>
			<button type="button" className="ap-sidebar-home" onClick={onHome}>
				<Icon name="arrow-left" />
				All projects
			</button>
			<nav className="ap-sidebar-conversations" aria-label="Conversations">
				<button
					type="button"
					className="ap-sidebar-new"
					onClick={onNewConversation}
				>
					<Icon name="plus" />
					New chat
				</button>
				{conversations.map((conversation) => (
					<button
						key={conversation.id}
						type="button"
						className="ap-conversation-item"
						aria-current={
							active === "Chat" && conversation.selected ? "true" : undefined
						}
						title={conversation.title}
						onClick={() => onConversation?.(conversation.id)}
					>
						<span>{conversation.title}</span>
					</button>
				))}
			</nav>
			<nav className="ap-sidebar-links" aria-label="Project">
				{projectNavItems.map((item) => (
					<button
						key={item.label}
						type="button"
						className="ap-sidebar-link"
						aria-current={active === item.label ? "page" : undefined}
						onClick={() => onChange?.(item.label)}
					>
						<Icon name={item.icon} />
						{item.label}
					</button>
				))}
			</nav>
			<div className="ap-nav-spacer" />
			<button
				type="button"
				className="ap-sidebar-access"
				onClick={onManageAccess}
			>
				<Icon name="users" />
				Project access
			</button>
		</aside>
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
			<nav className="ap-sidebar-links" aria-label="Workspace">
				{settingsNavItems.map((item) => (
					<button
						key={item.label}
						type="button"
						className="ap-sidebar-link"
						aria-current={active === item.label ? "page" : undefined}
						onClick={() => onChange?.(item.label)}
					>
						<Icon name={item.icon} />
						{item.label}
					</button>
				))}
			</nav>
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
	publishing = false,
	publishDisabled,
	publishControl,
	onPublish,
	className = "",
}: {
	name: string;
	status?: "draft" | "published" | "changes";
	saved?: boolean;
	publishing?: boolean;
	publishDisabled?: boolean;
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
				{saved && <Icon name="check" />}
				{saved ? "All changes saved" : "Unsaved changes"}
			</span>
			{publishControl ?? (
				<Button
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
				>
					{tab.label}
				</Tab>
			))}
		</div>
	);
}
