import { animate } from "motion";
import type { RefObject } from "react";
import { useEffect, useRef, useSyncExternalStore } from "react";

export const springs = {
	press: { type: "spring", mass: 1, stiffness: 520, damping: 38 },
	popover: { type: "spring", mass: 1, stiffness: 420, damping: 32 },
	dialog: { type: "spring", mass: 1, stiffness: 360, damping: 30 },
	layout: { type: "spring", mass: 1, stiffness: 320, damping: 32 },
	success: { type: "spring", mass: 1, stiffness: 480, damping: 30 },
} as const;

function subscribeEnvironment(onChange: () => void) {
	const query = window.matchMedia("(prefers-reduced-motion: reduce)");
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-ap-motion"],
	});
	query.addEventListener("change", onChange);
	document.addEventListener("visibilitychange", onChange);
	return () => {
		query.removeEventListener("change", onChange);
		document.removeEventListener("visibilitychange", onChange);
		observer.disconnect();
	};
}

function environmentSnapshot() {
	return `${document.documentElement.dataset.apMotion === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full"}:${document.visibilityState}`;
}

/** Reads OS and Storybook/app preferences before painting any decorative motion. */
export function useMotionEnvironment<T extends HTMLElement>(
	ref?: RefObject<T | null>,
	reduced = false,
	active = true,
	observePlayback = true,
) {
	const state = useSyncExternalStore(
		subscribeEnvironment,
		environmentSnapshot,
		() => "reduced:hidden",
	);
	const offscreen = useRef(false);
	const motionReduced = reduced || state.startsWith("reduced");
	const paused = state.endsWith("hidden");
	useEffect(() => {
		const node = ref?.current;
		if (!node || !active || !observePlayback) return;
		const updatePlayback = () => {
			for (const animation of node.getAnimations({ subtree: true })) {
				if (motionReduced || paused || offscreen.current) animation.pause();
				else animation.play();
			}
		};
		const observer = new IntersectionObserver(([entry]) => {
			offscreen.current = !entry?.isIntersecting;
			updatePlayback();
		});
		observer.observe(node);
		updatePlayback();
		return () => observer.disconnect();
	}, [ref, active, observePlayback, motionReduced, paused]);
	return {
		reduced: motionReduced,
		paused,
		offscreen,
	};
}

// The native Figma motion snippets use these exact spring curves.
export const nativeSettle = (t: number) =>
	1 -
	Math.exp(-t * 7.7184) *
		(Math.cos(t * 6.1777) + 1.2494 * Math.sin(t * 6.1777));

/** Native 2s Figma mascot timeline, coordinated from one lifecycle and paused without resetting its phase. */
export function useMascotTimeline(
	ref: RefObject<HTMLElement | null>,
	enabled: boolean,
	nativePreview = false,
) {
	// This timeline owns playback for the whole cohort, including its CSS field.
	const environment = useMotionEnvironment(ref, !enabled, true, false);
	useEffect(() => {
		const root = ref.current;
		if (!root || environment.reduced) return;
		const artwork = root.querySelector<HTMLElement>("[data-ap-mascot-artwork]");
		if (!artwork) return;
		const cohort =
			root.closest<HTMLElement>("[data-ap-working-cohort]") ?? root;
		const workingCohort = cohort.hasAttribute("data-ap-working-cohort");
		if (workingCohort) cohort.dataset.apWorkingCohort = "pending";
		const duration = nativePreview ? 6.8 : 2;
		const geometryTimes = nativePreview
			? [0, 0.0471, 0.0618, 0.0956, 0.1294, 0.1515, 1]
			: [0, 0.16, 0.21, 0.325, 0.44, 0.515, 1];
		const translationTimes = nativePreview
			? [0, 0.0471, 0.0618, 0.0956, 0.1294, 1]
			: [0, 0.16, 0.21, 0.325, 0.44, 1];
		const blinkTimes = nativePreview
			? [0, 0.25, 0.2647, 0.2721, 0.3, 1]
			: [0, 0.85, 0.9, 0.925, 0.9999, 1];
		const easing = [
			"linear",
			"easeIn",
			"easeOut",
			"easeIn",
			nativeSettle,
			"linear",
		] as const;
		const controls = [
			animate(
				artwork,
				{
					scaleX: [1, 1, 1.035, 0.985, 1.04, 1, 1],
					scaleY: [1, 1, 0.965, 1.025, 0.96, 1, 1],
					y: [0, 0, 0.529, -2.643, 0, 0],
				},
				{
					scaleX: {
						duration,
						times: geometryTimes,
						ease: [...easing],
						repeat: Number.POSITIVE_INFINITY,
					},
					scaleY: {
						duration,
						times: geometryTimes,
						ease: [...easing],
						repeat: Number.POSITIVE_INFINITY,
					},
					y: {
						duration,
						times: translationTimes,
						ease: ["linear", "easeIn", "easeOut", "easeIn", "easeOut"],
						repeat: Number.POSITIVE_INFINITY,
					},
				},
			),
		];
		for (const lid of root.querySelectorAll<HTMLElement>(
			"[data-ap-mascot-lid]",
		)) {
			const direction = lid.dataset.apMascotLid === "upper" ? 1 : -1;
			controls.push(
				animate(
					lid,
					{
						// Native 0.003px lid thickness, expressed on a 1px box so
						// browser layout precision cannot collapse the blink to zero.
						scaleY: [0.003, 0.003, 3.75, 3.75, 0.259338135, 0.259338135],
						y: [
							0,
							0,
							direction * 1.651,
							direction * 1.651,
							direction * 0.113,
							direction * 0.113,
						],
					},
					{
						duration,
						times: blinkTimes,
						ease: ["linear", "easeIn", "linear", "easeOut", "linear"],
						repeat: Number.POSITIVE_INFINITY,
					},
				),
			);
		}
		// Resolve Motion's composed transform tracks before collecting their WAAPI
		// animations after this task. They then share one clock with both CSS axes.
		for (const control of controls) control.play();
		let animations: Animation[] = [];
		let ready = false;
		let disposed = false;
		let playing = true;
		let heldTime = 0;
		const updatePlayback = () => {
			if (!ready) return;
			const shouldPlay = !document.hidden && !environment.offscreen.current;
			if (shouldPlay === playing) return;
			if (shouldPlay) {
				const startTime = Number(document.timeline.currentTime) - heldTime;
				for (const animation of animations) animation.startTime = startTime;
			} else {
				heldTime = Number(animations[0]?.currentTime ?? 0);
				for (const animation of animations) {
					animation.pause();
					animation.currentTime = heldTime;
				}
			}
			playing = shouldPlay;
		};
		queueMicrotask(() => {
			if (disposed) return;
			if (workingCohort) cohort.dataset.apWorkingCohort = "ready";
			animations = cohort.getAnimations({ subtree: true });
			const startTime = Number(document.timeline.currentTime);
			for (const animation of animations) {
				// Motion's grouped transforms encode construction delay as an
				// iteration offset. Remove it so every native track starts at zero.
				animation.effect?.updateTiming({ iterationStart: 0 });
				animation.startTime = startTime;
			}
			ready = true;
			updatePlayback();
		});
		const visibility = new IntersectionObserver(([entry]) => {
			environment.offscreen.current = !entry?.isIntersecting;
			updatePlayback();
		});
		visibility.observe(cohort);
		document.addEventListener("visibilitychange", updatePlayback);
		updatePlayback();
		return () => {
			disposed = true;
			visibility.disconnect();
			document.removeEventListener("visibilitychange", updatePlayback);
			for (const control of controls) control.cancel();
			if (workingCohort) cohort.dataset.apWorkingCohort = "pending";
		};
	}, [ref, environment.reduced, environment.offscreen, nativePreview]);
	return environment;
}
