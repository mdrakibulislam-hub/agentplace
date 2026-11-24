import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import type { ComponentProps, ReactElement, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import "../styles/ap-dialog.css";

export function SpringDialogPopup({
	open,
	className,
	...props
}: Omit<ComponentProps<typeof Dialog.Popup>, "className" | "render"> & {
	open: boolean;
	className?: string;
}) {
	const { reduced } = useMotionEnvironment();
	return (
		<Dialog.Popup
			{...props}
			className={`ap-dialog-popup ${className ?? ""}`}
			inert={!open}
			render={
				<motion.div
					initial={reduced ? false : { scale: 0.98, y: 12 }}
					animate={{ scale: 1, y: open || reduced ? 0 : 4 }}
					transition={
						reduced
							? { duration: 0 }
							: open
								? springs.dialog
								: { type: "tween", duration: 0.12, ease: "easeOut" }
					}
				/>
			}
		/>
	);
}

/** Native480px confirmation recipe with real focus, cancellation and request/error state. */
export function ConfirmDialog({
	trigger,
	title = "Delete WhiteFrame Advisor?",
	description = "This permanently deletes the project and its conversations. This action cannot be undone.",
	confirmLabel = "Delete project",
	cancelLabel = "Cancel",
	className,
	backdropClassName,
	open: controlledOpen,
	onOpenChange,
	returnFocus,
	onConfirm,
}: {
	trigger?: ReactElement;
	title?: string;
	description?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	className?: string;
	backdropClassName?: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	returnFocus?: RefObject<HTMLElement | null>;
	onConfirm?: () => void | Promise<void>;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen ?? internalOpen;
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const cancel = useRef<HTMLButtonElement>(null);
	const confirmButton = useRef<HTMLButtonElement>(null);
	const inFlight = useRef(false);
	useEffect(() => {
		if (!open) setError("");
		else if (error) confirmButton.current?.focus({ preventScroll: true });
	}, [open, error]);
	function setOpen(next: boolean) {
		setInternalOpen(next);
		onOpenChange?.(next);
	}
	const confirm = async () => {
		if (inFlight.current) return;
		inFlight.current = true;
		setPending(true);
		setError("");
		try {
			await onConfirm?.();
			setOpen(false);
		} catch (cause) {
			setError(
				cause instanceof Error
					? cause.message
					: "Unable to delete. Please try again.",
			);
		} finally {
			inFlight.current = false;
			setPending(false);
		}
	};
	return (
		<Dialog.Root
			open={open}
			onOpenChange={(next, details) => {
				if (inFlight.current) {
					details.cancel();
					return;
				}
				setOpen(next);
				if (next) setError("");
			}}
		>
			{trigger && <Dialog.Trigger render={trigger} />}
			<Dialog.Portal>
				<Dialog.Backdrop
					className={["ap-dialog-backdrop", backdropClassName]
						.filter(Boolean)
						.join(" ")}
				/>
				<SpringDialogPopup
					open={open}
					initialFocus={cancel}
					finalFocus={returnFocus}
					className={["ap-confirm-dialog", className].filter(Boolean).join(" ")}
				>
					<div className="ap-dialog-heading">
						<Dialog.Title>{title}</Dialog.Title>
						<Dialog.Close
							disabled={pending}
							className="ap-dialog-close"
							aria-label="Close confirmation"
						>
							<Icon name="close" />
						</Dialog.Close>
					</div>
					<Dialog.Description>{description}</Dialog.Description>
					{error && (
						<p className="ap-dialog-error" role="alert">
							{error}
						</p>
					)}
					<div className="ap-dialog-actions">
						<Dialog.Close
							render={
								<Button
									ref={cancel}
									variant="secondary"
									size="medium"
									disabled={pending}
								/>
							}
						>
							{cancelLabel}
						</Dialog.Close>
						<Button
							ref={confirmButton}
							className="ap-dialog-confirm"
							variant="danger"
							size="medium"
							loading={pending}
							onClick={confirm}
						>
							{confirmLabel}
						</Button>
					</div>
				</SpringDialogPopup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
