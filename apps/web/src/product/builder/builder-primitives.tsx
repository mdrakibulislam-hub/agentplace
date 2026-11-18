import { Icon } from "@agentplace/ui/components/ap-icon";
import { useDialogEntrance } from "@agentplace/ui/components/ap-motion";
import { type ReactNode, useId, useLayoutEffect, useRef } from "react";

export function BuilderTitle({
	title,
	description,
	action,
}: {
	title: string;
	description: string;
	action?: ReactNode;
}) {
	return (
		<header className="ap-builder-title">
			<div>
				<h1>{title}</h1>
				{action}
			</div>
			<p>{description}</p>
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
}: {
	children: ReactNode;
	title: string;
	description?: string;
	onClose: () => void;
	wide?: boolean;
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
			if (focused instanceof HTMLElement && focused.isConnected) {
				focused.focus();
			}
		};
	}, []);
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
				onClose();
			}}
		>
			<div className="ap-builder-dialog-content">
				<header>
					<h2 id={heading}>{title}</h2>
					<button
						type="button"
						aria-label="Close dialog"
						className="ap-builder-icon-action"
						onClick={onClose}
					>
						<Icon name="close" />
					</button>
				</header>
				{description && <p id={details}>{description}</p>}
				{children}
			</div>
		</dialog>
	);
}
