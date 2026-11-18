import { ProjectCard } from "@agentplace/ui/components/ap-builder";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { figma, projects } from "./fixtures";

const meta = {
	title: "Components/07 Project & builder/Project card",
	component: ProjectCard,
	parameters: {
		design: figma("49:1705"),
		figmaNodeId: "49:1705",
		docs: {
			description: {
				component:
					"352px card, 320 × 124 cover, name/status on one row and edited time below. The default mascot cover loops the original blink and gentle hop, respecting reduced motion and visibility. Publication and cover state are independent. Open project, edit cover and overflow actions are separate buttons bound to the correct project ID. Hover/focus temporarily reveals upload without deleting the current asset. Read-only cards never expose cover editing. Sample names and IDs exist only in stories.",
			},
		},
	},
	args: {
		project: projects[0],
		onOpen: fn(),
		onCoverEdit: fn(),
		onAction: fn(),
	},
} satisfies Meta<typeof ProjectCard>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Published: Story = {
	parameters: { figmaVariantId: "49:1643" },
	play: async ({ canvasElement }) => {
		const view = canvasElement.ownerDocument.defaultView;
		if (!view) throw new Error("Project card requires a browser window");
		if (
			view.matchMedia("(prefers-reduced-motion: reduce)").matches ||
			canvasElement.ownerDocument.documentElement.dataset.apMotion === "reduced"
		)
			return;
		const mascot = canvasElement.querySelector<HTMLElement>(
			".ap-cover-mascot [data-ap-mascot-artwork]",
		);
		const lid = mascot?.querySelector<HTMLElement>("[data-ap-mascot-lid]");
		const card = canvasElement.querySelector<HTMLElement>(".ap-project-card");
		if (!mascot || !lid || !card)
			throw new Error("Missing project card mascot");
		// Observe a complete natural cycle: both visible movement and blinking
		// must occur without moving the card's layout or seeking animation tracks.
		const samples = await new Promise<
			{ top: number; lidHeight: number; cardTop: number; cardHeight: number }[]
		>((resolve) => {
			const frames: {
				top: number;
				lidHeight: number;
				cardTop: number;
				cardHeight: number;
			}[] = [];
			const start = view.performance.now();
			const sample = (now: number) => {
				const bounds = card.getBoundingClientRect();
				frames.push({
					top: mascot.getBoundingClientRect().top,
					lidHeight: lid.getBoundingClientRect().height,
					cardTop: bounds.top,
					cardHeight: bounds.height,
				});
				if (now - start >= 2200) resolve(frames);
				else view.requestAnimationFrame(sample);
			};
			view.requestAnimationFrame(sample);
		});
		const range = (values: number[]) =>
			Math.max(...values) - Math.min(...values);
		await expect(range(samples.map((sample) => sample.top))).toBeGreaterThan(2);
		await expect(
			range(samples.map((sample) => sample.lidHeight)),
		).toBeGreaterThan(3);
		await expect(range(samples.map((sample) => sample.cardTop))).toBeLessThan(
			0.1,
		);
		await expect(
			range(samples.map((sample) => sample.cardHeight)),
		).toBeLessThan(0.1);
	},
};
export const Unpublished: Story = {
	parameters: { figmaVariantId: "49:1674" },
	args: { project: { ...projects[0], status: "Unpublished" } },
};
export const ReadOnly: Story = { args: { canEdit: false } };

export const CoverDoesNotNavigate: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(
			canvas.getByRole("button", { name: "Add project cover" }),
		);
		await expect(args.onCoverEdit).toHaveBeenCalledWith(args.project.id);
		await expect(args.onOpen).not.toHaveBeenCalled();
	},
};
