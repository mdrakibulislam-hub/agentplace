import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import { demoProjects, withLiveLink } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import { ProjectHome, type ProjectHomeProps } from "./project-home";

interface SceneProps extends ProjectHomeProps {
	switcherOpen?: boolean;
	onSettings?: () => void;
}

function HomeScene({ switcherOpen, onSettings, ...props }: SceneProps) {
	const [projects, setProjects] = useState(() =>
		props.projects.map(withLiveLink),
	);
	const [focusPromptRequest, setFocusPromptRequest] = useState(0);
	return (
		<>
			<WorkspaceHeader
				projects={projects}
				currentProjectId={projects[0]?.id}
				type="secondary"
				initialSwitcherOpen={switcherOpen}
				onProject={props.onOpen}
				onProjects={() => {}}
				onCreate={() => setFocusPromptRequest((current) => current + 1)}
				onSettings={onSettings ?? (() => {})}
				onBilling={() => {}}
				onSignOut={() => {}}
			/>
			<ProjectHome
				{...props}
				projects={projects}
				focusPromptRequest={focusPromptRequest}
				onDelete={(id) => {
					props.onDelete(id);
					setProjects((current) =>
						current.filter((project) => project.id !== id),
					);
				}}
				onChangeCover={(id, cover) => {
					props.onChangeCover(id, cover);
					setProjects((current) =>
						current.map((project) =>
							project.id === id ? { ...project, cover } : project,
						),
					);
				}}
			/>
		</>
	);
}

const meta = {
	title: "Product/Projects",
	component: HomeScene,
	parameters: { layout: "fullscreen" },
	args: {
		projects: demoProjects,
		onCreate: fn(),
		onOpen: fn(),
		onDelete: fn(),
		onChangeCover: fn(),
	},
} satisfies Meta<typeof HomeScene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoProjects: Story = {
	args: { projects: [] },
	parameters: { design: figma("135:5210") },
};
export const RecentProjects: Story = {
	parameters: { design: figma("53:349") },
};
export const RecentProjectsDark: Story = {
	globals: { theme: "dark" },
	parameters: { design: figma("378:2") },
};
export const AccountMenu: Story = {
	args: { onSettings: fn() },
	parameters: { design: figma("371:5546") },
	play: async ({ args, canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		await expect(
			canvas.queryByRole("button", { name: "Settings" }),
		).not.toBeInTheDocument();
		const account = canvas.getByRole("button", { name: "Open account menu" });
		await userEvent.click(account);
		const menu = within(await body.findByRole("dialog", { name: "Account" }));
		await userEvent.click(menu.getByRole("button", { name: "Settings" }));
		await expect(args.onSettings).toHaveBeenCalledOnce();
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Account" }),
			).not.toBeInTheDocument(),
		);
		await userEvent.click(account);
		await expect(
			await body.findByRole("dialog", { name: "Account" }),
		).toBeVisible();
	},
};
export const AddWebsiteOrFile: Story = {
	parameters: { design: figma("299:7410") },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "Add website or file" }),
		);
		await expect(
			within(canvasElement.ownerDocument.body).getByRole("dialog", {
				name: "Add website or file",
			}),
		).toBeVisible();
	},
};
export const QuickSwitcher: Story = {
	args: { switcherOpen: true },
	parameters: { design: figma("59:2476") },
};
export const AllProjectsFilter: Story = {
	args: { initialPanel: "filter" },
	parameters: { design: figma("135:5533") },
};
export const PublishedFilter: Story = {
	args: { initialFilter: "published" },
	parameters: { design: figma("135:5687") },
};
export const UnpublishedFilter: Story = {
	args: { initialFilter: "unpublished" },
	parameters: { design: figma("135:5858") },
};
export const SearchResults: Story = {
	args: { initialPanel: "search", initialQuery: "White" },
	parameters: { design: figma("135:6048") },
};
export const SearchNoResults: Story = {
	args: { initialPanel: "search", initialQuery: "Marketing" },
	parameters: { design: figma("135:6257") },
};
export const ProjectActions: Story = {
	args: { initialActionsId: demoProjects[0].id },
	parameters: { design: figma("135:5332") },
};
export const LinkCopied: Story = {
	args: { initialCopied: true },
	parameters: { design: figma("140:4874") },
};
export const DeleteConfirmation: Story = {
	args: { initialDeleteId: demoProjects[0].id },
	parameters: { design: figma("140:4901") },
};
export const DeleteResult: Story = {
	args: { projects: demoProjects.slice(1) },
	parameters: { design: figma("140:4928") },
};
