import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import { demoCredits, demoProjects } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import { SettingsExperience } from "./settings-experience";

const meta = {
	title: "Product/Workspace settings",
	component: SettingsExperience,
	parameters: { layout: "fullscreen" },
	args: { projects: demoProjects, credits: demoCredits, onBack: fn() },
	render: (args) => (
		<>
			<WorkspaceHeader
				projects={[...args.projects]}
				currentProjectId={args.projects[0]?.id}
				showProjectName
				onProject={fn()}
				onProjects={args.onBack}
				onCreate={fn()}
				onSettings={fn()}
				onBilling={fn()}
				onSignOut={fn()}
			/>
			<SettingsExperience {...args} />
		</>
	),
} satisfies Meta<typeof SettingsExperience>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BillingAndUsage: Story = {
	parameters: { design: figma("59:2616") },
	args: { initialSection: "Billing & usage" },
};

export const StaffAndRoles: Story = {
	parameters: { design: figma("59:2860") },
	args: { initialSection: "Staff & roles" },
};

export const SkillsLibrary: Story = {
	parameters: { design: figma("59:3249") },
	args: { initialSection: "Skills library" },
};

export const Plugins: Story = {
	parameters: { design: figma("59:3467") },
	args: { initialSection: "Plugins" },
};
