import { ProjectCover } from "@agentplace/ui/components/ap-builder";
import { FormField, SelectField } from "@agentplace/ui/components/ap-controls";
import { Avatar } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	CoverActionsMenu,
	MenuPopover,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { type ChangeEvent, useLayoutEffect, useRef, useState } from "react";
import { type BrandingDraft, initials } from "./builder-model";
import { BuilderTitle } from "./builder-primitives";

type ImageField = "companyLogo" | "avatar" | "cover";
const imageTypes: Record<ImageField, string[]> = {
	companyLogo: ["image/png", "image/svg+xml"],
	avatar: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
	cover: ["image/png", "image/jpeg"],
};

export function BuilderBranding({
	branding,
	onChange,
	onSave,
	onBack,
	saved,
	initialCoverMenu = false,
	demoCover = false,
	onClearDemoCover,
}: {
	branding: BrandingDraft;
	onChange: (updates: Partial<BrandingDraft>) => void;
	onSave: () => void;
	onBack: () => void;
	saved: boolean;
	initialCoverMenu?: boolean;
	demoCover?: boolean;
	onClearDemoCover?: () => void;
}) {
	const fileInput = useRef<HTMLInputElement>(null);
	const colorInput = useRef<HTMLInputElement>(null);
	const imageField = useRef<ImageField>("cover");
	const request = useRef(0);
	const latestChange = useRef(onChange);
	const [isReading, setIsReading] = useState(false);
	const [fileError, setFileError] = useState("");
	const [coverMenu, setCoverMenu] = useState(initialCoverMenu);
	const hasCover = Boolean(branding.cover) || demoCover;

	useLayoutEffect(() => {
		latestChange.current = onChange;
	}, [onChange]);

	useLayoutEffect(
		() => () => {
			request.current++;
		},
		[],
	);

	function pickImage(field: ImageField) {
		imageField.current = field;
		setFileError("");
		const input = fileInput.current;
		if (!input) return;
		input.accept = imageTypes[field].join(",");
		input.click();
	}

	function stageImage(event: ChangeEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.[0];
		event.currentTarget.value = "";
		if (!file) return;
		const field = imageField.current;
		if (!imageTypes[field].includes(file.type) || file.size > 2 * 1024 * 1024) {
			setFileError(
				`Choose a supported image under 2 MB. ${field === "cover" ? "Covers use PNG or JPG." : ""}`,
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
				if (field === "cover") onClearDemoCover?.();
				latestChange.current({ [field]: source });
			};
			image.src = source;
		};
		reader.readAsDataURL(file);
	}

	function removeCover() {
		request.current++;
		setIsReading(false);
		setFileError("");
		onClearDemoCover?.();
		onChange({ cover: undefined });
	}

	return (
		<form
			className="ap-builder-editor ap-builder-branding"
			aria-label="Branding"
			onSubmit={(event) => {
				event.preventDefault();
				onSave();
			}}
		>
			<BuilderTitle
				title="Branding"
				description="Make the agent feel like your company."
				action={
					<Button
						type="submit"
						disabled={
							isReading || !branding.company.trim() || !branding.name.trim()
						}
					>
						Save changes
					</Button>
				}
			/>
			<input
				ref={fileInput}
				className="sr-only"
				type="file"
				tabIndex={-1}
				aria-label="Choose a branding image"
				onChange={stageImage}
			/>
			<div className="ap-builder-branding-controls">
				<section aria-label="Company identity">
					<h2>Company identity</h2>
					<FormField
						label="Company name"
						showSupportingText={false}
						required
						value={branding.company}
						onChange={(event) => onChange({ company: event.target.value })}
					/>
					<div className="ap-builder-brand-line ap-builder-brand-logo">
						<Avatar
							size="large"
							initials={branding.company.slice(0, 1)}
							src={branding.companyLogo}
							alt="Company logo"
						/>
						<div>
							<p>Company logo</p>
							<small>SVG or PNG · up to 2 MB</small>
						</div>
						<Button
							variant="secondary"
							onClick={() => pickImage("companyLogo")}
						>
							{branding.companyLogo ? "Replace" : "Upload"}
						</Button>
					</div>
				</section>
				<section aria-label="Project cover">
					<h2>Project cover</h2>
					<div className="ap-builder-brand-line ap-builder-brand-cover">
						<ProjectCover
							context="branding-upload"
							image={branding.cover}
							presentation={demoCover ? "added" : undefined}
							emptyLabel={hasCover ? "Replace cover" : "No cover"}
							canEdit
							onEdit={() =>
								hasCover ? setCoverMenu(true) : pickImage("cover")
							}
						/>
						<div>
							<p>Cards &amp; agent page</p>
							<small>PNG or JPG · 1600 × 620</small>
						</div>
						{hasCover ? (
							<MenuPopover
								align="end"
								open={coverMenu}
								onOpenChange={setCoverMenu}
								trigger={
									<Button variant="secondary" icon={<Icon name="upload" />}>
										Replace
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
								variant="secondary"
								icon={<Icon name="upload" />}
								onClick={() => pickImage("cover")}
							>
								Upload cover
							</Button>
						)}
					</div>
					<small>Use a cover that represents your project.</small>
				</section>
				<section aria-label="Color and style">
					<h2>Color &amp; style</h2>
					<div className="ap-builder-brand-line ap-builder-brand-color">
						<input
							ref={colorInput}
							type="color"
							aria-label="Primary color"
							value={branding.color}
							onChange={(event) =>
								onChange({ color: event.target.value.toUpperCase() })
							}
						/>
						<p>{branding.color}</p>
						<Button
							variant="secondary"
							onClick={() => {
								if (colorInput.current?.showPicker)
									colorInput.current.showPicker();
								else colorInput.current?.click();
							}}
						>
							Choose color
						</Button>
					</div>
					<div className="ap-builder-brand-selects">
						<SelectField
							label="Type style"
							showSupportingText={false}
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
							label="Appearance"
							showSupportingText={false}
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
				<section aria-label="Agent identity">
					<h2>Agent identity</h2>
					<FormField
						label="Agent name"
						showSupportingText={false}
						required
						value={branding.name}
						onChange={(event) => onChange({ name: event.target.value })}
					/>
					<div className="ap-builder-brand-line ap-builder-brand-avatar">
						<Avatar
							size="large"
							initials={initials(branding.name)}
							src={branding.avatar}
							alt="Agent avatar"
						/>
						<p>Agent avatar</p>
						<Button variant="secondary" onClick={() => pickImage("avatar")}>
							Choose avatar
						</Button>
					</div>
				</section>
			</div>
			{fileError && (
				<p className="ap-builder-error" role="alert">
					{fileError}
				</p>
			)}
			{isReading && (
				<p className="ap-builder-small" role="status">
					Preparing image…
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
					{saved && <Icon name="check" />}
					{saved ? "Saved to draft" : "Unsaved changes"}
				</span>
			</footer>
		</form>
	);
}
