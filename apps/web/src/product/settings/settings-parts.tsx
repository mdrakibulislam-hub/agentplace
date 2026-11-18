import { Icon } from "@agentplace/ui/components/ap-icon";
import { Button } from "@agentplace/ui/components/button";
import { type ReactNode, useEffect, useId, useRef } from "react";

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
	children,
}: {
	title: string;
	description?: string;
	onClose: () => void;
	children: ReactNode;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const titleId = useId();
	const descriptionId = useId();
	useEffect(() => {
		const dialog = ref.current;
		const previous = document.activeElement;
		dialog?.showModal();
		return () => {
			dialog?.close();
			if (previous instanceof HTMLElement && previous.isConnected)
				previous.focus();
		};
	}, []);
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
