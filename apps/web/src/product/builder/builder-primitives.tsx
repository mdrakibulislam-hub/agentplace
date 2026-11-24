import { Icon } from "@agentplace/ui/components/ap-icon";
import { useDialogEntrance } from "@agentplace/ui/components/ap-motion";
import {
	type ReactNode,
	type RefObject,
	useId,
	useLayoutEffect,
	useRef,
} from "react";

export function BuilderTitle({
	title,
	description,
	action,
}: {
	title: string;
	description?: string;
	action?: ReactNode;
}) {
	return (
		<header className="ap-builder-title">
			<div>
				<h1>{title}</h1>
				{action}
			</div>
			{description && <p>{description}</p>}
		</header>
	);
}

export function BuilderNote({
	title,
	children,
	tone = "neutral",
}: {
	title: string;
	children: ReactNode;
	tone?: "neutral" | "success" | "warning";
}) {
	return (
		<div className="ap-builder-note" data-tone={tone}>
			<p>{title}</p>
			<small>{children}</small>
		</div>
	);
}

export function BuilderDialog({
	children,
	title,
	description,
	onClose,
	wide = false,
	busy = false,
	error,
	returnFocus,
}: {
	children: ReactNode;
	title: string;
	description?: string;
	onClose: () => void;
	wide?: boolean;
	busy?: boolean;
	error?: string;
	returnFocus?: RefObject<HTMLElement | null>;
}) {
	const dialog = useRef<HTMLDialogElement>(null);
	const heading = useId();
	const details = useId();
	useLayoutEffect(() => {
		const element = dialog.current;
		const focused = document.activeElement;
		if (!element) return;
		element.showModal();
		const initialFocus = element.querySelector<HTMLElement>(
			"[data-initial-focus]",
		);
		initialFocus?.focus();
		return () => {
			element.close();
			const target = returnFocus?.current ?? focused;
			if (target instanceof HTMLElement && target.isConnected) {
				target.focus({ preventScroll: true });
			}
		};
	}, [returnFocus]);
	useDialogEntrance(dialog);
	return (
		<dialog
			ref={dialog}
			className="ap-builder-dialog"
			data-wide={wide}
			aria-labelledby={heading}
			aria-describedby={description ? details : undefined}
			onCancel={(event) => {
				event.preventDefault();
				if (!busy) onClose();
			}}
		>
			<div className="ap-builder-dialog-content" aria-busy={busy || undefined}>
				<header>
					<h2 id={heading}>{title}</h2>
					<button
						type="button"
						aria-label="Close dialog"
						className="ap-builder-icon-action"
						onClick={onClose}
						disabled={busy}
					>
						<Icon name="close" />
					</button>
				</header>
				{description && <p id={details}>{description}</p>}
				{error && (
					<p className="ap-builder-error" role="alert">
						{error}
					</p>
				)}
				{children}
			</div>
		</dialog>
	);
}
