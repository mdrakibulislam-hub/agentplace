import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	expect,
	fireEvent,
	fn,
	spyOn,
	userEvent,
	waitFor,
	within,
} from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import { demoCredits, demoProjects, demoProjectUsage } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import {
	SettingsExperience,
	SettingsStateProvider,
} from "./settings-experience";

const meta = {
	title: "Product/Workspace settings",
	component: SettingsExperience,
	parameters: { layout: "fullscreen" },
	args: {
		projects: demoProjects,
		credits: demoCredits,
		projectUsage: demoProjectUsage,
		onBack: fn(),
	},
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

export const WorkspaceNameSaveRecovery: Story = {
	args: { initialSection: "General" },
	render: (args) => (
		<SettingsStateProvider workspaceId="storybook-general-save-check">
			<SettingsExperience {...args} />
		</SettingsStateProvider>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const name = canvas.getByRole("textbox", { name: "Workspace name" });
		const save = canvas.getByRole("button", { name: "Save workspace" });
		const form = name.closest("form");
		if (!form) throw new Error("Workspace name form is missing.");
		await expect(save).toBeDisabled();
		fireEvent.change(name, { target: { value: "" } });
		await waitFor(() => expect(save).toBeEnabled());
		fireEvent.submit(form);
		await canvas.findByText("Enter a workspace name.");
		await expect(name).toHaveFocus();
		await expect(name).toHaveAttribute("aria-invalid", "true");
		fireEvent.change(name, { target: { value: "  Studio workspace  " } });
		const storage = spyOn(Storage.prototype, "setItem").mockImplementation(
			() => {
				throw new DOMException("Storage full", "QuotaExceededError");
			},
		);
		try {
			fireEvent.submit(form);
			await expect(await canvas.findByRole("alert")).toHaveTextContent(
				"Your browser couldn’t save these changes.",
			);
			await expect(name).toHaveValue("  Studio workspace  ");
			storage.mockImplementation(() => {});
			fireEvent.submit(form);
			await expect(
				await canvas.findByText("Workspace details saved."),
			).toBeVisible();
			await expect(name).toHaveValue("Studio workspace");
			await expect(save).toBeDisabled();
		} finally {
			storage.mockRestore();
		}
	},
};

export const SkillDraftAndSearch: Story = {
	args: { initialSection: "Skills library" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const create = canvas.getByRole("button", { name: "Create skill" });
		await userEvent.click(create);
		const name = canvas.getByRole("textbox", { name: "Skill name" });
		await expect(name).toHaveFocus();
		fireEvent.change(name, { target: { value: "Service recommendations" } });
		await userEvent.click(canvas.getByRole("button", { name: "Save skill" }));
		await expect(name).toHaveAttribute("aria-invalid", "true");
		await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
		await waitFor(() => expect(create).toHaveFocus());
		const search = canvas.getByRole("searchbox", { name: "Find a skill" });
		fireEvent.change(search, { target: { value: "xyz" } });
		await expect(await canvas.findByText("No matching skills.")).toBeVisible();
		await userEvent.click(
			canvas.getByRole("button", { name: "Clear skill search" }),
		);
		await expect(search).toHaveFocus();
		await expect(search).toHaveValue("");
	},
};

export const PluginAccessDraftAndDismissal: Story = {
	args: { initialSection: "Plugins" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const save = canvas.getByRole("button", { name: "Save project access" });
		const access = canvas.getByRole("combobox", {
			name: "Access for Customer Support",
		});
		await expect(save).toBeDisabled();
		await userEvent.selectOptions(access, "allowed");
		await waitFor(() => expect(save).toBeEnabled());
		await userEvent.click(
			canvas.getByRole("button", { name: "Reset changes" }),
		);
		await waitFor(() => expect(access).toHaveValue("denied"));
		await expect(save).toBeDisabled();
		const connect = canvas.getByRole("button", { name: "Connect Calendar" });
		await userEvent.click(connect);
		const dialog = within(
			await canvas.findByRole("dialog", { name: "Connect Calendar" }),
		);
		await waitFor(() =>
			expect(dialog.getByRole("button", { name: "Cancel" })).toHaveFocus(),
		);
		await userEvent.click(dialog.getByRole("button", { name: "Cancel" }));
		await waitFor(() => expect(connect).toHaveFocus());
	},
};

export const BillingPeriodKeyboardSelection: Story = {
	args: { initialSection: "Billing & usage" },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const body = within(canvasElement.ownerDocument.body);
		const trigger = canvas.getByRole("button", { name: "This billing period" });
		trigger.focus();
		await userEvent.keyboard("{Enter}");
		const current = await body.findByRole("button", {
			name: "This billing period",
			pressed: true,
		});
		await waitFor(() => expect(current).toBeVisible());
		await userEvent.keyboard("{End}{Enter}");
		await expect(
			await canvas.findByText(
				"Usage data is unavailable for the previous billing period.",
			),
		).toBeVisible();
		await waitFor(() => expect(trigger).toHaveFocus());
		await expect(trigger).toHaveAccessibleName("Previous billing period");
	},
};
