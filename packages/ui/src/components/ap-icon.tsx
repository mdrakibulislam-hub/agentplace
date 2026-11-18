import type { CSSProperties, HTMLAttributes } from "react";
import googleMask from "../assets/google-imgGroup.svg";
import googleColor from "../assets/google-imgGroup1.svg";
import asset0 from "../assets/icon-arrow-left.svg";
import asset1 from "../assets/icon-arrow-left-to-line.svg";
import asset2 from "../assets/icon-arrow-right.svg";
import asset3 from "../assets/icon-arrow-up.svg";
import asset4 from "../assets/icon-briefcase-business.svg";
import asset5 from "../assets/icon-calendar.svg";
import asset6 from "../assets/icon-check.svg";
import asset7 from "../assets/icon-chevron-down.svg";
import asset8 from "../assets/icon-chevron-up.svg";
import asset9 from "../assets/icon-chevrons-up-down.svg";
import asset10 from "../assets/icon-close.svg";
import asset11 from "../assets/icon-copy.svg";
import asset12 from "../assets/icon-credit-card.svg";
import asset13 from "../assets/icon-database.svg";
import asset14 from "../assets/icon-download.svg";
import asset15 from "../assets/icon-external-link.svg";
import asset16 from "../assets/icon-eye.svg";
import asset17 from "../assets/icon-eye-off.svg";
import asset18 from "../assets/icon-file-text.svg";
import asset19 from "../assets/icon-filter.svg";
import asset20 from "../assets/icon-globe.svg";
import asset21 from "../assets/icon-history.svg";
import asset22 from "../assets/icon-lightbulb.svg";
import asset23 from "../assets/icon-link.svg";
import asset24 from "../assets/icon-loader.svg";
import asset25 from "../assets/icon-lock.svg";
import asset26 from "../assets/icon-mail.svg";
import asset27 from "../assets/icon-message-circle-question-mark.svg";
import asset28 from "../assets/icon-message-square.svg";
import asset29 from "../assets/icon-monitor.svg";
import moon from "../assets/icon-moon.svg";
import asset30 from "../assets/icon-more-filled.svg";
import asset31 from "../assets/icon-more-horizontal.svg";
import asset32 from "../assets/icon-palette.svg";
import asset33 from "../assets/icon-panel-left-close.svg";
import asset34 from "../assets/icon-paperclip.svg";
import asset35 from "../assets/icon-phone.svg";
import asset36 from "../assets/icon-plus.svg";
import asset37 from "../assets/icon-puzzle.svg";
import asset38 from "../assets/icon-refresh.svg";
import asset39 from "../assets/icon-search.svg";
import asset40 from "../assets/icon-settings.svg";
import asset41 from "../assets/icon-shield-check.svg";
import asset42 from "../assets/icon-square-pen.svg";
import sun from "../assets/icon-sun.svg";
import asset43 from "../assets/icon-trash.svg";
import asset44 from "../assets/icon-upload.svg";
import asset45 from "../assets/icon-user-add.svg";
import asset46 from "../assets/icon-users.svg";
import asset47 from "../assets/icon-zap.svg";
import { cn } from "../lib/utils";
import "../styles/ap-brand.css";

export const iconAssets = {
	"arrow-left": asset0,
	"arrow-left-to-line": asset1,
	"arrow-right": asset2,
	"arrow-up": asset3,
	"briefcase-business": asset4,
	calendar: asset5,
	check: asset6,
	"chevron-down": asset7,
	"chevron-up": asset8,
	"chevrons-up-down": asset9,
	close: asset10,
	copy: asset11,
	"credit-card": asset12,
	database: asset13,
	download: asset14,
	"external-link": asset15,
	eye: asset16,
	"eye-off": asset17,
	"file-text": asset18,
	filter: asset19,
	globe: asset20,
	history: asset21,
	lightbulb: asset22,
	link: asset23,
	loader: asset24,
	lock: asset25,
	mail: asset26,
	"message-circle-question-mark": asset27,
	"message-square": asset28,
	monitor: asset29,
	moon,
	"more-filled": asset30,
	"more-horizontal": asset31,
	palette: asset32,
	"panel-left-close": asset33,
	paperclip: asset34,
	phone: asset35,
	plus: asset36,
	puzzle: asset37,
	refresh: asset38,
	search: asset39,
	settings: asset40,
	"shield-check": asset41,
	"square-pen": asset42,
	sun,
	trash: asset43,
	upload: asset44,
	"user-add": asset45,
	users: asset46,
	zap: asset47,
} as const;
export const iconNames = [...Object.keys(iconAssets), "Google"];
export type IconName = keyof typeof iconAssets | "Google";
export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
	name: string;
	size?: number;
	decorative?: boolean;
	label?: string;
}
/** Exact original Reicon artwork; CSS masks preserve shape while inheriting semantic currentColor. */
export function Icon({
	name,
	size = 16,
	className,
	decorative = true,
	label,
	style,
	...props
}: IconProps) {
	const google = name === "Google" || name === "google";
	const url = iconAssets[name as keyof typeof iconAssets];
	if (!google && !url) throw new Error(`Unknown Agentplace icon: ${name}`);
	return (
		<span
			{...props}
			className={cn("ap-icon", google && "ap-icon-google", className)}
			role="img"
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : label || name}
			style={
				{
					width: size,
					height: size,
					...(!google
						? { maskImage: `url("${url}")`, WebkitMaskImage: `url("${url}")` }
						: {}),
					...style,
				} as CSSProperties
			}
		>
			{google && (
				<span
					className="ap-google-master"
					style={{ transform: `scale(${size / 20})` }}
				>
					<span
						className="ap-google-color"
						style={{
							maskImage: `url("${googleMask}")`,
							WebkitMaskImage: `url("${googleMask}")`,
						}}
					>
						<img src={googleColor} alt="" />
					</span>
				</span>
			)}
		</span>
	);
}
