import { Popover } from "@base-ui/react/popover";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { motion } from "motion/react";
import {
	type ComponentProps,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
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
					: (current - 1 + items.length) % items.length;
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
	const actions = useRef<{ unmount: () => void; close: () => void } | null>(
		null,
	);
	const popup = useRef<HTMLDivElement>(null);
	const { reduced } = useMotionEnvironment(popup);
	function change(next: boolean) {
		setInternalOpen(next);
		onOpenChange?.(next);
	}
	return (
		<Popover.Root
			open={shown}
			actionsRef={actions}
			onOpenChange={(next, details) => {
				if (!next) details.preventUnmountOnClose();
				change(next);
			}}
		>
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
						initialFocus={(kind) =>
							kind === "touch"
								? popup.current
								: (popup.current?.querySelector<HTMLElement>(
										"input,[data-menu-choice]:not(:disabled)",
									) ?? true)
						}
						render={
							<motion.div
								initial={reduced ? false : { opacity: 0, scale: 0.97, y: 6 }}
								animate={
									shown
										? { opacity: 1, scale: 1, y: 0 }
										: { opacity: 0, scale: 1, y: reduced ? 0 : 4 }
								}
								transition={
									reduced
										? { duration: 0 }
										: shown
											? {
													...springs.popover,
													opacity: { type: "tween", duration: 0.14 },
												}
											: { type: "tween", duration: 0.12, ease: "easeOut" }
								}
								onAnimationComplete={() => {
									if (!shown) actions.current?.unmount();
								}}
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
}: {
	value: string;
	onChange: (value: string) => void;
	id: string;
}) {
	return (
		<label className="ap-menu-search">
			<Icon name="search" />
			<input
				aria-label="Search projects"
				role="combobox"
				aria-expanded="true"
				aria-controls={id}
				autoComplete="off"
				placeholder="Search projects…"
				value={value}
				onInput={(e) => onChange(e.currentTarget.value)}
			/>
			{value && (
				<button
					type="button"
					className="ap-menu-close"
					aria-label="Clear search"
					onClick={() => onChange("")}
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
}: ProjectPickerProps) {
	const [query, setQuery] = useState("");
	const value = controlledQuery ?? query;
	const id = useId();
	function change(next: string) {
		setQuery(next);
		onQueryChange?.(next);
	}
	const results = projects.filter((project) =>
		project.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
	);
	const search = mode === "search";
	return (
		<MenuPanel
			title={search ? "Find a project" : "Switch project"}
			onClose={onClose}
			wide
		>
			<MenuSearch value={value} onChange={change} id={id} />
			{search && results.length > 0 && (
				<p className="ap-menu-count" aria-live="polite">
					{results.length} {results.length === 1 ? "project" : "projects"} found
				</p>
			)}
			<div
				id={id}
				role="listbox"
				aria-label="Projects"
				className="ap-menu-list"
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
					<div className="ap-menu-empty">
						<p>No matching projects</p>
						<span>Try a different name or clear your search.</span>
					</div>
					<RichMenuItem
						data-menu-choice
						label="Clear search"
						icon="close"
						onClick={() => change("")}
					/>
				</>
			)}
			{!search && (
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
					<BaseTooltip.Positioner sideOffset={8} collisionPadding={8}>
						<BaseTooltip.Popup
							id={tooltipId}
							role="tooltip"
							className="ap-tooltip"
						>
							{label}
						</BaseTooltip.Popup>
					</BaseTooltip.Positioner>
				</BaseTooltip.Portal>
			</BaseTooltip.Root>
		</BaseTooltip.Provider>
	);
}
