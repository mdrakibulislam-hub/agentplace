import type { MemberRecord } from "@agentplace/ui/components/ap-members";
import { projects } from "./fixtures";

export { projects };
export const members: MemberRecord[] = [
	{
		id: "owner",
		name: "Rakib",
		email: "rakib@whiteframe.agency",
		initials: "RA",
		role: "Owner",
		access: {},
	},
	{
		id: "admin",
		name: "Maya",
		email: "maya@whiteframe.agency",
		initials: "MA",
		role: "Admin",
		access: {},
	},
	{
		id: "member",
		name: "Sam",
		email: "sam@whiteframe.agency",
		initials: "SA",
		role: "Member",
		access: { [projects[0].id]: "Editor", [projects[1].id]: "Viewer" },
	},
	{
		id: "invited",
		name: "Nora",
		email: "nora@whiteframe.agency",
		initials: "NO",
		role: "Member",
		invited: true,
		access: { [projects[0].id]: "Editor" },
	},
];
