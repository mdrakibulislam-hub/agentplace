import { cn } from "@agentplace/ui/lib/utils";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { animate } from "motion";
import { useMotionValue, useMotionValueEvent } from "motion/react";
import { type ReactNode, useEffect, useImperativeHandle, useRef } from "react";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import "../styles/ap-controls.css";

const buttonVariants = cva("ap-button", {
	variants: {
		variant: {
			default: "ap-button-primary",
			primary: "ap-button-primary",
			secondary: "ap-button-secondary",
			outline: "ap-button-secondary",
			ghost: "ap-button-ghost",
			destructive: "ap-button-danger",
			danger: "ap-button-danger",
			link: "ap-button-link",
		},
		size: {
			default: "ap-button-small",
			Small: "ap-button-small",
			small: "ap-button-small",
			Medium: "ap-button-medium",
			medium: "ap-button-medium",
			xs: "ap-button-small",
			sm: "ap-button-small",
			lg: "ap-button-medium",
			icon: "ap-button-small ap-button-square",
			"icon-xs": "ap-button-small ap-button-square",
			"icon-sm": "ap-button-small ap-button-square",
			"icon-lg": "ap-button-medium ap-button-square",
		},
	},
	defaultVariants: { variant: "default", size: "default" },
});
export type ControlState =
	| "default"
	| "hover"
	| "pressed"
	| "focus"
	| "disabled"
	| "loading";
export type ButtonProps = Omit<ButtonPrimitive.Props, "className"> &
	VariantProps<typeof buttonVariants> & {
		className?: string;
		loading?: boolean;
		reserveLoadingSpace?: boolean;
		state?: ControlState;
		icon?: ReactNode;
	};
function Button({
	className,
	variant = "default",
	size = "default",
	children,
	loading,
	reserveLoadingSpace = false,
	disabled,
	state = "default",
	icon,
	style,
	ref: externalRef,
	...props
}: ButtonProps) {
	const environment = useMotionEnvironment();
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const pressScale = useMotionValue(1);
	const busy = loading || state === "loading";
	const unavailable = disabled || state === "disabled" || busy;
	useImperativeHandle(
		externalRef,
		() => buttonRef.current as HTMLButtonElement,
	);
	useMotionValueEvent(pressScale, "change", (latest) =>
		buttonRef.current?.style.setProperty("--ap-press-scale", String(latest)),
	);
	useEffect(() => {
		if (environment.reduced) {
			pressScale.stop();
			pressScale.set(1);
		} else if (unavailable) {
			// A disabled control can lose its keyup or pointerup after submitting.
			animate(pressScale, 1, springs.press);
		}
	}, [environment.reduced, pressScale, unavailable]);
	function press(target: number) {
		if (!environment.reduced) animate(pressScale, target, springs.press);
	}
	return (
		<ButtonPrimitive
			{...props}
			data-slot="button"
			data-state={busy ? "loading" : state}
			aria-busy={busy || undefined}
			disabled={unavailable}
			className={cn(buttonVariants({ variant, size }), className)}
			style={style}
			ref={buttonRef}
			onPointerDown={(event) => {
				props.onPointerDown?.(event);
				if (!unavailable && !event.defaultPrevented && event.button === 0)
					press(0.97);
			}}
			onPointerUp={(event) => {
				props.onPointerUp?.(event);
				press(1);
			}}
			onPointerCancel={(event) => {
				props.onPointerCancel?.(event);
				press(1);
			}}
			onPointerLeave={(event) => {
				props.onPointerLeave?.(event);
				press(1);
			}}
			onKeyDown={(event) => {
				props.onKeyDown?.(event);
				if (
					!unavailable &&
					!event.defaultPrevented &&
					["Enter", " "].includes(event.key)
				)
					press(0.97);
			}}
			onKeyUp={(event) => {
				props.onKeyUp?.(event);
				press(1);
			}}
			onBlur={(event) => {
				props.onBlur?.(event);
				press(1);
			}}
		>
			<span className="ap-button-contents">
				{busy ? (
					<span
						className="ap-button-spinner"
						aria-hidden="true"
						style={{
							animationPlayState: environment.paused ? "paused" : "running",
							animation: environment.reduced ? "none" : undefined,
						}}
					>
						<Icon
							name="loader"
							size={
								size === "Medium" ||
								size === "medium" ||
								size === "lg" ||
								size === "icon-lg"
									? 20
									: 16
							}
						/>
					</span>
				) : (
					icon ||
					(reserveLoadingSpace && (
						<span className="ap-button-reserved-icon" aria-hidden="true">
							<Icon
								name="loader"
								size={
									size === "Medium" || size === "medium" || size === "lg"
										? 20
										: 16
								}
							/>
						</span>
					))
				)}
				{typeof children === "string" || typeof children === "number" ? (
					<span className="ap-button-label">{children}</span>
				) : (
					children
				)}
			</span>
		</ButtonPrimitive>
	);
}

export { Button, buttonVariants };
