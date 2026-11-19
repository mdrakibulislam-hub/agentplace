import type { CSSProperties } from "react";
import { useRef } from "react";
import { cn } from "../lib/utils";
import { useMotionEnvironment } from "./ap-motion";
import "../styles/ap-ambient.css";

type AmbientMotion = "Flow" | "Still";
type AmbientPhase = 0 | 1 | 2 | 3;

export function AuthGradient({
	motion = "Flow",
	phase = 0,
	className,
}: {
	motion?: AmbientMotion;
	phase?: AmbientPhase;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const environment = useMotionEnvironment(ref, motion === "Still");
	return (
		<div
			ref={ref}
			aria-hidden="true"
			className={cn(
				"ap-auth-gradient",
				environment.paused && "is-paused",
				className,
			)}
			data-motion={environment.reduced ? "still" : "flow"}
			style={{ "--ap-auth-gradient-phase": phase } as CSSProperties}
		>
			<div className="ap-auth-color-field ap-auth-color-field-left" />
			<div className="ap-auth-color-field ap-auth-color-field-right" />
		</div>
	);
}

/** Decorative 32-second field. Phase exists only for inspection of Figma's internal choreography. */
export function AmbientBottomGradient({
	motion = "Flow",
	phase = 0,
	variant = "reference",
	className,
	style,
}: {
	motion?: AmbientMotion;
	phase?: AmbientPhase;
	variant?: "reference" | "page" | "preview";
	className?: string;
	style?: CSSProperties;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const environment = useMotionEnvironment(ref, motion === "Still");
	return (
		<div
			ref={ref}
			aria-hidden="true"
			className={cn("ap-ambient", environment.paused && "is-paused", className)}
			data-motion={environment.reduced ? "still" : "flow"}
			data-phase={phase}
			data-variant={variant}
			style={
				{ "--ap-ambient-delay": `${phase * -8}s`, ...style } as CSSProperties
			}
		>
			<div className="ap-ambient-field ap-ambient-main" />
			{variant !== "preview" && (
				<div className="ap-ambient-field ap-ambient-inner" />
			)}
		</div>
	);
}
