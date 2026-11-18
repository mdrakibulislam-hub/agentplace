import type { MenuProject } from "@agentplace/ui/components/ap-menus";

// These are isolated Storybook fixtures, never persisted project data.
export const projects: MenuProject[] = [
	{
		id: "storybook-whiteframe",
		name: "WhiteFrame Advisor",
		status: "Published",
		updated: "Edited 2 hours ago",
		icon: "briefcase-business",
		liveUrl: "https://example.com/agent/whiteframe",
	},
	{
		id: "storybook-support",
		name: "Customer Support",
		status: "Unpublished",
		updated: "Edited yesterday",
		icon: "message-square",
	},
	{
		id: "storybook-booking",
		name: "Booking Assistant",
		status: "Published",
		updated: "Edited 3 days ago",
		icon: "calendar",
		liveUrl: "https://example.com/agent/booking",
	},
];
export const figma = (nodeId: string) => ({
	type: "figma",
	url: `https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=${nodeId.replace(":", "-")}`,
});
export const interactionGuide =
	"Keyboard: Tab reaches controls; Arrow keys move choices; Enter/Space selects. Escape and outside pointer dismiss anchored menus and restore focus to the trigger. Search accepts text without type-ahead stealing keystrokes. Callbacks are isolated Storybook spies, not live services.";
