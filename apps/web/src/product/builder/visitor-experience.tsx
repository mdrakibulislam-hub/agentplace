import { AgentPreview } from "@agentplace/ui/components/ap-builder";
import { Icon } from "@agentplace/ui/components/ap-icon";
import { Button } from "@agentplace/ui/components/button";
import { type CSSProperties, useState } from "react";
import type { PrototypeProject } from "../prototype-data";
import {
	type BrandingDraft,
	initialBuilderData,
	type PublishedSnapshot,
	previewDescription,
	previewSuggestions,
} from "./builder-model";
import { BuilderDialog } from "./builder-primitives";
import "./builder.css";

type VisitorBranding = BrandingDraft | PublishedSnapshot;

export function BuilderVisitorPreview({
	branding,
	showCover,
	standalone = false,
	published = false,
	onOpenExternal,
}: {
	branding: VisitorBranding;
	showCover?: boolean;
	standalone?: boolean;
	published?: boolean;
	onOpenExternal?: () => void;
}) {
	const [mobile, setMobile] = useState(false);
	const [call, setCall] = useState<"setup" | "connected">();
	const [messages, setMessages] = useState<
		{ question: string; response: string }[]
	>([]);
	const company = branding.company ?? branding.name;
	const companyLabel = company.replace(/ Creative$/, "");
	const displayName = companyLabel || branding.name;
	const colors = {
		"--ap-visitor-accent": branding.color,
		"--ap-visitor-accent-text": contrastText(branding.color),
	} as CSSProperties;

	function reply(question: string) {
		let response =
			"I can help you choose a service. Tell me a little about your project and what you’d like to achieve.";
		if (/website|web design/i.test(question)) {
			response =
				"I can help with website design and development. Are you starting a new website or redesigning an existing one?";
		} else if (/ux|product|research/i.test(question)) {
			response =
				"I can help with product design and UX research. What part of the product would you like to improve?";
		} else if (/contact|enquir/i.test(question)) {
			response =
				"Tell me what you’re looking for and I’ll help you prepare an enquiry to review.";
		}
		setMessages((current) => [...current, { question, response }]);
	}

	return (
		<div
			className={`ap-builder-visitor ${standalone ? "ap-builder-visitor-standalone" : ""}`}
			data-device={mobile ? "mobile" : "desktop"}
			data-appearance={branding.appearance ?? "light"}
			data-typography={branding.typography ?? "SF Pro"}
			style={colors}
		>
			<AgentPreview
				company={displayName.toUpperCase()}
				companyInitials={displayName.slice(0, 1).toUpperCase()}
				companyLogo={branding.companyLogo}
				title="What are you working on?"
				description={previewDescription(displayName)}
				suggestions={previewSuggestions()}
				coverImage={branding.cover}
				showCover={showCover ?? Boolean(branding.cover)}
				device={mobile ? "Mobile" : "Desktop"}
				mode={published ? "public" : standalone ? "standalone" : "test"}
				onDevice={() => setMobile((current) => !current)}
				onOpenExternal={onOpenExternal}
				onSend={reply}
				onCall={() => setCall("setup")}
			>
				{messages.length > 0 && (
					<div className="ap-builder-test-messages" aria-live="polite">
						{messages.map(({ question, response }, index) => (
							<div key={`${index}-${question}`}>
								<p>
									<strong>You</strong> {question}
								</p>
								<p>
									<strong>{branding.name}</strong> {response}
								</p>
							</div>
						))}
					</div>
				)}
			</AgentPreview>
			{call && (
				<BuilderDialog
					title={
						call === "setup" ? `Call ${branding.name}` : "Test call started"
					}
					description={
						call === "setup"
							? "Try the call controls in the visitor experience."
							: "You’re previewing the call interface."
					}
					onClose={() => setCall(undefined)}
				>
					<div className="ap-builder-dialog-actions">
						<Button
							data-initial-focus
							variant="secondary"
							size="medium"
							onClick={() => setCall(undefined)}
						>
							{call === "setup" ? "Cancel" : "End call"}
						</Button>
						{call === "setup" && (
							<Button
								size="medium"
								icon={<Icon name="phone" />}
								onClick={() => setCall("connected")}
							>
								Start test call
							</Button>
						)}
					</div>
				</BuilderDialog>
			)}
		</div>
	);
}

export function VisitorExperience({
	project,
	published = true,
}: {
	project: PrototypeProject;
	published?: boolean;
}) {
	const branding = published
		? (project.published ?? initialBuilderData(project).branding)
		: initialBuilderData(project).branding;
	return (
		<main className="ap-builder-visitor-page">
			<BuilderVisitorPreview
				branding={branding}
				standalone
				published={published}
			/>
		</main>
	);
}

function contrastText(color?: string) {
	if (!color || !/^#[0-9a-f]{6}$/i.test(color)) return undefined;
	const red = Number.parseInt(color.slice(1, 3), 16);
	const green = Number.parseInt(color.slice(3, 5), 16);
	const blue = Number.parseInt(color.slice(5, 7), 16);
	return (red * 299 + green * 587 + blue * 114) / 1000 > 145
		? "#18181B"
		: "#FFFFFF";
}
