import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { figma } from "../../stories/ap/fixtures";
import type { PrototypeProject } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import {
	BuilderExperience,
	type BuilderExperienceProps,
} from "./builder-experience";
import { initialBuilderData } from "./builder-model";

const base: PrototypeProject = {
	id: "whiteframe-advisor",
	name: "WhiteFrame Advisor",
	company: "WhiteFrame Creative",
	status: "Unpublished",
	updated: "Edited 2 hours ago",
	prompt:
		"Create an advisor for whiteframe.agency that recommends services and collects project enquiries.",
};

const authoredData = initialBuilderData(base);
const configuration = {
	branding: authoredData.branding,
	instructions: authoredData.instructions.replace(
		"# WhiteFrame Advisor",
		"# WhiteFrame Project Advisor",
	),
	skills: authoredData.skills,
};
const authoredVersions = [
	{
		id: 4,
		title: "Updated company branding",
		meta: "Today, 11:15 · Rakib",
		configuration,
	},
	{
		id: 3,
		title: "Published service advisor",
		meta: "Today, 10:40 · Rakib",
		configuration,
	},
	{
		id: 2,
		title: "Added enquiry collection",
		meta: "Today, 10:25 · Maya",
		configuration,
	},
	{
		id: 1,
		title: "Created from website",
		meta: "Today, 10:12 · Rakib",
		configuration,
	},
];
const ready = {
	...base,
	builder: {
		...authoredData,
		...configuration,
		versions: authoredVersions.slice(1),
	},
};
const published: PrototypeProject = {
	...ready,
	status: "Published",
	builder: { ...ready.builder, versions: authoredVersions },
	published: { ...authoredData.branding, versionId: 3 },
	liveUrl: "whiteframe.run.agentplace.io",
};

type FixtureProps = Omit<
	BuilderExperienceProps,
	"onProjectChange" | "onBack" | "onSettings"
>;
function BuilderFixture({ project: initialProject, ...args }: FixtureProps) {
	const [project, setProject] = useState(initialProject);
	return (
		<>
			<WorkspaceHeader
				projects={[project]}
				currentProjectId={project.id}
				showProjectName
				onProject={() => undefined}
				onProjects={() => undefined}
				onCreate={() => undefined}
				onSettings={() => undefined}
				onBilling={() => undefined}
				onSignOut={() => undefined}
			/>
			<BuilderExperience
				{...args}
				project={project}
				onProjectChange={(updates) =>
					setProject((current) => ({ ...current, ...updates }))
				}
				onBack={() => undefined}
				onSettings={() => undefined}
			/>
		</>
	);
}

const meta = {
	title: "Product/Agent builder",
	component: BuilderFixture,
	parameters: { layout: "fullscreen" },
	args: { project: ready },
} satisfies Meta<typeof BuilderFixture>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CreatingDraft: Story = {
	args: { project: { ...base, needsFirstDraft: true } },
	parameters: { design: figma("54:1385"), figmaNodeId: "54:1385" },
};

export const ChatAndPreview: Story = {
	parameters: { design: figma("54:1624"), figmaNodeId: "54:1624" },
};

export const Instructions: Story = {
	args: { initialSection: "Instructions.md" },
	parameters: { design: figma("57:1158"), figmaNodeId: "57:1158" },
};

export const ProjectSkills: Story = {
	args: { initialSection: "Skills" },
	parameters: { design: figma("57:1400"), figmaNodeId: "57:1400" },
};

export const VersionHistory: Story = {
	args: { initialSection: "History", project: published },
	parameters: { design: figma("57:1664"), figmaNodeId: "57:1664" },
};

export const BrandingWithoutCover: Story = {
	args: { initialSection: "Branding" },
	parameters: { design: figma("135:6409"), figmaNodeId: "135:6409" },
};

export const BrandingWithCover: Story = {
	args: { initialSection: "Branding", demoCover: true },
	parameters: { design: figma("54:1876"), figmaNodeId: "54:1876" },
};

export const ReplaceOrRemoveCover: Story = {
	args: { initialSection: "Branding", initialCoverMenu: true, demoCover: true },
	parameters: { design: figma("140:4811"), figmaNodeId: "140:4811" },
};

export const ReviewAndPublish: Story = {
	args: {
		project: { ...ready, liveUrl: "whiteframe.run.agentplace.io" },
		initialPublishAction: "publish",
	},
	parameters: { design: figma("57:1936"), figmaNodeId: "57:1936" },
};

export const PublishedWithDraftChanges: Story = {
	args: { project: published, initialManagePublish: true },
	parameters: { design: figma("57:2270"), figmaNodeId: "57:2270" },
};

export const UnpublishConfirmation: Story = {
	args: {
		project: {
			...published,
			published: { ...published.published, name: published.name, versionId: 4 },
		},
		initialPublishAction: "unpublish",
	},
	parameters: { design: figma("57:2585"), figmaNodeId: "57:2585" },
};
