import { Icon, iconNames } from "@agentplace/ui/components/ap-icon";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/02 Reicon icons/Library",
	component: Icon,
	args: { name: "arrow-right", size: 20 },
	argTypes: { name: { control: "select", options: iconNames } },
	parameters: {
		docs: {
			description: {
				component:
					"Original Reicon SVG masters use a20px grid; compact controls use16px. Decorative icons are hidden from assistive technology; meaningful icons need decorative=false and a label. Original assets are local and recolor through semantic currentColor. The final five masters were supplied as original local Figma SVG exports; provenance is recorded in the asset manifest.",
			},
		},
	},
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Google: Story = {
	args: { name: "Google" },
	parameters: {
		figmaComponentId: "51:1017",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=51-1017",
		},
	},
};
export const ArrowLeft: Story = {
	args: { name: "arrow-left" },
	parameters: {
		figmaComponentId: "49:634",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-634",
		},
	},
};
export const ArrowLeftToLine: Story = {
	args: { name: "arrow-left-to-line" },
	parameters: {
		figmaComponentId: "49:569",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-569",
		},
	},
};
export const ArrowRight: Story = {
	args: { name: "arrow-right" },
	parameters: {
		figmaComponentId: "32:14",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-14",
		},
	},
};
export const ArrowUp: Story = {
	args: { name: "arrow-up" },
	parameters: {
		figmaComponentId: "32:10",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-10",
		},
	},
};
export const BriefcaseBusiness: Story = {
	args: { name: "briefcase-business" },
	parameters: {
		figmaComponentId: "49:523",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-523",
		},
	},
};
export const Calendar: Story = {
	args: { name: "calendar" },
	parameters: {
		figmaComponentId: "49:623",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-623",
		},
	},
};
export const Check: Story = {
	args: { name: "check" },
	parameters: {
		figmaComponentId: "32:18",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-18",
		},
	},
};
export const ChevronDown: Story = {
	args: { name: "chevron-down" },
	parameters: {
		figmaComponentId: "32:7",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-7",
		},
	},
};
export const ChevronUp: Story = {
	args: { name: "chevron-up" },
	parameters: {
		figmaComponentId: "82:4407",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4407",
		},
	},
};
export const ChevronsUpDown: Story = {
	args: { name: "chevrons-up-down" },
	parameters: {
		figmaComponentId: "49:529",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-529",
		},
	},
};
export const Close: Story = {
	args: { name: "close" },
	parameters: {
		figmaComponentId: "32:21",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-21",
		},
	},
};
export const Copy: Story = {
	args: { name: "copy" },
	parameters: {
		figmaComponentId: "49:581",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-581",
		},
	},
};
export const CreditCard: Story = {
	args: { name: "credit-card" },
	parameters: {
		figmaComponentId: "49:601",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-601",
		},
	},
};
export const Database: Story = {
	args: { name: "database" },
	parameters: {
		figmaComponentId: "49:538",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-538",
		},
	},
};
export const Download: Story = {
	args: { name: "download" },
	parameters: {
		figmaComponentId: "82:4704",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4704",
		},
	},
};
export const ExternalLink: Story = {
	args: { name: "external-link" },
	parameters: {
		figmaComponentId: "49:615",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-615",
		},
	},
};
export const Eye: Story = {
	args: { name: "eye" },
	parameters: {
		figmaComponentId: "49:611",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-611",
		},
	},
};
export const EyeOff: Story = {
	args: { name: "eye-off" },
	parameters: {
		figmaComponentId: "82:4410",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4410",
		},
	},
};
export const FileText: Story = {
	args: { name: "file-text" },
	parameters: {
		figmaComponentId: "49:546",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-546",
		},
	},
};
export const Filter: Story = {
	args: { name: "filter" },
	parameters: {
		figmaComponentId: "82:4721",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4721",
		},
	},
};
export const Globe: Story = {
	args: { name: "globe" },
	parameters: {
		figmaComponentId: "49:629",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-629",
		},
	},
};
export const History: Story = {
	args: { name: "history" },
	parameters: {
		figmaComponentId: "49:642",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-642",
		},
	},
};
export const Lightbulb: Story = {
	args: { name: "lightbulb" },
	parameters: {
		figmaComponentId: "49:585",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-585",
		},
	},
};
export const Link: Story = {
	args: { name: "link" },
	parameters: {
		figmaComponentId: "49:553",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-553",
		},
	},
};
export const Loader: Story = {
	args: { name: "loader" },
	parameters: {
		figmaComponentId: "32:28",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-28",
		},
	},
};
export const Lock: Story = {
	args: { name: "lock" },
	parameters: {
		figmaComponentId: "82:4715",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4715",
		},
	},
};
export const Mail: Story = {
	args: { name: "mail" },
	parameters: {
		figmaComponentId: "49:565",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-565",
		},
	},
};
export const MessageCircleQuestionMark: Story = {
	args: { name: "message-circle-question-mark" },
	parameters: {
		figmaComponentId: "49:606",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-606",
		},
	},
};
export const MessageSquare: Story = {
	args: { name: "message-square" },
	parameters: {
		figmaComponentId: "49:598",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-598",
		},
	},
};
export const Monitor: Story = {
	args: { name: "monitor" },
	parameters: {
		figmaComponentId: "49:652",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-652",
		},
	},
};
export const MoreHorizontal: Story = {
	args: { name: "more-horizontal" },
	parameters: {
		figmaComponentId: "49:533",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-533",
		},
	},
};
export const Palette: Story = {
	args: { name: "palette" },
	parameters: {
		figmaComponentId: "49:574",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-574",
		},
	},
};
export const PanelLeftClose: Story = {
	args: { name: "panel-left-close" },
	parameters: {
		figmaComponentId: "49:593",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-593",
		},
	},
};
export const Paperclip: Story = {
	args: { name: "paperclip" },
	parameters: {
		figmaComponentId: "49:590",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-590",
		},
	},
};
export const Phone: Story = {
	args: { name: "phone" },
	parameters: {
		figmaComponentId: "99:1477",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=99-1477",
		},
	},
};
export const Plus: Story = {
	args: { name: "plus" },
	parameters: {
		figmaComponentId: "32:3",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-3",
		},
	},
};
export const Puzzle: Story = {
	args: { name: "puzzle" },
	parameters: {
		figmaComponentId: "49:543",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-543",
		},
	},
};
export const Refresh: Story = {
	args: { name: "refresh" },
	parameters: {
		figmaComponentId: "82:4718",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4718",
		},
	},
};
export const Search: Story = {
	args: { name: "search" },
	parameters: {
		figmaComponentId: "32:24",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-24",
		},
	},
};
export const Settings: Story = {
	args: { name: "settings" },
	parameters: {
		figmaComponentId: "49:561",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-561",
		},
	},
};
export const ShieldCheck: Story = {
	args: { name: "shield-check" },
	parameters: {
		figmaComponentId: "49:638",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-638",
		},
	},
};
export const SquarePen: Story = {
	args: { name: "square-pen" },
	parameters: {
		figmaComponentId: "49:557",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-557",
		},
	},
};
export const Trash: Story = {
	args: { name: "trash" },
	parameters: {
		figmaComponentId: "82:4707",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4707",
		},
	},
};
export const Upload: Story = {
	args: { name: "upload" },
	parameters: {
		figmaComponentId: "82:4701",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4701",
		},
	},
};
export const UserAdd: Story = {
	args: { name: "user-add" },
	parameters: {
		figmaComponentId: "82:4710",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=82-4710",
		},
	},
};
export const Users: Story = {
	args: { name: "users" },
	parameters: {
		figmaComponentId: "49:646",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-646",
		},
	},
};
export const Zap: Story = {
	args: { name: "zap" },
	parameters: {
		figmaComponentId: "49:620",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=49-620",
		},
	},
};
export const AllIcons: Story = {
	render: () => (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(6, 150px)",
				gap: 24,
			}}
		>
			{iconNames
				.filter((name) => name !== "more-filled")
				.map((name) => (
					<div
						key={name}
						style={{ display: "flex", alignItems: "center", gap: 12 }}
					>
						<Icon name={name} size={20} />
						<span style={{ fontSize: 12 }}>{name}</span>
					</div>
				))}
		</div>
	),
};
