import type { PrototypeProject } from "../prototype-data";

export interface BrandingDraft {
	company: string;
	name: string;
	companyLogo?: string;
	avatar?: string;
	cover?: string;
	color: string;
	typography: "SF Pro" | "SF Pro Rounded";
	appearance: "light" | "dark" | "system";
}

export interface BuilderConfiguration {
	branding: BrandingDraft;
	instructions: string;
	skills: Record<string, boolean>;
	destination?: string;
	skillNotes?: Record<string, string>;
}

export interface PublishedSnapshot {
	name: string;
	cover?: string;
	company?: string;
	companyLogo?: string;
	avatar?: string;
	color?: string;
	typography?: BrandingDraft["typography"];
	appearance?: BrandingDraft["appearance"];
	versionId?: number;
	audience?: string;
	requireSignIn?: boolean;
}

export interface ConversationMessage {
	id: string;
	role: "you" | "agent";
	text: string;
}

export interface BuilderConversation {
	id: string;
	title: string;
	messages: ConversationMessage[];
}

export interface BuilderVersion {
	id: number;
	title: string;
	meta: string;
	configuration: BuilderConfiguration;
}

export interface BuilderData extends BuilderConfiguration {
	conversations: BuilderConversation[];
	versions: BuilderVersion[];
	stagedBranding?: BrandingDraft;
	stagedInstructions?: string;
}

export interface BuilderSkill {
	id: string;
	name: string;
	description: string;
}

export const skills: BuilderSkill[] = [
	{
		id: "services",
		name: "Service recommendations",
		description:
			"Recommend the right service using approved company knowledge.",
	},
	{
		id: "enquiries",
		name: "Collect project enquiries",
		description:
			"Validate contact details and save visitor-approved enquiries.",
	},
	{
		id: "appointments",
		name: "Appointment booking",
		description: "Offer available times through your connected calendar.",
	},
];

export function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function initialBuilderData(project: PrototypeProject): BuilderData {
	if (project.builder) return project.builder;
	const configuration: BuilderConfiguration = {
		branding: {
			company: project.company ?? project.name,
			name: project.name,
			cover: project.cover,
			color: "#2A2A2A",
			typography: "SF Pro",
			appearance: "light",
		},
		instructions: [
			`# ${project.name}`,
			"## Purpose\nHelp visitors choose a service and prepare a project enquiry.",
			"## Voice\nBe clear, warm and concise. Ask one question at a time.",
			"## Knowledge\nUse approved website content. Do not invent pricing or claims.",
			"## Enquiries\nLet visitors review their details before submitting.\nOnly confirm success after the enquiry has been saved.",
			"## When uncertain\nExplain the gap and offer to connect the visitor with our team.",
		].join("\n\n"),
		skills: { services: true, enquiries: true },
	};
	const messages: ConversationMessage[] = project.prompt
		? [{ id: "initial", role: "you", text: project.prompt }]
		: [];
	const versions = project.needsFirstDraft
		? []
		: [
				{
					id: 1,
					title: "Created from website",
					meta: project.updated,
					configuration,
				},
			];
	return {
		...configuration,
		conversations: [{ id: "build", title: "Build project advisor", messages }],
		versions,
	};
}

export function recordVersion(data: BuilderData, title: string): BuilderData {
	const { branding, instructions, skills, destination, skillNotes } = data;
	const time = new Intl.DateTimeFormat("en", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(new Date());
	const version = {
		id: (data.versions[0]?.id ?? 0) + 1,
		title,
		meta: `Today, ${time}`,
		configuration: { branding, instructions, skills, destination, skillNotes },
	};
	return { ...data, versions: [version, ...data.versions] };
}

export function previewSuggestions() {
	return [
		"Help me choose a service",
		"Website design & development",
		"Product design & UX research",
	];
}

export function previewDescription(company: string) {
	return `I’m ${company}’s AI advisor. Find the right service or tell us about your project.`;
}
