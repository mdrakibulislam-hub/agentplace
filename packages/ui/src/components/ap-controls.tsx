import { cn } from "@agentplace/ui/lib/utils";
import {
	type ComponentProps,
	type ReactNode,
	useId,
	useRef,
	useState,
} from "react";
import { Icon } from "./ap-icon";
import { Button, type ButtonProps } from "./button";
import { type FieldState, Input, type InputProps } from "./input";
import "../styles/ap-controls.css";

export function IconButton({
	label,
	name = "arrow-up",
	size = "Small",
	...props
}: Omit<ButtonProps, "children"> & { label: string; name?: string }) {
	return (
		<Button
			{...props}
			size={
				size === "Medium" || size === "medium" || size === "lg"
					? "icon-lg"
					: "icon"
			}
			aria-label={label}
		>
			{!props.loading && props.state !== "loading" && (
				<Icon
					name={name}
					size={
						size === "Medium" || size === "medium" || size === "lg" ? 20 : 16
					}
				/>
			)}
		</Button>
	);
}

export function ProjectActions({
	label = "Project actions",
	className,
	...props
}: Omit<ButtonProps, "children"> & { label?: string }) {
	return (
		<Button
			{...props}
			size="icon"
			variant="ghost"
			aria-label={label}
			className={cn("ap-project-actions", className)}
		>
			<Icon name="more-filled" size={16} />
		</Button>
	);
}

interface FieldPresentation {
	label?: string;
	supportingText?: string;
	errorMessage?: string;
	showLabel?: boolean;
	showSupportingText?: boolean;
	state?: FieldState;
	className?: string;
}

function FieldFrame({
	label = "Label",
	showLabel = true,
	showSupportingText = true,
	supportingText = "Supporting text",
	errorMessage = "This field is required.",
	state,
	className,
	id,
	children,
}: FieldPresentation & { id: string; children: ReactNode }) {
	return (
		<div className={cn("ap-field", className)}>
			{showLabel && (
				<label className="ap-field-label" htmlFor={id}>
					{label}
				</label>
			)}
			{children}
			{showSupportingText && (
				<p
					id={`${id}-support`}
					className={cn(
						"ap-field-support",
						state === "error" && "ap-field-error",
					)}
				>
					{state === "error" ? errorMessage : supportingText}
				</p>
			)}
		</div>
	);
}

export function FormField({
	label,
	supportingText,
	errorMessage,
	showLabel = true,
	showSupportingText = true,
	className,
	id: providedId,
	state = "default",
	...props
}: InputProps & FieldPresentation) {
	const generatedId = useId();
	const id = providedId || generatedId;
	return (
		<FieldFrame
			{...{
				label,
				supportingText,
				errorMessage,
				showLabel,
				showSupportingText,
				className,
				id,
				state,
			}}
		>
			<Input
				{...props}
				id={id}
				state={state}
				aria-label={!showLabel ? label || "Input" : undefined}
				aria-describedby={showSupportingText ? `${id}-support` : undefined}
			/>
		</FieldFrame>
	);
}

export function Textarea({
	label,
	supportingText,
	errorMessage,
	showLabel = true,
	showSupportingText = true,
	className,
	id: providedId,
	state = "default",
	disabled,
	...props
}: ComponentProps<"textarea"> & FieldPresentation) {
	const generatedId = useId();
	const id = providedId || generatedId;
	return (
		<FieldFrame
			{...{
				label,
				supportingText,
				errorMessage,
				showLabel,
				showSupportingText,
				className,
				id,
				state,
			}}
		>
			<textarea
				{...props}
				id={id}
				className="ap-textarea"
				data-state={state}
				disabled={disabled || state === "disabled"}
				aria-invalid={state === "error" || props["aria-invalid"] || undefined}
				aria-label={!showLabel ? label || "Textarea" : undefined}
				aria-describedby={showSupportingText ? `${id}-support` : undefined}
			/>
		</FieldFrame>
	);
}

export function SelectField({
	label = "Project role",
	supportingText,
	errorMessage,
	showLabel = true,
	showSupportingText = true,
	className,
	id: providedId,
	state = "default",
	disabled,
	placeholder = "Choose a role",
	value,
	defaultValue = "",
	onChange,
	options = [
		{ value: "editor", label: "Editor" },
		{ value: "viewer", label: "Viewer" },
	],
	...props
}: Omit<ComponentProps<"select">, "className"> &
	FieldPresentation & {
		placeholder?: string;
		options?: { value: string; label: string; disabled?: boolean }[];
	}) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const [internal, setInternal] = useState(defaultValue);
	const selected = value ?? internal;
	return (
		<FieldFrame
			{...{
				label,
				supportingText,
				errorMessage,
				showLabel,
				showSupportingText,
				className,
				id,
				state,
			}}
		>
			<div className="ap-select-wrap">
				<select
					{...props}
					id={id}
					className="ap-select"
					data-state={state}
					data-empty={!selected}
					value={selected}
					onChange={(event) => {
						setInternal(event.target.value);
						onChange?.(event);
					}}
					disabled={disabled || state === "disabled"}
					aria-invalid={state === "error" || props["aria-invalid"] || undefined}
					aria-label={!showLabel ? label : undefined}
					aria-describedby={showSupportingText ? `${id}-support` : undefined}
				>
					<option value="" disabled>
						{placeholder}
					</option>
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</option>
					))}
				</select>
				<span className="ap-select-icon">
					<Icon name="chevron-down" size={20} />
				</span>
			</div>
		</FieldFrame>
	);
}

export function PasswordField({
	className,
	showRecovery = false,
	recoveryHref = "#forgot-password",
	onRecovery,
	placeholder = "Enter your password",
	id: providedId,
	disabled,
	state = "default",
	...props
}: Omit<InputProps, "type"> & {
	showRecovery?: boolean;
	recoveryHref?: string;
	onRecovery?: () => void;
}) {
	const generatedId = useId();
	const id = providedId || generatedId;
	const [visible, setVisible] = useState(false);
	return (
		<div className={cn("ap-field ap-password-field", className)}>
			<div className="ap-password-label-row">
				<label className="ap-field-label" htmlFor={id}>
					Password
				</label>
				{showRecovery && (
					<a
						className="ap-password-recovery"
						href={recoveryHref}
						onClick={
							onRecovery
								? (event) => {
										event.preventDefault();
										onRecovery();
									}
								: undefined
						}
					>
						Forgot password?
					</a>
				)}
			</div>
			<div
				className="ap-password-control"
				data-state={state}
				aria-invalid={state === "error" || undefined}
			>
				<Input
					{...props}
					id={id}
					type={visible ? "text" : "password"}
					placeholder={placeholder}
					disabled={disabled || state === "disabled"}
					autoComplete={props.autoComplete || "current-password"}
				/>
				<IconButton
					type="button"
					variant="ghost"
					name={visible ? "eye-off" : "eye"}
					label={visible ? "Hide password" : "Show password"}
					aria-pressed={visible}
					disabled={disabled || state === "disabled"}
					onClick={() => setVisible(!visible)}
					className="ap-password-visibility"
				/>
			</div>
		</div>
	);
}

export interface OtpFieldProps {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	processing?: boolean;
	disabled?: boolean;
	error?: string;
	label?: string;
	className?: string;
	initialFocus?: boolean;
	name?: string;
}

/** A six-position presentation of one string value; leading zeroes are preserved. */
export function OtpField({
	value,
	defaultValue = "",
	onValueChange,
	processing = false,
	disabled = false,
	error,
	label = "Verification code",
	className,
	initialFocus = true,
	name,
}: OtpFieldProps) {
	const normalize = (input: string) => input.replace(/\D/g, "").slice(0, 6);
	const toSlots = (input: string) =>
		Array.from({ length: 6 }, (_, index) => normalize(input)[index] || "");
	const [slots, setSlots] = useState(() => toSlots(value ?? defaultValue));
	const lastEmitted = useRef(normalize(value ?? defaultValue));
	const external = value === undefined ? undefined : normalize(value);
	// Slot presentation can retain an empty correction position without shifting later digits.
	// The public form value remains one digit string, including any leading zero.
	const visibleSlots =
		external !== undefined && external !== lastEmitted.current
			? toSlots(external)
			: slots;
	const code = visibleSlots.join("");
	const refs = useRef<(HTMLInputElement | null)[]>([]);
	const id = useId();
	const locked = processing || disabled;
	function update(next: string[], focus?: number) {
		const nextSlots = Array.from({ length: 6 }, (_, index) =>
			(next[index] || "").replace(/\D/g, "").slice(-1),
		);
		const nextCode = nextSlots.join("");
		setSlots(nextSlots);
		lastEmitted.current = nextCode;
		onValueChange?.(nextCode);
		if (focus !== undefined)
			refs.current[Math.min(5, Math.max(0, focus))]?.focus();
	}
	function insert(digits: string, index: number) {
		const entered = normalize(digits);
		const next = [...visibleSlots];
		const start = entered.length === 6 ? 0 : index;
		for (
			let offset = 0;
			offset < entered.length && start + offset < 6;
			offset++
		)
			next[start + offset] = entered[offset] || "";
		update(next, Math.min(5, start + entered.length));
	}
	return (
		<div className={className}>
			<fieldset
				className="ap-otp"
				aria-busy={processing || undefined}
				aria-describedby={error ? `${id}-error` : undefined}
				data-empty-focus={initialFocus && !code}
				disabled={locked}
			>
				<legend className="ap-control-sr-only">{label}</legend>
				{Array.from({ length: 6 }, (_, index) => (
					<Input
						key={`digit-${index + 1}`}
						ref={(element) => {
							refs.current[index] = element;
						}}
						aria-label={`${label}, digit ${index + 1} of 6`}
						aria-invalid={!!error || undefined}
						inputMode="numeric"
						autoComplete={index === 0 ? "one-time-code" : "off"}
						pattern="[0-9]*"
						maxLength={6}
						value={visibleSlots[index] || ""}
						disabled={locked}
						onFocus={(event) => event.target.select()}
						onInput={(event) => {
							const entered = normalize(event.currentTarget.value);
							if (entered.length > 1) insert(entered, index);
							else {
								const next = [...visibleSlots];
								next[index] = entered;
								update(next, entered ? index + 1 : index);
							}
						}}
						onPaste={(event) => {
							const pasted = normalize(event.clipboardData.getData("text"));
							if (pasted) {
								event.preventDefault();
								insert(pasted, index);
							}
						}}
						onKeyDown={(event) => {
							if (event.key === "Backspace" || event.key === "Delete") {
								event.preventDefault();
								const next = [...visibleSlots];
								const position =
									event.key === "Backspace" && !visibleSlots[index]
										? Math.max(0, index - 1)
										: index;
								next[position] = "";
								update(next, position);
							}
							if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
								event.preventDefault();
								refs.current[
									Math.min(
										5,
										Math.max(0, index + (event.key === "ArrowLeft" ? -1 : 1)),
									)
								]?.focus();
							}
						}}
					/>
				))}
			</fieldset>
			{name && <input type="hidden" name={name} value={code} />}
			{error && (
				<p
					id={`${id}-error`}
					className="ap-field-support ap-field-error"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}

export type ToggleProps = Omit<ComponentProps<"button">, "onChange"> & {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	state?: "default" | "hover" | "focus" | "disabled";
	label?: string;
};
export function Checkbox({
	checked,
	defaultChecked = false,
	onCheckedChange,
	state = "default",
	disabled,
	className,
	label = "Checkbox",
	onChange,
	...props
}: Omit<ComponentProps<"input">, "type"> & {
	onCheckedChange?: (checked: boolean) => void;
	state?: "default" | "hover" | "focus" | "disabled";
	label?: string;
}) {
	const [internal, setInternal] = useState(defaultChecked);
	const current = checked ?? internal;
	return (
		<label className="ap-check-target">
			<input
				{...props}
				type="checkbox"
				checked={current}
				aria-checked={current}
				aria-label={props["aria-label"] || label}
				disabled={disabled || state === "disabled"}
				data-state={state}
				className={cn("ap-check", className)}
				onChange={(event) => {
					setInternal(event.target.checked);
					onCheckedChange?.(event.target.checked);
					onChange?.(event);
				}}
			/>
			{current && (
				<span className="ap-check-mark" aria-hidden="true">
					<Icon name="check" size={16} />
				</span>
			)}
		</label>
	);
}
export function Switch({
	checked,
	defaultChecked = false,
	onCheckedChange,
	state = "default",
	disabled,
	className,
	label = "Enable setting",
	onClick,
	...props
}: ToggleProps) {
	const [internal, setInternal] = useState(defaultChecked);
	const current = checked ?? internal;
	return (
		<button
			{...props}
			type="button"
			role="switch"
			aria-checked={current}
			aria-label={props["aria-label"] || label}
			disabled={disabled || state === "disabled"}
			data-state={state}
			className={cn("ap-switch", className)}
			onClick={(event) => {
				setInternal(!current);
				onCheckedChange?.(!current);
				onClick?.(event);
			}}
		>
			<span className="ap-switch-thumb" />
		</button>
	);
}
