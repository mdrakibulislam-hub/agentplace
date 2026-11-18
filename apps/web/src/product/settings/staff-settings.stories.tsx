import type { InvitationDraft } from "@agentplace/ui/components/ap-members";
import { SettingsNavigation } from "@agentplace/ui/components/ap-navigation";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, spyOn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "../../stories/ap/fixtures";
import {
	members as fixtureMembers,
	projects,
} from "../../stories/ap/member-fixtures";
import { demoProjects } from "../prototype-data";
import { WorkspaceHeader } from "../workspace-header";
import { SettingsStateProvider, useSettingsState } from "./settings-state";
import { StaffSettings } from "./staff-settings";
import "./settings.css";

function StaffScene({
	failSave = false,
	delivery = true,
}: {
	failSave?: boolean;
	delivery?: boolean;
}) {
	const [members, setMembers] = useState(fixtureMembers);
	const [failed, setFailed] = useState(false);
	async function invite(draft: InvitationDraft) {
		const name = draft.email.split("@")[0];
		return {
			...draft,
			id: crypto.randomUUID(),
			name,
			initials: name.slice(0, 2).toUpperCase(),
			invited: true,
		};
	}
	return (
		<>
			<WorkspaceHeader
				projects={projects}
				currentProjectId={projects[0].id}
				showProjectName
				onProject={fn()}
				onProjects={fn()}
				onCreate={fn()}
				onSettings={fn()}
				onBilling={fn()}
				onSignOut={fn()}
			/>
			<div className="product-settings">
				<SettingsNavigation
					active="Staff & roles"
					onHome={fn()}
					onChange={fn()}
					workspace="WhiteFrame"
				/>
				<main className="product-settings-content">
					<section className="product-settings-section">
						<StaffSettings
							members={members}
							projects={projects}
							currentMemberId="owner"
							onMembersChange={async (next) => {
								if (failSave && !failed) {
									setFailed(true);
									throw new Error("Your edits are still here. Try again.");
								}
								setMembers(next);
							}}
							onInvite={delivery ? invite : undefined}
							onResend={delivery ? async () => {} : undefined}
						/>
					</section>
				</main>
			</div>
		</>
	);
}
const meta = {
	title: "Product/Staff management",
	component: StaffScene,
	parameters: {
		layout: "fullscreen",
		design: figma("59:2860"),
		docs: {
			description: {
				component:
					"Approved staff-management screen using the same shared table, drawer and dialogs as the frontend. Isolated Storybook data and async adapters cover the complete flow; app membership storage remains browser-local and delivery requires a service.",
			},
		},
	},
} satisfies Meta<typeof StaffScene>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Members: Story = {};
export const SearchEmpty: Story = {
	parameters: { design: figma("354:12452") },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("searchbox", { name: "Search members" }),
			"Alex",
		);
		await expect(canvas.getByText("No matching members")).toBeVisible();
		await expect(canvas.getByRole("status")).toHaveTextContent("0 results");
	},
};
export const SearchAndFilter: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(
			canvas.getByRole("searchbox", { name: "Search members" }),
			"Sam",
		);
		await userEvent.selectOptions(
			canvas.getByRole("combobox", { name: "Filter by workspace role" }),
			"Admin",
		);
		await expect(canvas.getByText("No matching members")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
		await expect(canvas.getAllByRole("row")).toHaveLength(5);
		await expect(
			canvas.getByRole("searchbox", { name: "Search members" }),
		).toHaveValue("");
	},
};
async function openSam(canvasElement: HTMLElement) {
	const body = within(canvasElement.ownerDocument.body);
	await userEvent.click(
		body.getByRole("button", { name: "Edit access for Sam" }),
	);
	return body;
}
export const EditMember: Story = {
	parameters: { design: figma("349:8544") },
	play: async ({ canvasElement }) => {
		await openSam(canvasElement);
	},
};
export const EditAdmin: Story = {
	parameters: { design: figma("349:8830") },
	play: async ({ canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", {
				name: "Edit access for Maya",
			}),
		);
	},
};
export const SaveMember: Story = {
	parameters: { design: figma("354:12408") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await expect(
			await body.findByText("Sam’s permissions were saved."),
		).toBeVisible();
		await waitFor(() =>
			expect(
				body.getByRole("button", { name: "Edit access for Sam" }),
			).toHaveFocus(),
		);
		await userEvent.click(
			body.getByRole("button", { name: "Edit access for Sam" }),
		);
		await expect(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		).toHaveTextContent("Editor");
		await expect(
			body.getByRole("button", { name: "Save changes" }),
		).toBeDisabled();
		await userEvent.keyboard("{Escape}");
	},
};
export const PromoteAdmin: Story = {
	parameters: { design: figma("354:12430") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Admin/ }));
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await expect(
			await body.findByText("Sam’s permissions were saved."),
		).toBeVisible();
		const row = body.getByRole("row", { name: /Sam sam@whiteframe.agency/ });
		await expect(row).toHaveTextContent("Admin");
		await expect(row).toHaveTextContent("All projects");
	},
};
export const SaveRetry: Story = {
	args: { failSave: true },
	parameters: { design: figma("349:9072") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Changes weren’t saved.",
		);
		await userEvent.click(body.getByRole("button", { name: "Try again" }));
		await expect(
			await body.findByText("Sam’s permissions were saved."),
		).toBeVisible();
	},
};
export const Invite: Story = {
	parameters: { design: figma("349:8914") },
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(body.getByRole("button", { name: "Invite member" }));
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency",
		);
	},
};
export const InviteAndRevoke: Story = {
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(body.getByRole("button", { name: "Invite member" }));
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency{Enter}",
		);
		await expect(
			await body.findByText("Waiting for riya@whiteframe.agency to accept."),
		).toBeVisible();
		await userEvent.click(
			body.getByRole("button", { name: "Manage invitation for riya" }),
		);
		await userEvent.click(
			body.getByRole("button", { name: "Revoke invitation" }),
		);
		const confirm = await body.findByRole("dialog", {
			name: "Revoke invitation?",
		});
		await userEvent.click(
			within(confirm).getByRole("button", { name: "Revoke invitation" }),
		);
		await expect(
			await body.findByText("riya’s pending invitation was removed."),
		).toBeVisible();
		await expect(
			body.queryByRole("row", { name: /riya@whiteframe.agency/ }),
		).not.toBeInTheDocument();
	},
};
export const PendingInvitation: Story = {
	parameters: { design: figma("349:9249") },
	play: async ({ canvasElement }) => {
		await userEvent.click(
			within(canvasElement).getByRole("button", {
				name: "Manage invitation for Nora",
			}),
		);
	},
};
export const UnavailableDelivery: Story = {
	args: { delivery: false },
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(body.getByRole("button", { name: "Invite member" }));
		await userEvent.type(
			body.getByRole("textbox", { name: "Email address" }),
			"riya@whiteframe.agency{Enter}",
		);
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Your invitation hasn’t been sent.",
		);
		await expect(
			body.queryByRole("row", { name: /riya@whiteframe.agency/ }),
		).not.toBeInTheDocument();
	},
};

function StoredStaff() {
	const [settings, , saveMembers] = useSettingsState();
	return (
		<div className="product-settings-content">
			<section className="product-settings-section">
				<StaffSettings
					members={settings.members}
					projects={demoProjects}
					onMembersChange={saveMembers}
				/>
			</section>
		</div>
	);
}
export const BrowserStorageFailureAndRetry: Story = {
	render: () => (
		<SettingsStateProvider workspaceId="storybook-storage-check">
			<StoredStaff />
		</SettingsStateProvider>
	),
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
		const storage = spyOn(Storage.prototype, "setItem").mockImplementation(
			() => {
				throw new DOMException("Storage full", "QuotaExceededError");
			},
		);
		try {
			await userEvent.click(body.getByRole("button", { name: "Save changes" }));
			await expect(await body.findByRole("alert")).toHaveTextContent(
				"Your browser couldn’t save these changes.",
			);
			await expect(
				body.getByRole("combobox", { name: "Access to Customer Support" }),
			).toHaveTextContent("Editor");
			storage.mockImplementation(() => {});
			await userEvent.click(body.getByRole("button", { name: "Try again" }));
			await expect(
				await body.findByText("Sam’s permissions were saved."),
			).toBeVisible();
			await expect(storage).toHaveBeenCalledWith(
				"agentplace.prototype.settings.v1",
				expect.stringContaining('"customer-support":"Editor"'),
			);
		} finally {
			storage.mockRestore();
		}
	},
};

export const MemberUnsaved: Story = {
	parameters: { design: figma("354:12354") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
	},
};
export const AdminUnsaved: Story = {
	parameters: { design: figma("356:11581") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Admin/ }));
	},
};
export const SaveErrorScreen: Story = {
	args: { failSave: true },
	parameters: { design: figma("349:9072") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await expect(await body.findByRole("alert")).toBeVisible();
	},
};
export const WorkspaceRoleChoices: Story = {
	parameters: { design: figma("349:8724") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
	},
};
export const ProjectRoleChoices: Story = {
	parameters: { design: figma("349:9315") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
	},
};
export const DiscardMemberChanges: Story = {
	parameters: { design: figma("358:13885") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
		await userEvent.keyboard("{Escape}");
	},
};
export const DiscardAdminChanges: Story = {
	parameters: { design: figma("358:13921") },
	play: async ({ canvasElement }) => {
		const body = await openSam(canvasElement);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Admin/ }));
		await userEvent.keyboard("{Escape}");
	},
};
