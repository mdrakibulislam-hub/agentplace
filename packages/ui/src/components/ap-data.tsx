import { cn } from "@agentplace/ui/lib/utils";
import {
	type ComponentProps,
	type CSSProperties,
	type ReactNode,
	useImperativeHandle,
	useRef,
} from "react";
import { Switch } from "./ap-controls";
import { Icon } from "./ap-icon";
import { useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import "../styles/ap-data.css";

export type BadgeTone =
	| "neutral"
	| "success"
	| "warning"
	| "error"
	| "info"
	| "accent";
export function Badge({
	tone = "neutral",
	children = "Status",
	className,
	...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
	return (
		<span {...props} className={cn("ap-badge", className)} data-tone={tone}>
			{typeof children === "string" || typeof children === "number" ? (
				<span className="ap-badge-label">{children}</span>
			) : (
				children
			)}
		</span>
	);
}

export function Avatar({
	initials = "AP",
	size = "small",
	src,
	alt,
	className,
	...props
}: ComponentProps<"span"> & {
	initials?: string;
	size?: "small" | "medium" | "large";
	src?: string;
	alt?: string;
}) {
	return (
		<span
			{...props}
			className={cn("ap-avatar", className)}
			data-size={size}
			role="img"
			aria-label={alt || initials}
		>
			{src ? <img src={src} alt="" /> : initials}
		</span>
	);
}

export function Spinner({
	size = "small",
	label = "Loading",
	className,
	style,
	ref: externalRef,
	...props
}: ComponentProps<"span"> & { size?: "small" | "medium"; label?: string }) {
	const ref = useRef<HTMLSpanElement | null>(null);
	useImperativeHandle(externalRef, () => ref.current as HTMLSpanElement);
	const environment = useMotionEnvironment(ref);
	return (
		<span
			{...props}
			ref={ref}
			style={{
				...style,
				animationPlayState:
					environment.paused || environment.offscreen.current
						? "paused"
						: "running",
				animation: environment.reduced ? "none" : undefined,
			}}
			className={cn("ap-spinner", className)}
			role="status"
			aria-label={label}
		>
			<Icon name="loader" size={size === "medium" ? 24 : 16} />
		</span>
	);
}

export function LoadingStatus({
	children,
	className,
}: {
	children: string;
	className?: string;
}) {
	return (
		<span className={cn("ap-loading-status", className)} role="status">
			<Spinner aria-hidden="true" />
			{children}
		</span>
	);
}

export function Surface({
	elevation = "flat",
	className,
	children,
	...props
}: ComponentProps<"div"> & {
	elevation?: "flat" | "resting" | "panel" | "overlay";
}) {
	return (
		<div
			{...props}
			className={cn("ap-surface", className)}
			data-elevation={elevation}
		>
			{children}
		</div>
	);
}

export interface CreditValues {
	remaining: number | null;
	allocation: number | null;
}
export function creditRatio({
	remaining,
	allocation,
}: CreditValues): number | null {
	return remaining === null ||
		allocation === null ||
		!Number.isFinite(remaining) ||
		!Number.isFinite(allocation) ||
		allocation <= 0
		? null
		: Math.max(0, Math.min(1, remaining / allocation));
}

export function CreditRing({
	remaining,
	allocation,
	size = 16,
	className,
}: CreditValues & { size?: number; className?: string }) {
	const ratio = creditRatio({ remaining, allocation });
	const label =
		ratio === null
			? "Credit balance unavailable"
			: `${remaining?.toLocaleString()} of ${allocation?.toLocaleString()} credits remaining`;
	return (
		<span
			className={cn("ap-credit-ring", className)}
			role="progressbar"
			aria-label={label}
			aria-valuemin={0}
			aria-valuemax={allocation && allocation > 0 ? allocation : undefined}
			aria-valuenow={
				ratio === null
					? undefined
					: Math.max(0, Math.min(allocation ?? 0, remaining ?? 0))
			}
			style={{ width: size, height: size }}
		>
			<svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true">
				<circle
					cx="8"
					cy="8"
					r="6.72"
					fill="none"
					stroke="var(--border-default)"
					strokeWidth="2.56"
				/>
				{ratio !== null && (
					<circle
						cx="8"
						cy="8"
						r="6.72"
						fill="none"
						stroke="var(--action-default)"
						strokeWidth="2.56"
						pathLength="100"
						strokeDasharray={`${ratio * 100} 100`}
						transform="rotate(-90 8 8)"
					/>
				)}
			</svg>
		</span>
	);
}

export function CreditBalance({
	remaining,
	allocation,
	className,
	style,
}: CreditValues & { className?: string; style?: CSSProperties }) {
	const ratio = creditRatio({ remaining, allocation });
	return (
		<div
			className={cn("ap-credit-balance", className)}
			style={style}
			role="progressbar"
			aria-label={
				ratio === null ? "Credit balance unavailable" : "Credits remaining"
			}
			aria-valuemin={0}
			aria-valuemax={allocation && allocation > 0 ? allocation : undefined}
			aria-valuenow={
				ratio === null
					? undefined
					: Math.max(0, Math.min(allocation ?? 0, remaining ?? 0))
			}
		>
			{ratio !== null && <span style={{ width: `${ratio * 100}%` }} />}
		</div>
	);
}

export interface CapabilityRowProps {
	name: string;
	description: string;
	state?: "enabled" | "available";
	enabled?: boolean;
	onEnabledChange?: (enabled: boolean) => void;
	onConfigure?: () => void;
	onAdd?: () => void;
	disabled?: boolean;
	className?: string;
	icon?: ReactNode;
}
export function CapabilityRow({
	name,
	description,
	state = "enabled",
	enabled = true,
	onEnabledChange,
	onConfigure,
	onAdd,
	disabled,
	className,
	icon,
}: CapabilityRowProps) {
	return (
		<div className={cn("ap-capability-row", className)}>
			<div className="ap-row-leading">
				{icon || <Icon name="puzzle" size={20} />}
			</div>
			<div className="ap-row-details">
				<p className="ap-row-title">{name}</p>
				<p className="ap-row-description">{description}</p>
			</div>
			<div className="ap-row-actions">
				{state === "enabled" ? (
					<>
						<Badge tone={enabled ? "success" : "neutral"}>
							{enabled ? "Enabled" : "Disabled"}
						</Badge>
						<Button variant="ghost" disabled={disabled} onClick={onConfigure}>
							Configure
						</Button>
						<Switch
							label={`Enable ${name}`}
							checked={enabled}
							onCheckedChange={onEnabledChange}
							disabled={disabled}
						/>
					</>
				) : (
					<Button variant="secondary" disabled={disabled} onClick={onAdd}>
						Add skill
					</Button>
				)}
			</div>
		</div>
	);
}

export function VersionRow({
	version,
	title,
	meta,
	current = true,
	status,
	actionLabel = "View",
	onView,
	className,
}: {
	version: string;
	title: string;
	meta: string;
	current?: boolean;
	status?: "Current draft" | "Live version" | "Draft";
	actionLabel?: string;
	onView?: () => void;
	className?: string;
}) {
	return (
		<div className={cn("ap-version-row", className)}>
			<span className="ap-row-leading ap-version-number">{version}</span>
			<div className="ap-row-details">
				<p className="ap-row-title">{title}</p>
				<p className="ap-row-description">{meta}</p>
			</div>
			<div className="ap-row-actions">
				{(status || current) && (
					<Badge tone={status === "Live version" ? "success" : "neutral"}>
						{status ?? "Current draft"}
					</Badge>
				)}
				<Button variant="ghost" onClick={onView}>
					{actionLabel}
				</Button>
			</div>
		</div>
	);
}

export function StaffRow({
	name,
	email,
	workspaceRole,
	initials,
	projectLabel = "All projects",
	onProjects,
	className,
}: {
	name: string;
	email: string;
	workspaceRole: string;
	initials?: string;
	projectLabel?: string;
	onProjects?: () => void;
	className?: string;
}) {
	return (
		<div className={cn("ap-staff-row", className)}>
			<Avatar
				initials={initials || name.slice(0, 2).toUpperCase()}
				size="medium"
				alt={name}
			/>
			<div className="ap-staff-person">
				<p className="ap-staff-name">{name}</p>
				<p className="ap-staff-email">{email}</p>
			</div>
			<p className="ap-staff-role">{workspaceRole}</p>
			<Button
				variant="ghost"
				icon={<Icon name="chevron-down" size={16} />}
				onClick={onProjects}
			>
				{projectLabel}
			</Button>
		</div>
	);
}

export function LibraryItem({
	name,
	description,
	selected = false,
	icon,
	className,
	...props
}: Omit<ComponentProps<"button">, "name"> & {
	name: string;
	description: string;
	selected?: boolean;
	icon?: ReactNode;
}) {
	return (
		<button
			{...props}
			type="button"
			className={cn("ap-library-item", className)}
			aria-pressed={selected}
		>
			<span className="ap-library-icon">
				{icon || <Icon name="puzzle" size={20} />}
			</span>
			<span className="ap-library-details">
				<span className="ap-library-title">{name}</span>
				<span className="ap-library-description">{description}</span>
			</span>
		</button>
	);
}
