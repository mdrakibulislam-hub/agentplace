import { AgentCard } from "@agentplace/ui/components/agent-card";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
	title: "Components/AgentCard",
	component: AgentCard,
	args: {
		name: "Appointment assistant",
		category: "Scheduling",
		description: "Help customers find a time and book their next appointment.",
	},
} satisfies Meta<typeof AgentCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const CustomerService: Story = {
	args: {
		name: "Support assistant",
		category: "Customer service",
		description:
			"Answer common questions and guide customers through their next steps.",
	},
};
