import { cn } from "@agentplace/ui/lib/utils";
import type { ComponentProps } from "react";
import "../styles/ap-controls.css";
export type FieldState =
	| "default"
	| "hover"
	| "focus"
	| "filled"
	| "error"
	| "disabled";
export type InputProps = ComponentProps<"input"> & { state?: FieldState };
export function Input({
	className,
	type,
	state = "default",
	disabled,
	...props
}: InputProps) {
	return (
		<input
			{...props}
			type={type}
			data-slot="input"
			data-state={state}
			disabled={disabled || state === "disabled"}
			aria-invalid={state === "error" || props["aria-invalid"] || undefined}
			className={cn("ap-input", className)}
		/>
	);
}
