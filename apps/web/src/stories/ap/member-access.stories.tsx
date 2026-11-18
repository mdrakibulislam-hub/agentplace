import {
	AccessRoleSelect,
	AccessSaveError,
	AccessSuccessToast,
	MemberAccessEditor,
	ProjectAccessRow,
	ProjectAccessTable,
} from "@agentplace/ui/components/ap-members";
import { Button } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { figma } from "./fixtures";
import { members, projects } from "./member-fixtures";

const meta = {
	title: "Components/13 Tables & member access/Member editor",
	component: MemberAccessEditor,
	parameters: {
		layout: "fullscreen",
		design: figma("348:2429"),
		docs: {
			description: {
				component:
					"480px member editor with staged permissions, explicit asynchronous save, error recovery and dirty-discard confirmation. Admin includes every current and future project; billing stays owner-only. Escape never discards edits silently. Modal focus is trapped and reduced motion removes travel.",
			},
		},
	},
	args: { member: members[2], projects, onSave: fn(), onClose: fn() },
	render: function Editor(args) {
		const [open, setOpen] = useState(true);
		return (
			<>
				<Button onClick={() => setOpen(true)}>Edit member</Button>
				{open && (
					<MemberAccessEditor
						{...args}
						onClose={() => {
							args.onClose();
							setOpen(false);
						}}
					/>
				)}
			</>
		);
	},
} satisfies Meta<typeof MemberAccessEditor>;
export default meta;
type Story = StoryObj<typeof meta>;
async function changeProject(canvasElement: HTMLElement) {
	const body = within(canvasElement.ownerDocument.body);
	await userEvent.click(
		body.getByRole("combobox", { name: "Access to Customer Support" }),
	);
	await userEvent.click(await body.findByRole("option", { name: /Editor/ }));
	return body;
}
export const Unchanged: Story = {
	parameters: { design: figma("351:2732") },
	play: async ({ canvasElement }) => {
		await expect(
			within(canvasElement.ownerDocument.body).getByRole("button", {
				name: "Save changes",
			}),
		).toBeDisabled();
	},
};
export const UnsavedChanges: Story = {
	parameters: { design: figma("348:2430") },
	play: async ({ canvasElement, args }) => {
		const body = await changeProject(canvasElement);
		await expect(
			body.getByRole("button", { name: "Save changes" }),
		).toBeEnabled();
		await expect(args.onSave).not.toHaveBeenCalled();
	},
};
export const SaveAndClose: Story = {
	play: async ({ canvasElement, args }) => {
		const body = await changeProject(canvasElement);
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await waitFor(() => expect(args.onClose).toHaveBeenCalled());
		await expect(args.onSave).toHaveBeenCalledWith({
			...members[2],
			access: { ...members[2].access, [projects[1].id]: "Editor" },
		});
	},
};
export const Admin: Story = {
	parameters: { design: figma("348:2520") },
	args: { member: members[1] },
};
export const GrantAdmin: Story = {
	parameters: { design: figma("356:11581") },
	play: async ({ canvasElement, args }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
		await userEvent.click(await body.findByRole("option", { name: /Admin/ }));
		await expect(body.getByText("Billing stays owner-only.")).toBeVisible();
		await expect(
			body.queryByRole("combobox", { name: "Access to Customer Support" }),
		).not.toBeInTheDocument();
		await expect(args.onSave).not.toHaveBeenCalled();
	},
};
export const Saving: Story = {
	parameters: { design: figma("348:2666") },
	args: { onSave: fn(() => new Promise<void>(() => {})) },
	play: async ({ canvasElement, args }) => {
		const body = await changeProject(canvasElement);
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await userEvent.keyboard("{Escape}");
		await expect(
			body.getByRole("dialog", { name: "Edit member" }),
		).toBeVisible();
		await expect(body.getByRole("button", { name: "Cancel" })).toBeDisabled();
		await expect(args.onSave).toHaveBeenCalledTimes(1);
		await expect(args.onClose).not.toHaveBeenCalled();
	},
};
export const SaveError: Story = {
	parameters: { design: figma("348:2569") },
	args: {
		onSave: fn(async () => {
			throw new Error("Your edits are still here. Try again.");
		}),
	},
	play: async ({ canvasElement }) => {
		const body = await changeProject(canvasElement);
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await expect(await body.findByRole("alert")).toHaveTextContent(
			"Changes weren’t saved.",
		);
		await expect(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		).toHaveTextContent("Editor");
	},
};
export const Retry: Story = {
	args: {
		onSave: fn(),
	},
	play: async ({ canvasElement, args }) => {
		args.onSave
			.mockRejectedValueOnce(new Error("Your edits are still here. Try again."))
			.mockResolvedValue(undefined);
		const body = await changeProject(canvasElement);
		await userEvent.click(body.getByRole("button", { name: "Save changes" }));
		await userEvent.click(
			await body.findByRole("button", { name: "Try again" }),
		);
		await waitFor(() => expect(args.onClose).toHaveBeenCalled());
		await expect(args.onSave).toHaveBeenCalledTimes(2);
	},
};
export const DiscardChanges: Story = {
	parameters: { design: figma("358:2946") },
	play: async ({ canvasElement, args }) => {
		const body = await changeProject(canvasElement);
		await userEvent.keyboard("{Escape}");
		const confirm = await body.findByRole("dialog", {
			name: "Discard changes?",
		});
		await waitFor(() =>
			expect(
				within(confirm).getByRole("button", { name: "Keep editing" }),
			).toHaveFocus(),
		);
		await expect(args.onSave).not.toHaveBeenCalled();
	},
};
export const KeepEditingAndDiscard: Story = {
	play: async ({ canvasElement, args }) => {
		const body = await changeProject(canvasElement);
		await userEvent.click(body.getByRole("button", { name: "Cancel" }));
		await userEvent.click(
			await body.findByRole("button", { name: "Keep editing" }),
		);
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Discard changes?" }),
			).not.toBeInTheDocument(),
		);
		await expect(
			body.getByRole("combobox", { name: "Access to Customer Support" }),
		).toHaveTextContent("Editor");
		await userEvent.click(body.getByRole("button", { name: "Cancel" }));
		await userEvent.click(
			await body.findByRole("button", { name: "Discard changes" }),
		);
		await waitFor(() => expect(args.onClose).toHaveBeenCalled());
		await expect(args.onSave).not.toHaveBeenCalled();
	},
};
export const ProjectRow: Story = {
	parameters: { design: figma("344:2621") },
	render: function Row() {
		const [value, setValue] = useState("Editor");
		return (
			<div
				className="ap-project-access-table"
				style={{ width: 432, margin: 24 }}
			>
				<table>
					<tbody>
						<ProjectAccessRow
							project={projects[0]}
							value={value}
							onChange={setValue}
						/>
					</tbody>
				</table>
			</div>
		);
	},
};
export const ProjectTable: Story = {
	render: function Table() {
		const [access, setAccess] = useState(members[2].access);
		return (
			<div style={{ width: 432, maxWidth: "100%", padding: 24 }}>
				<ProjectAccessTable
					projects={projects}
					access={access}
					onChange={setAccess}
				/>
			</div>
		);
	},
};
export const WorkspaceRoleMenu: Story = {
	parameters: { design: figma("348:2756") },
	render: function Roles() {
		const [value, setValue] = useState("Member");
		return (
			<div style={{ width: 432, margin: 24 }}>
				<AccessRoleSelect
					label="Workspace role"
					kind="workspace"
					value={value}
					onChange={setValue}
				/>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("combobox", { name: "Workspace role" }),
		);
		await expect(
			await body.findByRole("option", { name: /Admin/ }),
		).toHaveTextContent("Manage members, skills and plugins");
	},
};
export const WorkspaceRoleOption: Story = {
	...WorkspaceRoleMenu,
	parameters: { design: figma("344:2664") },
};
export const ProjectRoleMenu: Story = {
	parameters: { design: figma("348:2895") },
	render: function Roles() {
		const [value, setValue] = useState("Viewer");
		return (
			<div style={{ width: 132, margin: 24 }}>
				<AccessRoleSelect
					label="Project access"
					value={value}
					onChange={setValue}
				/>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		await userEvent.click(
			body.getByRole("combobox", { name: "Project access" }),
		);
		await expect(
			await body.findByRole("option", { name: /No access/ }),
		).toHaveTextContent("Remove project access");
	},
};
export const ErrorFeedback: Story = {
	parameters: { design: figma("348:2422") },
	render: () => (
		<div style={{ width: 432, maxWidth: "100%", margin: 24 }}>
			<AccessSaveError />
		</div>
	),
};
export const SuccessToast: Story = {
	parameters: { design: figma("353:2944") },
	render: () => <AccessSuccessToast message="Sam’s permissions were saved." />,
};

export const KeyboardAndFocus: Story = {
	play: async ({ canvasElement }) => {
		const body = within(canvasElement.ownerDocument.body);
		const close = body.getByRole("button", { name: "Close edit member" });
		await waitFor(() => expect(close).toHaveFocus());
		await userEvent.tab({ shift: true });
		await expect(body.getByRole("button", { name: "Cancel" })).toHaveFocus();
		await userEvent.tab();
		await expect(close).toHaveFocus();
		await userEvent.tab();
		await expect(
			body.getByRole("combobox", { name: "Workspace role" }),
		).toHaveFocus();
		await userEvent.keyboard("{Enter}{ArrowDown}{Enter}");
		await expect(body.getByText("Billing stays owner-only.")).toBeVisible();
		await userEvent.keyboard("{Escape}");
		const confirm = await body.findByRole("dialog", {
			name: "Discard changes?",
		});
		await waitFor(() =>
			expect(
				within(confirm).getByRole("button", { name: "Keep editing" }),
			).toHaveFocus(),
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				body.queryByRole("dialog", { name: "Discard changes?" }),
			).not.toBeInTheDocument(),
		);
		await expect(
			body.getByRole("combobox", { name: "Workspace role" }),
		).toHaveTextContent("Admin");
	},
};
