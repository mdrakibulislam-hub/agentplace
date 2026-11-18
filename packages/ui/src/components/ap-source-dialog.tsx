import { Dialog } from "@base-ui/react/dialog";
import { motion } from "motion/react";
import { type RefObject, useId, useRef, useState } from "react";
import { Spinner } from "./ap-data";
import { Icon } from "./ap-icon";
import { springs, useMotionEnvironment } from "./ap-motion";
import { Input } from "./input";
import "../styles/ap-dialog.css";
import "../styles/ap-source-dialog.css";

export const SOURCE_FILE_ACCEPT = ".pdf,.docx,.txt,.md,.csv";
export const SOURCE_FILE_MAX_BYTES = 10 * 1024 * 1024;
const fileExtensions = new Set(SOURCE_FILE_ACCEPT.split(","));

export interface SourceAttachmentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAddWebsite: (url: string) => void | Promise<void>;
	onAddFile: (file: File) => void | Promise<void>;
	returnFocus?: RefObject<HTMLElement | null>;
	defaultWebsite?: string;
}

/** Selects project context; the caller owns any upload or import request. */
export function SourceAttachmentDialog({
	open,
	onOpenChange,
	onAddWebsite,
	onAddFile,
	returnFocus,
	defaultWebsite = "",
}: SourceAttachmentDialogProps) {
	const id = useId();
	const [website, setWebsite] = useState(defaultWebsite);
	const [error, setError] = useState<{
		kind: "website" | "file";
		message: string;
	} | null>(null);
	const [pending, setPending] = useState<"website" | "file" | null>(null);
	const [dragging, setDragging] = useState(false);
	const inFlight = useRef(false);
	const input = useRef<HTMLInputElement>(null);
	const fileInput = useRef<HTMLInputElement>(null);
	const popup = useRef<HTMLDivElement>(null);
	const actions = useRef<{ unmount: () => void; close: () => void } | null>(
		null,
	);
	const { reduced } = useMotionEnvironment(popup);

	async function add(
		kind: "website" | "file",
		callback: () => void | Promise<void>,
	) {
		if (inFlight.current) return;
		inFlight.current = true;
		setPending(kind);
		setError(null);
		try {
			await callback();
			setWebsite("");
			onOpenChange(false);
		} catch (cause) {
			setError({
				kind,
				message:
					cause instanceof Error
						? cause.message
						: "Couldn’t add this source. Please try again.",
			});
		} finally {
			inFlight.current = false;
			setPending(null);
		}
	}

	function addWebsite() {
		if (inFlight.current) return;
		let url: URL;
		try {
			url = new URL(website.trim());
			if (!["http:", "https:"].includes(url.protocol)) throw new Error();
		} catch {
			setError({
				kind: "website",
				message:
					"Enter a complete website address, such as https://example.com.",
			});
			input.current?.focus();
			return;
		}
		void add("website", () => onAddWebsite(url.href));
	}

	function addFile(file: File) {
		if (inFlight.current) return;
		const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
		const message = !fileExtensions.has(extension)
			? "Choose a PDF, DOCX, TXT, MD or CSV file."
			: file.size > SOURCE_FILE_MAX_BYTES
				? "This file is larger than 10 MB. Choose a smaller file."
				: file.size === 0
					? "This file is empty. Choose a file with content."
					: "";
		if (message) {
			setError({ kind: "file", message });
			return;
		}
		void add("file", () => onAddFile(file));
	}

	return (
		<Dialog.Root
			open={open}
			actionsRef={actions}
			onOpenChange={(next, details) => {
				if (inFlight.current) return;
				if (!next) details.preventUnmountOnClose();
				setError(null);
				setDragging(false);
				onOpenChange(next);
			}}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="ap-dialog-backdrop" />
				<Dialog.Popup
					ref={popup}
					className="ap-source-dialog"
					initialFocus={input}
					finalFocus={returnFocus}
					aria-describedby={undefined}
					aria-busy={Boolean(pending)}
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
						<Dialog.Title>Add website or file</Dialog.Title>
						<Dialog.Close
							className="ap-dialog-close"
							aria-label="Close source dialog"
							disabled={Boolean(pending)}
						>
							<Icon name="close" size={20} />
						</Dialog.Close>
					</div>
					<form
						className="ap-source-website"
						noValidate
						onSubmit={(event) => {
							event.preventDefault();
							addWebsite();
						}}
					>
						<label htmlFor={`${id}-website`}>Website</label>
						<div className="ap-source-website-field">
							<Input
								ref={input}
								id={`${id}-website`}
								type="url"
								value={website}
								placeholder="https://example.com"
								autoComplete="url"
								enterKeyHint="done"
								readOnly={Boolean(pending)}
								state={error?.kind === "website" ? "error" : "default"}
								aria-describedby={`${id}-website-hint${error?.kind === "website" ? ` ${id}-website-error` : ""}`}
								onChange={(event) => {
									setWebsite(event.currentTarget.value);
									if (error?.kind === "website") setError(null);
								}}
							/>
							{pending === "website" && <Spinner label="Adding website" />}
						</div>
						<span id={`${id}-website-hint`} className="sr-only">
							Press Enter to add the website.
						</span>
						{error?.kind === "website" && (
							<p
								id={`${id}-website-error`}
								className="ap-source-error"
								role="alert"
							>
								{error.message}
							</p>
						)}
					</form>
					<div className="ap-source-divider" aria-hidden="true">
						<span>or</span>
					</div>
					<div className="ap-source-file">
						<button
							type="button"
							className="ap-source-dropzone"
							data-dragging={dragging || undefined}
							disabled={Boolean(pending)}
							aria-label="Choose a file"
							aria-describedby={`${id}-file-hint${error?.kind === "file" ? ` ${id}-file-error` : ""}`}
							onClick={() => fileInput.current?.click()}
							onDragEnter={(event) => {
								if (event.dataTransfer.types.includes("Files")) {
									event.preventDefault();
									if (!pending) setDragging(true);
								}
							}}
							onDragOver={(event) => {
								event.preventDefault();
								event.dataTransfer.dropEffect = pending ? "none" : "copy";
							}}
							onDragLeave={(event) => {
								if (
									!(event.relatedTarget instanceof Node) ||
									!event.currentTarget.contains(event.relatedTarget)
								)
									setDragging(false);
							}}
							onDrop={(event) => {
								event.preventDefault();
								setDragging(false);
								if (inFlight.current) return;
								if (event.dataTransfer.files.length > 1) {
									setError({
										kind: "file",
										message: "Add one file at a time.",
									});
									return;
								}
								const file = event.dataTransfer.files[0];
								if (file) addFile(file);
							}}
						>
							<Icon name={pending === "file" ? "loader" : "upload"} size={20} />
							<span className="ap-source-drop-title">
								{pending === "file" ? (
									"Adding file…"
								) : (
									<>
										Drop a file here or <span>browse files</span>
									</>
								)}
							</span>
							<span id={`${id}-file-hint`} className="ap-source-file-hint">
								PDF, DOCX, TXT, MD or CSV · up to 10 MB
							</span>
						</button>
						<input
							ref={fileInput}
							type="file"
							accept={SOURCE_FILE_ACCEPT}
							hidden
							onChange={(event) => {
								const file = event.currentTarget.files?.[0];
								event.currentTarget.value = "";
								if (file) addFile(file);
							}}
						/>
						{error?.kind === "file" && (
							<p
								id={`${id}-file-error`}
								className="ap-source-error"
								role="alert"
							>
								{error.message}
							</p>
						)}
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
