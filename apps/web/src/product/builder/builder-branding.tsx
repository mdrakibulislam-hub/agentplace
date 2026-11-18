import { ProjectCover } from "@agentplace/ui/components/ap-builder";
import { FormField, SelectField } from "@agentplace/ui/components/ap-controls";
import { Avatar } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	CoverActionsMenu,
	MenuPopover,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import {
	type ChangeEvent,
	type FormEvent,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { type BrandingDraft, initials } from "./builder-model";
import { BuilderTitle } from "./builder-primitives";

type ImageField = "companyLogo" | "avatar" | "cover";
const imageTypes: Record<ImageField, string[]> = {
	companyLogo: ["image/png", "image/svg+xml"],
	avatar: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
	cover: ["image/png", "image/jpeg"],
};

export interface BuilderBrandingProps {
	branding: BrandingDraft;
	onChange: (updates: Partial<BrandingDraft>) => void;
	onSave: () => void | Promise<void>;
	onBack: () => void;
	saved: boolean;
	canEdit?: boolean;
	initialCoverMenu?: boolean;
}

export function BuilderBranding({
	branding,
	onChange,
	onSave,
	onBack,
	saved,
	canEdit = true,
	initialCoverMenu = false,
}: BuilderBrandingProps) {
	const fileInput = useRef<HTMLInputElement>(null);
	const colorInput = useRef<HTMLInputElement>(null);
	const coverAction = useRef<HTMLButtonElement>(null);
	const focusAfterRemoval = useRef(false);
	const imageField = useRef<ImageField>("cover");
	const request = useRef(0);
	const savePending = useRef(false);
	const latestChange = useRef(onChange);
	const [isReading, setIsReading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [fileError, setFileError] = useState("");
	const [saveError, setSaveError] = useState("");
	const [coverMenu, setCoverMenu] = useState(initialCoverMenu);
	const hasCover = Boolean(branding.cover);
	const locked = !canEdit || isSaving;
	const imageDisabled = locked || isReading;
	const valid = Boolean(branding.company.trim() && branding.name.trim());

	useLayoutEffect(() => {
		latestChange.current = onChange;
	}, [onChange]);

	useLayoutEffect(() => {
		if (!hasCover && focusAfterRemoval.current) {
			focusAfterRemoval.current = false;
			coverAction.current?.focus();
		}
	}, [hasCover]);

	useLayoutEffect(
		() => () => {
			request.current++;
		},
		[],
	);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canEdit || isReading || savePending.current || !valid || saved) return;
		savePending.current = true;
		setIsSaving(true);
		setSaveError("");
		try {
			await onSave();
		} catch (error) {
			setSaveError(
				error instanceof Error
					? error.message
					: "Couldn’t save changes. Try again.",
			);
		} finally {
			savePending.current = false;
			setIsSaving(false);
		}
	}

	function pickImage(field: ImageField) {
		if (imageDisabled) return;
		const input = fileInput.current;
		if (!input) return;
		imageField.current = field;
		setFileError("");
		input.accept = imageTypes[field].join(",");
		input.click();
	}

	function stageImage(event: ChangeEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!file || imageDisabled) return;
		const field = imageField.current;
		if (!imageTypes[field].includes(file.type) || file.size > 2 * 1024 * 1024) {
			setFileError(
				field === "cover"
					? "Choose a PNG or JPG cover up to 2 MB."
					: "Choose a supported image up to 2 MB.",
			);
			return;
		}
		const token = ++request.current;
		setIsReading(true);
		const reader = new FileReader();
		const fail = () => {
			if (request.current !== token) return;
			setIsReading(false);
			setFileError("This image couldn’t be opened. Choose a different file.");
		};
		reader.onerror = fail;
		reader.onload = () => {
			const source = reader.result;
			if (typeof source !== "string") {
				fail();
				return;
			}
			const image = new Image();
			image.onerror = fail;
			image.onload = () => {
				if (request.current !== token) return;
				setIsReading(false);
				setFileError("");
				latestChange.current({ [field]: source });
			};
			image.src = source;
		};
		reader.readAsDataURL(file);
	}

	function removeCover() {
		if (imageDisabled) return;
		setFileError("");
		focusAfterRemoval.current = true;
		onChange({ cover: undefined });
	}

	return (
		<form
			className="ap-builder-editor ap-builder-branding"
			aria-label="Branding"
			onSubmit={(event) => void submit(event)}
		>
			<BuilderTitle
				title="Branding"
				action={
					<Button
						type="submit"
						className="ap-branding-save"
						loading={isSaving}
						disabled={imageDisabled || !valid}
					>
						{isSaving ? "Saving…" : "Save changes"}
					</Button>
				}
			/>
			<input
				ref={fileInput}
				hidden
				type="file"
				aria-label="Choose a branding image"
				onChange={stageImage}
			/>
			<div className="ap-builder-branding-controls">
				<section aria-label="Company">
					<h2>Company</h2>
					<div className="ap-branding-identity">
						<Avatar
							size="large"
							initials={branding.company.charAt(0).toUpperCase()}
							src={branding.companyLogo}
							alt="Company logo"
						/>
						<FormField
							label="Company name"
							showLabel={false}
							showSupportingText={false}
							required
							disabled={locked}
							value={branding.company}
							onChange={(event) => onChange({ company: event.target.value })}
						/>
						<Button
							variant="secondary"
							disabled={imageDisabled}
							onClick={() => pickImage("companyLogo")}
						>
							Upload logo
						</Button>
					</div>
				</section>
				<section aria-label="Agent">
					<h2>Agent</h2>
					<div className="ap-branding-identity">
						<Avatar
							size="large"
							initials={initials(branding.name)}
							src={branding.avatar}
							alt="Agent avatar"
						/>
						<FormField
							label="Agent name"
							showLabel={false}
							showSupportingText={false}
							required
							disabled={locked}
							value={branding.name}
							onChange={(event) => onChange({ name: event.target.value })}
						/>
						<Button
							variant="secondary"
							disabled={imageDisabled}
							onClick={() => pickImage("avatar")}
						>
							Change avatar
						</Button>
					</div>
				</section>
				<section className="ap-branding-appearance" aria-label="Appearance">
					<h2>Appearance</h2>
					<div className="ap-builder-brand-line ap-builder-brand-cover">
						<ProjectCover
							context="branding-upload"
							image={branding.cover}
							emptyLabel={hasCover ? "Change cover" : "No cover"}
							canEdit={!imageDisabled}
							onEdit={() =>
								hasCover ? setCoverMenu(true) : pickImage("cover")
							}
						/>
						<div className="ap-branding-cover-guidance">
							<p>Project cover</p>
							<small>1600 × 620 recommended</small>
						</div>
						{hasCover ? (
							<MenuPopover
								align="end"
								open={coverMenu && !imageDisabled}
								onOpenChange={setCoverMenu}
								trigger={
									<Button
										ref={coverAction}
										variant="secondary"
										aria-label="Change cover"
										disabled={imageDisabled}
									>
										Change
									</Button>
								}
							>
								{(close) => (
									<CoverActionsMenu
										onClose={close}
										onUpload={() => {
											close();
											pickImage("cover");
										}}
										onRemove={() => {
											close();
											removeCover();
										}}
									/>
								)}
							</MenuPopover>
						) : (
							<Button
								ref={coverAction}
								variant="secondary"
								aria-label="Upload cover"
								disabled={imageDisabled}
								onClick={() => pickImage("cover")}
							>
								Upload
							</Button>
						)}
					</div>
					<div className="ap-builder-brand-line ap-builder-brand-color">
						<input
							ref={colorInput}
							type="color"
							aria-label="Brand color"
							disabled={locked}
							value={branding.color}
							onChange={(event) =>
								onChange({ color: event.target.value.toUpperCase() })
							}
						/>
						<p>Brand color</p>
						<Button
							variant="secondary"
							aria-label={`Change brand color, ${branding.color}`}
							disabled={locked}
							onClick={() => {
								const input = colorInput.current;
								if (input?.showPicker) input.showPicker();
								else input?.click();
							}}
						>
							{branding.color}
						</Button>
					</div>
					<div className="ap-builder-brand-selects">
						<SelectField
							label="Font"
							showSupportingText={false}
							disabled={locked}
							value={branding.typography}
							onChange={(event) =>
								onChange({
									typography: event.target.value as BrandingDraft["typography"],
								})
							}
							options={[
								{ value: "SF Pro", label: "SF Pro" },
								{ value: "SF Pro Rounded", label: "SF Pro Rounded" },
							]}
						/>
						<SelectField
							label="Theme"
							showSupportingText={false}
							disabled={locked}
							value={branding.appearance}
							onChange={(event) =>
								onChange({
									appearance: event.target.value as BrandingDraft["appearance"],
								})
							}
							options={[
								{ value: "light", label: "Light" },
								{ value: "dark", label: "Dark" },
								{ value: "system", label: "System" },
							]}
						/>
					</div>
				</section>
			</div>
			{(fileError || saveError) && (
				<p className="ap-builder-error" role="alert">
					{fileError || saveError}
				</p>
			)}
			<footer className="ap-builder-branding-footer">
				<Button
					variant="ghost"
					icon={<Icon name="arrow-left" />}
					onClick={onBack}
				>
					Back to chat
				</Button>
				<span className="ap-builder-small" role="status">
					{saved && !isReading && !isSaving && <Icon name="check" />}
					{isReading
						? "Preparing image…"
						: isSaving
							? "Saving draft…"
							: saved
								? "Saved to draft"
								: "Unsaved changes"}
				</span>
			</footer>
		</form>
	);
}
