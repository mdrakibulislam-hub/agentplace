import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import type { ReactElement, ReactNode, RefObject } from "react";
import { useRef, useState } from "react";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import { Button } from "./button";
import "../styles/ap-dialog.css";

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
	const popup = useRef<HTMLDivElement>(null);
	const actions = useRef<{ unmount: () => void; close: () => void } | null>(
		null,
	);
	const { reduced } = useMotionEnvironment(popup);
	function setOpen(next: boolean) {
		setInternalOpen(next);
		onOpenChange?.(next);
	}
	const confirm = async () => {
		if (pending) return;
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
			setPending(false);
		}
	};
	return (
		<Dialog.Root
			open={open}
			actionsRef={actions}
			onOpenChange={(next, details) => {
				if (pending) return;
				if (!next) details.preventUnmountOnClose();
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
				<Dialog.Popup
					ref={popup}
					initialFocus={cancel}
					finalFocus={returnFocus}
					className={["ap-confirm-dialog", className].filter(Boolean).join(" ")}
					render={
						<motion.div
							initial={reduced ? false : { opacity: 0, scale: 0.98, y: 12 }}
							animate={
								open
									? { opacity: 1, scale: 1, y: 0 }
									: { opacity: 0, scale: 1, y: reduced ? 0 : 4 }
							}
							transition={
								reduced
									? { duration: 0 }
									: open
										? {
												...springs.dialog,
												opacity: { type: "tween", duration: 0.16 },
											}
										: { type: "tween", duration: 0.12, ease: "easeOut" }
							}
							onAnimationComplete={() => {
								if (!open) actions.current?.unmount();
							}}
						/>
					}
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
							className="ap-dialog-confirm"
							variant="danger"
							size="medium"
							loading={pending}
							onClick={confirm}
						>
							{confirmLabel}
						</Button>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
