import {
	FormField,
	SelectField,
	Switch,
} from "@agentplace/ui/components/ap-controls";
import { Badge } from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { MenuPopover } from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { useState } from "react";
import { BuilderDialog, BuilderNote } from "./builder-primitives";

const audienceOptions = [
	{ value: "link", label: "Anyone with the link" },
	{ value: "workspace", label: "Workspace only" },
];

export function ReviewPublish({
	name,
	url,
	draftChanges,
	ready,
	audience: savedAudience,
	requireSignIn: savedSignIn,
	onConfirm,
	onClose,
}: {
	name: string;
	url: string;
	draftChanges: boolean;
	ready: boolean;
	audience?: string;
	requireSignIn?: boolean;
	onConfirm: (audience: string, requireSignIn: boolean) => void;
	onClose: () => void;
}) {
	const [audience, setAudience] = useState(savedAudience ?? "link");
	const [requireSignIn, setRequireSignIn] = useState(savedSignIn ?? false);
	return (
		<BuilderDialog
			wide
			title={draftChanges ? `Publish an update to ${name}` : `Publish ${name}`}
			description="Your saved draft will be available at the link below."
			onClose={onClose}
		>
			<div className="ap-builder-publish-checklist">
				<p>{ready ? "Ready to publish" : "Save your changes to continue"}</p>
				<ul>
					{[
						"Company knowledge connected",
						"Lead storage connected",
						"Key visitor flow tested",
						"Branding saved",
					].map((item, index) => (
						<li key={item}>
							<Icon name={!ready && index === 3 ? "close" : "check"} />
							{item}
						</li>
					))}
				</ul>
			</div>
			<SelectField
				showSupportingText={false}
				label="Who can open the agent?"
				value={audience}
				onChange={(event) => setAudience(event.target.value)}
				options={audienceOptions}
			/>
			<FormField
				showSupportingText={false}
				label="Agent URL"
				value={url}
				readOnly
			/>
			<div className="ap-builder-publish-switch">
				<span>Require visitor sign-in</span>
				<Switch
					label="Require visitor sign-in"
					checked={requireSignIn}
					onCheckedChange={setRequireSignIn}
				/>
			</div>
			<small className="ap-builder-small">
				Only the visitor experience is public. Project instructions and staff
				tools stay private.
			</small>
			<div className="ap-builder-dialog-actions">
				<Button
					data-initial-focus
					variant="secondary"
					size="medium"
					onClick={onClose}
				>
					Back to testing
				</Button>
				<Button
					size="medium"
					disabled={!ready}
					onClick={() => onConfirm(audience, requireSignIn)}
				>
					{draftChanges ? "Publish update" : "Publish agent"}
				</Button>
			</div>
		</BuilderDialog>
	);
}

export function UnpublishAgent({
	url,
	onConfirm,
	onClose,
}: {
	url: string;
	onConfirm: () => void;
	onClose: () => void;
}) {
	return (
		<BuilderDialog
			title="Unpublish this agent?"
			description="Visitors will no longer be able to use the public link or website embed."
			onClose={onClose}
		>
			<BuilderNote title="Your work stays saved">
				The project, conversations and settings are kept. You can publish again
				anytime.
			</BuilderNote>
			<small className="ap-builder-small ap-builder-live-url">{url}</small>
			<div className="ap-builder-dialog-actions">
				<Button
					data-initial-focus
					variant="secondary"
					size="medium"
					onClick={onClose}
				>
					Keep published
				</Button>
				<Button variant="danger" size="medium" onClick={onConfirm}>
					Unpublish
				</Button>
			</div>
		</BuilderDialog>
	);
}

export function ManagePublication({
	url,
	draftChanges,
	open,
	onOpenChange,
	onPublishUpdate,
	onUnpublish,
	onOpenLive,
}: {
	url: string;
	draftChanges: boolean;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onPublishUpdate: () => void;
	onUnpublish: () => void;
	onOpenLive: () => void;
}) {
	const [copyStatus, setCopyStatus] = useState<"copied" | "manual">();
	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			setCopyStatus("copied");
		} catch {
			setCopyStatus("manual");
		}
	}
	return (
		<MenuPopover
			align="end"
			sideOffset={32}
			open={open}
			onOpenChange={(shown) => {
				if (shown) setCopyStatus(undefined);
				onOpenChange(shown);
			}}
			trigger={<Button variant="default">Manage publish</Button>}
		>
			{(close) => (
				<section
					className="ap-builder-publish-panel"
					aria-label="Publishing details"
				>
					<header>
						<span className="ap-builder-publish-check" aria-hidden="true">
							<Icon name="check" />
						</span>
						<h2>Your agent is live</h2>
						<Badge tone="success">Published</Badge>
						<button
							className="ap-builder-icon-action"
							type="button"
							onClick={close}
							aria-label="Close publishing details"
						>
							<Icon name="close" />
						</button>
					</header>
					<p>Your agent is available to visitors.</p>
					<div className="ap-builder-publish-address">
						<Icon name="globe" />
						<span>{url}</span>
					</div>
					<div className="ap-builder-quick-actions">
						<Button
							data-menu-choice
							variant="secondary"
							icon={<Icon name="external-link" />}
							onClick={onOpenLive}
						>
							Open live agent
						</Button>
						<Button
							variant="ghost"
							icon={<Icon name={copyStatus === "copied" ? "check" : "copy"} />}
							onClick={() => void copy()}
						>
							{copyStatus === "copied" ? "Copied link" : "Copy link"}
						</Button>
					</div>
					{copyStatus === "copied" && (
						<span className="sr-only" role="status">
							Link copied
						</span>
					)}
					{copyStatus === "manual" && (
						<FormField
							label="Copy this link"
							showSupportingText={false}
							readOnly
							value={url}
							onFocus={(event) => event.target.select()}
						/>
					)}
					{draftChanges && (
						<>
							<BuilderNote
								title="Draft changes are not live yet"
								tone="warning"
							>
								Publish an update when you’re ready to share your latest
								changes.
							</BuilderNote>
							<Button
								size="medium"
								onClick={() => {
									close();
									onPublishUpdate();
								}}
							>
								Publish update
							</Button>
						</>
					)}
					<Button
						variant="ghost"
						onClick={() => {
							close();
							onUnpublish();
						}}
					>
						Unpublish agent
					</Button>
				</section>
			)}
		</MenuPopover>
	);
}
