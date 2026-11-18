import type { CSSProperties } from "react";
import { useRef } from "react";
import { cn } from "../lib/utils";
import type { MascotPhase } from "./ap-brand";
import { Mascot } from "./ap-brand";
import { useMotionEnvironment } from "./ap-motion";
import "../styles/ap-ambient.css";

export function WorkingMascot({
	motion = "Loop",
	nativePreview = false,
	phase = "Rest",
	className,
}: {
	motion?: "Loop" | "Reduced";
	nativePreview?: boolean;
	phase?: MascotPhase;
	className?: string;
}) {
	return (
		<span className={cn("ap-working-mascot", className)}>
			<Mascot
				animated={motion === "Loop" && phase === "Rest"}
				phase={phase}
				nativePreview={nativePreview}
			/>
		</span>
	);
}

/** Mount only while work is active; callers own cancellation, success and failure. No simulated progress. */
export function WorkingIndicator({
	title = "Building your first draft",
	detail = "Creating visitor experience…",
	motion = "Loop",
	nativePreview = false,
	active = true,
	className,
}: {
	title?: string;
	detail?: string;
	motion?: "Loop" | "Reduced";
	nativePreview?: boolean;
	active?: boolean;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const environment = useMotionEnvironment(
		ref,
		motion === "Reduced",
		active,
		false,
	);
	if (!active) return null;
	return (
		<div
			ref={ref}
			className={cn("ap-working-indicator", className)}
			role="status"
			aria-live="polite"
			data-ap-working-cohort="pending"
			data-motion={environment.reduced ? "still" : "flow"}
			style={
				{ "--ap-working-cycle": nativePreview ? "6.8s" : "2s" } as CSSProperties
			}
		>
			<span className="ap-working-diffusion" aria-hidden="true" />
			<WorkingMascot
				motion={environment.reduced ? "Reduced" : "Loop"}
				nativePreview={nativePreview}
			/>
			<div className="ap-working-message">
				<p>{title}</p>
				<p>{detail}</p>
			</div>
		</div>
	);
}

export function WorkingIndicatorPreview() {
	return (
		<section className="ap-working-preview">
			<h2>A little life while we work</h2>
			<WorkingIndicator nativePreview />
			<WorkingIndicator
				title="Reduced motion"
				detail="Same status, without movement."
				motion="Reduced"
				nativePreview
			/>
		</section>
	);
}
