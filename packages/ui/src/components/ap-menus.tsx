import { Popover } from "@base-ui/react/popover";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { motion } from "motion/react";
import {
	type ComponentProps,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useId,
	useRef,
	useState,
} from "react";
import { Badge } from "./ap-data";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import "../styles/ap-menus.css";

export type MenuItemState =
	| "default"
	| "hover"
	| "selected"
	| "danger"
	| "disabled";
export interface MenuItemProps
	extends Omit<ComponentProps<"button">, "children"> {
	label: string;
	icon?: string | ReactNode;
	state?: MenuItemState;
}

function LeadingIcon({ icon }: { icon: string | ReactNode }) {
	return typeof icon === "string" ? <Icon name={icon} /> : icon;
}

export function MenuItem({
	label,
	icon = "plus",
	state = "default",
	className = "",
	disabled,
	...props
}: MenuItemProps) {
	return (
		<button
			type="button"
			className={`ap-menu-item ${className}`}
			data-state={state}
			disabled={disabled || state === "disabled"}
			{...props}
		>
			{icon && <LeadingIcon icon={icon} />}
			<span>{label}</span>
		</button>
	);
}

export interface RichMenuItemProps extends MenuItemProps {
	description?: string;
	tag?: ReactNode;
	checked?: boolean;
}
export function RichMenuItem({
	label,
	description,
	icon = "briefcase-business",
	state = "default",
	tag,
	checked = false,
	className = "",
	disabled,
	...props
}: RichMenuItemProps) {
	return (
		<button
			type="button"
			className={`ap-rich-menu-item ${className}`}
			data-state={state}
			disabled={disabled || state === "disabled"}
			{...props}
		>
			{icon && <LeadingIcon icon={icon} />}
			<span className="ap-menu-details">
				<span className="ap-menu-label">{label}</span>
				{description && (
					<span className="ap-menu-description">{description}</span>
				)}
			</span>
			{tag}
			{checked && <Icon name="check" />}
		</button>
	);
}

function moveMenuFocus(event: KeyboardEvent<HTMLElement>) {
	if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
	const editing = event.target instanceof HTMLInputElement;
	if (editing && (event.key === "Home" || event.key === "End")) return;
	const items = Array.from(
		event.currentTarget.querySelectorAll<HTMLButtonElement>(
			"[data-menu-choice]:not(:disabled)",
		),
	);
	if (!items.length) return;
	const current = items.indexOf(event.target as HTMLButtonElement);
	const next =
		event.key === "Home"
			? 0
			: event.key === "End"
				? items.length - 1
				: event.key === "ArrowDown"
					? (current + 1) % items.length
					: current <= 0
						? items.length - 1
						: current - 1;
	event.preventDefault();
	items[next]?.focus();
}

export function MenuPanel({
	title,
	onClose,
	wide = false,
	children,
	className = "",
	...props
}: ComponentProps<"div"> & {
	title: string;
	onClose?: () => void;
	wide?: boolean;
}) {
	return (
		<div
			role="dialog"
			aria-label={title}
			tabIndex={-1}
			className={`ap-menu-panel ${wide ? "ap-menu-panel-wide" : ""} ${className}`}
			onKeyDown={moveMenuFocus}
			{...props}
		>
			<div className="ap-menu-heading">
				<span>{title}</span>
				<button
					type="button"
					aria-label={`Close ${title.toLowerCase()}`}
					className="ap-menu-close"
					onClick={onClose}
				>
					<Icon name="close" />
				</button>
			</div>
			{children}
		</div>
	);
}

export function MenuPopover({
	trigger,
	children,
	defaultOpen = false,
	open,
	onOpenChange,
	align = "start",
	side = "bottom",
	sideOffset = 8,
	alignOffset = 0,
}: {
	trigger: ReactElement;
	children: ReactNode | ((close: () => void) => ReactNode);
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	align?: "start" | "center" | "end";
	side?: "top" | "bottom";
	sideOffset?: number;
	alignOffset?: number;
}) {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const shown = open ?? internalOpen;
	const actions = useRef<Popover.Root.Actions>(null);
	const popup = useRef<HTMLDivElement>(null);
	const { reduced } = useMotionEnvironment();
	function change(next: boolean) {
		setInternalOpen(next);
		onOpenChange?.(next);
	}
	return (
		<Popover.Root open={shown} actionsRef={actions} onOpenChange={change}>
			<Popover.Trigger render={trigger} />
			<Popover.Portal>
				<Popover.Positioner
					side={side}
					sideOffset={sideOffset}
					collisionPadding={8}
					align={align}
					alignOffset={alignOffset}
					className="ap-menu-positioner"
				>
					<Popover.Popup
						ref={popup}
						role="presentation"
						className="ap-menu-popup"
						inert={!shown}
						initialFocus={(kind) =>
							kind === "touch"
								? popup.current
								: (popup.current?.querySelector<HTMLElement>(
										"[data-menu-autofocus]:not(:disabled)",
									) ??
									popup.current?.querySelector<HTMLElement>(
										"input,[data-menu-choice]:not(:disabled)",
									) ??
									true)
						}
						render={
							<motion.div
								initial={reduced ? false : { scale: 0.97, y: 6 }}
								animate={{ scale: 1, y: shown || reduced ? 0 : 4 }}
								transition={
									reduced
										? { duration: 0 }
										: shown
											? springs.popover
											: { type: "tween", duration: 0.12, ease: "easeOut" }
								}
							/>
						}
					>
						{typeof children === "function"
							? children(() => actions.current?.close())
							: children}
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}

export interface MenuProject {
	id: string;
	name: string;
	status: "Published" | "Unpublished";
	updated: string;
	icon?: string;
	liveUrl?: string;
}

function MenuSearch({
	value,
	onChange,
	id,
	input,
	onEnter,
}: {
	value: string;
	onChange: (value: string) => void;
	id: string;
	input: RefObject<HTMLInputElement | null>;
	onEnter: () => void;
}) {
	return (
		<label className="ap-menu-search">
			<Icon name="search" />
			<input
				ref={input}
				aria-label="Search projects"
				role="combobox"
				aria-expanded="true"
				aria-controls={id}
				autoComplete="off"
				placeholder="Search projects…"
				value={value}
				onInput={(e) => onChange(e.currentTarget.value)}
				onKeyDown={(event) => {
					if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
					event.preventDefault();
					onEnter();
				}}
			/>
			{value && (
				<button
					type="button"
					className="ap-menu-close"
					aria-label="Clear search"
					onClick={() => {
						onChange("");
						input.current?.focus();
					}}
				>
					<Icon name="close" />
				</button>
			)}
		</label>
	);
}

export interface ProjectPickerProps {
	projects: MenuProject[];
	currentProjectId?: string;
	query?: string;
	onQueryChange?: (query: string) => void;
	onSelect?: (id: string) => void;
	onClose?: () => void;
	onCreate?: () => void;
	onViewAll?: () => void;
	mode?: "switcher" | "search";
	showActions?: boolean;
}

export function ProjectSwitcher({
	projects,
	currentProjectId,
	query: controlledQuery,
	onQueryChange,
	onSelect,
	onClose,
	onCreate,
	onViewAll,
	mode = "switcher",
	showActions = false,
}: ProjectPickerProps) {
	const [query, setQuery] = useState("");
	const value = controlledQuery ?? query;
	const id = useId();
	const input = useRef<HTMLInputElement>(null);
	function change(next: string) {
		setQuery(next);
		onQueryChange?.(next);
	}
	const needle = value.trim().toLocaleLowerCase();
	const results = projects.filter((project) =>
		project.name.toLocaleLowerCase().includes(needle),
	);
	const search = mode === "search";
	return (
		<MenuPanel
			title={search ? "Find a project" : "Switch project"}
			onClose={onClose}
			wide
		>
			<MenuSearch
				value={value}
				onChange={change}
				id={id}
				input={input}
				onEnter={() => {
					if (results[0]) onSelect?.(results[0].id);
				}}
			/>
			{search && results.length > 0 && (
				<p className="ap-menu-count" aria-live="polite">
					{results.length} {results.length === 1 ? "project" : "projects"} found
				</p>
			)}
			<div
				id={id}
				role="listbox"
				aria-label="Projects"
				className="ap-menu-list ap-menu-project-list"
				style={results.length === 0 ? { display: "none" } : undefined}
			>
				{results.map((project) => (
					<RichMenuItem
						key={project.id}
						role="option"
						aria-selected={project.id === currentProjectId}
						data-menu-choice
						label={project.name}
						description={project.updated}
						icon={project.icon ?? "briefcase-business"}
						state={project.id === currentProjectId ? "selected" : "default"}
						tag={
							<Badge
								tone={project.status === "Published" ? "success" : "neutral"}
							>
								{project.status === "Published" ? "Published" : "Draft"}
							</Badge>
						}
						checked={!search && project.id === currentProjectId}
						onClick={() => onSelect?.(project.id)}
					/>
				))}
			</div>
			{results.length === 0 && (
				<>
					<div className="ap-menu-empty" role="status">
						<p>{needle ? "No matching projects" : "No projects yet"}</p>
						{needle && <span>Try a different name or clear your search.</span>}
					</div>
					{needle && (
						<RichMenuItem
							data-menu-choice
							label="Clear search"
							icon="close"
							onClick={() => {
								change("");
								input.current?.focus();
							}}
						/>
					)}
				</>
			)}
			{!search && showActions && (
				<>
					<div className="ap-menu-divider" />
					<RichMenuItem
						data-menu-choice
						label="Create new project"
						icon="plus"
						onClick={onCreate}
					/>
					<RichMenuItem
						data-menu-choice
						label="View all projects"
						icon="briefcase-business"
						onClick={onViewAll}
					/>
				</>
			)}
		</MenuPanel>
	);
}

export function ProjectSearchResults(props: Omit<ProjectPickerProps, "mode">) {
	return <ProjectSwitcher {...props} mode="search" />;
}
export function ProjectSearchEmpty(props: Omit<ProjectPickerProps, "mode">) {
	return <ProjectSwitcher {...props} mode="search" />;
}

export type ProjectFilterValue = "all" | "published" | "unpublished";
export function ProjectFilter({
	projects,
	value = "all",
	onChange,
	onClose,
}: {
	projects: MenuProject[];
	value?: ProjectFilterValue;
	onChange?: (filter: ProjectFilterValue) => void;
	onClose?: () => void;
}) {
	const choices = [
		{ value: "all" as const, label: "All projects", count: projects.length },
		{
			value: "published" as const,
			label: "Published",
			count: projects.filter((p) => p.status === "Published").length,
		},
		{
			value: "unpublished" as const,
			label: "Unpublished",
			count: projects.filter((p) => p.status === "Unpublished").length,
		},
	];
	return (
		<MenuPanel title="Show projects" onClose={onClose}>
			<div role="menu" className="ap-menu-list" aria-label="Project status">
				{choices.map((choice) => (
					<RichMenuItem
						key={choice.value}
						data-menu-choice
						role="menuitemradio"
						aria-checked={value === choice.value}
						label={choice.label}
						icon={null}
						state={value === choice.value ? "selected" : "default"}
						checked={value === choice.value}
						tag={
							<span
								className={`ap-menu-tag ${value === choice.value ? "ap-menu-tag-selected" : ""}`}
							>
								{choice.count}
							</span>
						}
						onClick={() => onChange?.(choice.value)}
					/>
				))}
			</div>
		</MenuPanel>
	);
}

export type ProjectAction =
	| "open"
	| "branding"
	| "copy"
	| "publish"
	| "unpublish"
	| "delete";
export function ProjectActionsMenu({
	project,
	onAction,
	onClose,
	canEdit = true,
}: {
	project: MenuProject;
	onAction?: (action: ProjectAction, projectId: string) => void;
	onClose?: () => void;
	canEdit?: boolean;
}) {
	return (
		<MenuPanel title={project.name} onClose={onClose}>
			<div
				role="menu"
				aria-label={`${project.name} actions`}
				className="ap-menu-list"
			>
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Open project"
					icon="message-square"
					onClick={() => onAction?.("open", project.id)}
				/>
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Edit branding & cover"
					icon="palette"
					disabled={!canEdit}
					onClick={() => onAction?.("branding", project.id)}
				/>
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Copy live link"
					icon="link"
					disabled={!project.liveUrl}
					title={
						!project.liveUrl
							? "Publish this project to get a live link"
							: undefined
					}
					onClick={() => onAction?.("copy", project.id)}
				/>
				<div className="ap-menu-divider" />
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label={
						project.status === "Published"
							? "Unpublish project"
							: "Publish project"
					}
					icon="globe"
					disabled={!canEdit}
					onClick={() =>
						onAction?.(
							project.status === "Published" ? "unpublish" : "publish",
							project.id,
						)
					}
				/>
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Delete project"
					icon="trash"
					state="danger"
					disabled={!canEdit}
					onClick={() => onAction?.("delete", project.id)}
				/>
			</div>
		</MenuPanel>
	);
}

export function CoverActionsMenu({
	hasCover = true,
	canEdit = true,
	onUpload,
	onRemove,
	onClose,
}: {
	hasCover?: boolean;
	canEdit?: boolean;
	onUpload?: () => void;
	onRemove?: () => void;
	onClose?: () => void;
}) {
	return (
		<MenuPanel title="Project cover" onClose={onClose}>
			<div role="menu" aria-label="Cover actions" className="ap-menu-list">
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Upload image"
					icon="upload"
					disabled={!canEdit}
					onClick={onUpload}
				/>
				<RichMenuItem
					data-menu-choice
					role="menuitem"
					label="Remove cover"
					icon="trash"
					state="danger"
					disabled={!canEdit || !hasCover}
					onClick={onRemove}
				/>
			</div>
		</MenuPanel>
	);
}

export function Tooltip({
	label = "More information",
	children,
	open,
}: {
	label?: string;
	children?: ReactElement;
	open?: boolean;
}) {
	const tooltipId = useId();
	if (!children)
		return (
			<span id={tooltipId} className="ap-tooltip" role="tooltip">
				{label}
			</span>
		);
	return (
		<BaseTooltip.Provider>
			<BaseTooltip.Root open={open}>
				<BaseTooltip.Trigger aria-describedby={tooltipId} render={children} />
				<BaseTooltip.Portal>
					<BaseTooltip.Positioner
						sideOffset={8}
						collisionPadding={8}
						className="ap-tooltip-positioner"
					>
						<BaseTooltip.Popup
							id={tooltipId}
							role="tooltip"
							className="ap-tooltip ap-tooltip-popup"
						>
							{label}
						</BaseTooltip.Popup>
					</BaseTooltip.Positioner>
				</BaseTooltip.Portal>
			</BaseTooltip.Root>
		</BaseTooltip.Provider>
	);
}
