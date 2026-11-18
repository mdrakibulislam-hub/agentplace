import type { CSSProperties } from "react";
import { useRef } from "react";
import { cn } from "../lib/utils";
import { useMotionEnvironment } from "./ap-motion";
import "../styles/ap-ambient.css";

/** Decorative 32-second field. Phase exists only for inspection of Figma's internal choreography. */
export function AmbientBottomGradient({
	motion = "Flow",
	phase = 0,
	className,
	style,
}: {
	motion?: "Flow" | "Still";
	phase?: 0 | 1 | 2 | 3;
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
			style={
				{ "--ap-ambient-delay": `${phase * -8}s`, ...style } as CSSProperties
			}
		>
			<div className="ap-ambient-field ap-ambient-main" />
			<div className="ap-ambient-field ap-ambient-inner" />
		</div>
	);
}
