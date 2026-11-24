import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	useContentEntrance,
	useDialogEntrance,
	useMotionEnvironment,
} from "@agentplace/ui/components/ap-motion";
import { Button } from "@agentplace/ui/components/button";
import {
	type MouseEvent,
	type ReactNode,
	type RefObject,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export function SettingsHeading({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: ReactNode;
}) {
	return (
		<div className="product-settings-heading">
			<div className="product-settings-title">
				<h1>{title}</h1>
				{action}
			</div>
			<p>{description}</p>
		</div>
	);
}

export function SettingsNote({
	title,
	children,
	warning = false,
}: {
	title: string;
	children: ReactNode;
	warning?: boolean;
}) {
	return (
		<div className="product-settings-note" data-warning={warning || undefined}>
			<h3>{title}</h3>
			<div>{children}</div>
		</div>
	);
}

export function SettingsDialog({
	title,
	description,
	onClose,
	returnFocus,
	children,
}: {
	title: string;
	description?: string;
	onClose: () => void;
	returnFocus?: RefObject<HTMLElement | null>;
	children: ReactNode;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const startedOutside = useRef(false);
	const titleId = useId();
	const descriptionId = useId();
	useLayoutEffect(() => {
		const dialog = ref.current;
		const previous = returnFocus?.current ?? document.activeElement;
		dialog?.showModal();
		dialog?.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
		return () => {
			dialog?.close();
			if (
				previous instanceof HTMLElement &&
				previous.isConnected &&
				!previous.closest("[hidden]")
			)
				previous.focus({ preventScroll: true });
		};
	}, [returnFocus]);
	useDialogEntrance(ref);
	return (
		<dialog
			ref={ref}
			aria-labelledby={titleId}
			aria-describedby={description ? descriptionId : undefined}
			className="product-settings-dialog"
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
			onPointerDown={(event) => {
				startedOutside.current =
					event.isPrimary && event.button === 0 && isOutsideDialog(event);
			}}
			onPointerUp={(event) => {
				if (startedOutside.current && isOutsideDialog(event)) onClose();
				startedOutside.current = false;
			}}
			onPointerCancel={() => {
				startedOutside.current = false;
			}}
		>
			<div className="product-settings-panel-title">
				<h2 id={titleId}>{title}</h2>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Close dialog"
					icon={<Icon name="close" />}
					onClick={onClose}
				/>
			</div>
			{description && <p id={descriptionId}>{description}</p>}
			{children}
		</dialog>
	);
}

function isOutsideDialog(event: MouseEvent<HTMLDialogElement>) {
	if (event.target !== event.currentTarget) return false;
	const { left, right, top, bottom } =
		event.currentTarget.getBoundingClientRect();
	return (
		event.clientX < left ||
		event.clientX > right ||
		event.clientY < top ||
		event.clientY > bottom
	);
}

export function SettingsFeedback({
	notice = "",
	error = "",
	dirty = false,
}: {
	notice?: string;
	error?: string;
	dirty?: boolean;
}) {
	return (
		<>
			{error && (
				<p
					className="product-settings-error"
					role="alert"
					data-ap-enter="message"
				>
					{error}
				</p>
			)}
			<div
				className="product-settings-feedback"
				role="status"
				data-success={Boolean(notice) || undefined}
			>
				{notice ? (
					<span data-ap-enter="message">
						<Icon name="check" />
						{notice}
					</span>
				) : dirty ? (
					"Unsaved changes"
				) : null}
			</div>
		</>
	);
}

export function useSettingsDetail(
	panel: RefObject<HTMLDivElement | null>,
	view: string,
) {
	const { reduced } = useMotionEnvironment();
	const [request, setRequest] = useState(0);
	const handledRequest = useRef(0);
	useContentEntrance(panel, view);
	useLayoutEffect(() => {
		if (handledRequest.current === request) return;
		handledRequest.current = request;
		const heading = panel.current?.querySelector<HTMLElement>("h2");
		const stacked = window.matchMedia("(max-width: 1000px)").matches;
		if (
			heading &&
			(stacked || heading.getBoundingClientRect().bottom >= window.innerHeight)
		) {
			heading.focus({ preventScroll: true });
			heading.scrollIntoView({
				block: "start",
				behavior: reduced ? "instant" : "smooth",
			});
		}
	}, [panel, request, reduced]);
	return () => setRequest((previous) => previous + 1);
}

export function useSettingsDialog<T>(active: boolean, closed: T) {
	const [dialog, setDialog] = useState(closed);
	if (!active && dialog !== closed) setDialog(closed);
	return [active ? dialog : closed, setDialog] as const;
}

export function settingsError(cause: unknown) {
	return cause instanceof Error
		? cause.message
		: "Changes couldn’t be saved. Try again.";
}
