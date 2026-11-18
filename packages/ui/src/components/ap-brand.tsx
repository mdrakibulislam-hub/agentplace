import { animate } from "motion";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import clientBeat from "../assets/client-imgGroup.svg";
import clientVenture from "../assets/client-imgGroup1.svg";
import clientFastCompany from "../assets/client-imgGroup2.svg";
import clientUsa from "../assets/client-imgGroup4.svg";
import clientToday from "../assets/client-imgGroup5.svg";
import clientUsaMark from "../assets/client-imgVector.svg";
import imgA from "../assets/logo-imgA.svg";
import imgAFace from "../assets/logo-imgAFace.svg";
import imgC from "../assets/logo-imgC.svg";
import imgE from "../assets/logo-imgE.svg";
import imgE1 from "../assets/logo-imgE1.svg";
import imgG from "../assets/logo-imgG.svg";
import imgL from "../assets/logo-imgL.svg";
import imgN from "../assets/logo-imgN.svg";
import imgP from "../assets/logo-imgP.svg";
import imgT from "../assets/logo-imgT.svg";
import mascotClosed from "../assets/mascot-closed.svg";
import mascotFace from "../assets/mascot-face.svg";
import mascotOpen from "../assets/mascot-open.svg";
import { cn } from "../lib/utils";
import { useMascotTimeline, useMotionEnvironment } from "./ap-motion";
import "../styles/ap-brand.css";

export function Logo({
	inverse = false,
	animated = true,
	cycleDuration = 6.8,
	className,
}: {
	inverse?: boolean;
	animated?: boolean;
	cycleDuration?: number;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const environment = useMotionEnvironment(ref, !animated);
	useEffect(() => {
		const node = ref.current;
		if (!node || environment.reduced) return;
		const duration = Math.max(2.04, cycleDuration);
		const controls = [
			...node.querySelectorAll<HTMLElement>("[data-ap-logo-lid]"),
		].map((lid) => {
			const direction = lid.dataset.apLogoLid === "upper" ? 1 : -1;
			return animate(
				lid,
				{
					scaleY: [0.001, 0.001, 1.25, 1.25, 0.001, 0.001],
					y: [0, 0, direction * 0.906, direction * 0.906, 0, 0],
				},
				{
					duration,
					times: [
						0,
						1.7 / duration,
						1.8 / duration,
						1.85 / duration,
						2.04 / duration,
						1,
					],
					ease: ["linear", "easeIn", "linear", "easeOut", "linear"],
					repeat: Number.POSITIVE_INFINITY,
				},
			);
		});
		const update = () => {
			for (const c of controls) {
				if (document.hidden || environment.offscreen.current) c.pause();
				else c.play();
			}
		};
		document.addEventListener("visibilitychange", update);
		update();
		return () => {
			document.removeEventListener("visibilitychange", update);
			for (const c of controls) c.cancel();
		};
	}, [cycleDuration, environment.reduced, environment.offscreen]);
	return (
		<span
			ref={ref}
			role="img"
			aria-label="Agentplace"
			className={cn("ap-logo", inverse && "ap-logo-inverse", className)}
		>
			<span className="ap-logo-wordmark">
				{[
					[imgN, "32.61%", "57.62%", ".12%"],
					[imgAFace, "0", "90.74%", ".03%"],
					[imgA, "71.58%", "19.62%", ".02%"],
					[imgE, "22.78%", "69.01%", ".02%"],
					[imgE1, "92.07%", "0", ".01%"],
					[imgG, "11.26%", "79.22%", ".04%"],
					[imgP, "52.92%", "38.5%", ".05%"],
					[imgC, "82%", "9.51%", ".03%"],
					[imgL, "63.12%", "29.96%", "0"],
					[imgT, "43.93%", "48.6%", ".05%"],
				].map(([url, left, right, bottom]) => (
					<span
						key={url}
						className="ap-logo-letter"
						style={{
							left,
							right,
							bottom,
							maskImage: `url("${url}")`,
							WebkitMaskImage: `url("${url}")`,
						}}
					/>
				))}
			</span>
			{["left", "right"].flatMap((eye) =>
				["upper", "lower"].map((lid) => (
					<span
						key={`${eye}-${lid}`}
						data-ap-logo-lid={lid}
						className={`ap-logo-lid ap-logo-lid-${eye} ap-logo-lid-${lid}`}
					/>
				)),
			)}
		</span>
	);
}

export function ClientLogos({ className }: { className?: string }) {
	return (
		<div
			className={cn("ap-client-logos", className)}
			role="img"
			aria-label="VentureBeat, USA Today, and Fast Company"
		>
			<span className="ap-client-venture">
				<img src={clientVenture} width="84.814" height="16.78" alt="" />
				<img src={clientBeat} width="46.836" height="16.784" alt="" />
			</span>
			<span className="ap-client-usa">
				<img src={clientUsaMark} width="20.27" height="20" alt="" />
				<span>
					<img src={clientUsa} width="39.992" height="14.099" alt="" />
					<img src={clientToday} width="67.887" height="14.101" alt="" />
				</span>
			</span>
			<img src={clientFastCompany} width="102.26" height="16.021" alt="" />
		</div>
	);
}

export function MascotArtwork({
	eyes = "Open",
	size = 227,
	className,
}: {
	eyes?: "Open" | "Closed";
	size?: number;
	className?: string;
}) {
	const source = eyes === "Open" ? mascotOpen : mascotClosed;
	return (
		<span
			role="img"
			aria-label={`Agentplace mascot, eyes ${eyes.toLowerCase()}`}
			className={cn("ap-mascot-artwork", className)}
			style={{
				width: (size * 201) / 227,
				height: size,
				maskImage: `url("${source}")`,
				WebkitMaskImage: `url("${source}")`,
			}}
		/>
	);
}

export type MascotPhase =
	| "Rest"
	| "Crouch"
	| "Air"
	| "Land"
	| "Settle"
	| "Blink";
const poses: Record<MascotPhase, CSSProperties> = {
	Rest: {},
	Crouch: { transform: "translateY(.529px) scale(1.035,.965)" },
	Air: { transform: "translateY(-2.643px) scale(.985,1.025)" },
	Land: { transform: "scale(1.04,.96)" },
	Settle: {},
	Blink: {},
};

export function Mascot({
	className,
	size = 30,
	animated = false,
	nativePreview = false,
	phase = "Rest",
}: {
	className?: string;
	size?: number;
	animated?: boolean;
	nativePreview?: boolean;
	phase?: MascotPhase;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	useMascotTimeline(ref, animated, nativePreview);
	return (
		<span
			ref={ref}
			className={cn("ap-mascot", className)}
			aria-hidden="true"
			style={{ width: (size * 26.564) / 30, height: size }}
		>
			<span
				className="ap-mascot-scale"
				style={{ transform: `scale(${size / 30})` }}
			>
				<span
					data-ap-mascot-artwork
					className="ap-mascot-native"
					style={animated ? undefined : poses[phase]}
				>
					<span
						className="ap-mascot-face"
						style={{
							maskImage: `url("${mascotFace}")`,
							WebkitMaskImage: `url("${mascotFace}")`,
						}}
					/>
					{["left", "right"].flatMap((eye) =>
						["upper", "lower"].map((lid) => (
							<span
								key={`${eye}-${lid}`}
								data-ap-mascot-lid={lid}
								className={`ap-mascot-lid ap-mascot-lid-${eye} ap-mascot-lid-${lid}`}
								style={
									phase === "Blink" && !animated
										? {
												transform: `translateY(${lid === "upper" ? 1.651 : -1.651}px) scaleY(3.75)`,
											}
										: undefined
								}
							/>
						)),
					)}
				</span>
			</span>
		</span>
	);
}
