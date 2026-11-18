import {
	MemberAccessCell,
	MemberAction,
	MemberPersonCell,
	MemberRoleCell,
	MemberSearch,
	MemberStatus,
	MembersSearchEmpty,
	MemberTableHeader,
	MemberTableRow,
	MemberToolbar,
	WorkspaceMembersTable,
} from "@agentplace/ui/components/ap-members";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma } from "./fixtures";
import { members, projects } from "./member-fixtures";

const meta = {
	title: "Components/13 Tables & member access/Member table",
	component: WorkspaceMembersTable,
	parameters: {
		layout: "padded",
		design: figma("344:2700"),
		docs: {
			description: {
				component:
					"Shared workspace-member table with protected owner access, distinct workspace and project roles, invitation status and 72px rows. The application supplies data and owns persistence. Search and role filters preserve each other and expose an accessible empty state.",
			},
		},
	},
	args: {
		members,
		projects,
		currentMemberId: "owner",
		onEdit: fn(),
		onRemove: fn(),
		onClear: fn(),
	},
} satisfies Meta<typeof WorkspaceMembersTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const PersonCell: Story = {
	parameters: { design: figma("344:2445") },
	render: () => <MemberPersonCell member={members[0]} self />,
};
export const WorkspaceRoleCell: Story = {
	parameters: { design: figma("344:2454") },
	render: () => <MemberRoleCell workspaceRole="Member" />,
};
export const ProjectAccessCell: Story = {
	parameters: { design: figma("344:2456") },
	render: () => <MemberAccessCell workspaceRole="Member" count={2} />,
};
export const Statuses: Story = {
	parameters: { design: figma("344:2458") },
	render: () => (
		<div style={{ display: "flex", gap: 32 }}>
			{(["Active", "Invited", "Expired"] as const).map((status) => (
				<MemberStatus key={status} status={status} />
			))}
		</div>
	),
};
export const Actions: Story = {
	parameters: { design: figma("344:2468") },
	render: () => (
		<div style={{ display: "flex", gap: 32 }}>
			{[members[0], members[2], members[3]].map((member) => (
				<MemberAction
					key={member.id}
					member={member}
					onEdit={fn()}
					onRemove={fn()}
				/>
			))}
		</div>
	),
};
export const Header: Story = {
	parameters: { design: figma("344:2484") },
	render: () => (
		<div className="ap-members-table">
			<table>
				<MemberTableHeader />
			</table>
		</div>
	),
};
export const Rows: Story = {
	parameters: { design: figma("344:2494") },
	render: () => (
		<div className="ap-members-table">
			<table>
				<MemberTableHeader />
				<tbody>
					{[members[0], members[2], members[3]].map((member) => (
						<MemberTableRow
							key={member.id}
							member={member}
							projects={projects}
							self={member.role === "Owner"}
							onEdit={fn()}
							onRemove={fn()}
						/>
					))}
				</tbody>
			</table>
		</div>
	),
};
export const Search: Story = {
	parameters: { design: figma("344:2679") },
	render: function SearchStory() {
		const [value, setValue] = useState("");
		return <MemberSearch value={value} onChange={setValue} />;
	},
};
export const Toolbar: Story = {
	parameters: { design: figma("344:2684") },
	render: function ToolbarStory() {
		const [query, setQuery] = useState("");
		const [role, setRole] = useState("All roles");
		return (
			<MemberToolbar
				query={query}
				onQueryChange={setQuery}
				role={role}
				onRoleChange={setRole}
				count="3 members · 1 invitation"
			/>
		);
	},
};
export const SearchEmptyBody: Story = {
	parameters: { design: figma("348:2888") },
	render: (args) => <MembersSearchEmpty onClear={args.onClear} />,
};
export const EmptyTable: Story = {
	parameters: { design: figma("352:2788") },
	args: { members: [] },
};
export const RowActions: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "Edit access for Sam" }),
		);
		await expect(args.onEdit).toHaveBeenCalledWith(members[2]);
		await userEvent.click(
			canvas.getByRole("button", { name: "Manage invitation for Nora" }),
		);
		await expect(args.onEdit).toHaveBeenCalledWith(members[3]);
		const remove = canvas.getByRole("button", { name: "Remove Sam" });
		await userEvent.click(remove);
		await expect(args.onRemove).toHaveBeenCalledWith(members[2], remove);
		await expect(
			canvas.getByRole("button", { name: "Owner access is protected" }),
		).toHaveAttribute("aria-disabled", "true");
	},
};
