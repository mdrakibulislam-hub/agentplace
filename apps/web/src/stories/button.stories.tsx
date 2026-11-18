import { Button, type ButtonProps } from "@agentplace/ui/components/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

const meta = {
	title: "Components/Actions/Primary button",
	component: Button,
	args: { children: "Continue", variant: "default" },
	parameters: {
		layout: "centered",
		figmaComponentId: "32:43",
		design: {
			type: "figma",
			url: "https://www.figma.com/design/m0v1MINOJA152Kil6JHeZ8/Agentplace?node-id=32-43",
		},
		docs: {
			description: {
				component:
					"Pill-shaped AP action. Small is 32px high with 12px side padding; Medium is 40px with 16px side padding. SF Pro Medium 510, 14/20. Hover, press and keyboard focus use the original semantic tokens. Loading keeps its accessible label and prevents duplicate activation; disabled actions do nothing. The explicit state controls are visual specimens; normal usage lets pointer/keyboard state drive the appearance. Use a fixed action width in asynchronous forms so loading never shifts adjacent controls. Touch layouts need a 44px hit target.",
			},
		},
	},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SmallDefault: Story = {
	args: { size: "Small", state: "default" },
	parameters: { figmaVariantId: "32:31" },
};
export const SmallHover: Story = {
	args: { size: "Small", state: "hover" },
	parameters: { figmaVariantId: "32:32" },
};
export const SmallPressed: Story = {
	args: { size: "Small", state: "pressed" },
	parameters: { figmaVariantId: "32:33" },
};
export const SmallFocus: Story = {
	args: { size: "Small", state: "focus" },
	parameters: { figmaVariantId: "32:34" },
};
export const SmallDisabled: Story = {
	args: { size: "Small", state: "disabled" },
	parameters: { figmaVariantId: "32:35" },
};
export const SmallLoading: Story = {
	args: { size: "Small", state: "loading" },
	parameters: { figmaVariantId: "32:36" },
};
export const MediumDefault: Story = {
	args: { size: "Medium", state: "default" },
	parameters: { figmaVariantId: "32:37" },
};
export const MediumHover: Story = {
	args: { size: "Medium", state: "hover" },
	parameters: { figmaVariantId: "32:38" },
};
export const MediumPressed: Story = {
	args: { size: "Medium", state: "pressed" },
	parameters: { figmaVariantId: "32:39" },
};
export const MediumFocus: Story = {
	args: { size: "Medium", state: "focus" },
	parameters: { figmaVariantId: "32:40" },
};
export const MediumDisabled: Story = {
	args: { size: "Medium", state: "disabled" },
	parameters: { figmaVariantId: "32:41" },
};
export const MediumLoading: Story = {
	args: { size: "Medium", state: "loading" },
	parameters: { figmaVariantId: "32:42" },
};
export const ActivationGuide: Story = {
	args: { onClick: fn() },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole("button"));
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
	parameters: {
		docs: {
			description: {
				story:
					"Tab focuses the action; Enter and Space activate it. Hover and press have distinct appearances. Use the Loading specimen while a real request is pending, and resolve success/error from the request rather than an animation timer.",
			},
		},
	},
};

function PendingActionExample({
	onSubmit,
}: {
	onSubmit: NonNullable<ButtonProps["onClick"]>;
}) {
	const [pending, setPending] = useState(false);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				gap: 12,
				width: 336,
			}}
		>
			<Button
				size="Medium"
				reserveLoadingSpace
				loading={pending}
				onClick={(event) => {
					if (pending) return;
					setPending(true);
					onSubmit(event);
				}}
			>
				Continue
			</Button>
			<Button
				variant="secondary"
				onClick={() => setPending(false)}
				disabled={!pending}
			>
				Resolve example request
			</Button>
		</div>
	);
}
export const PendingRequestGuide: Story = {
	args: { onClick: fn() },
	render: (args) => (
		<PendingActionExample onSubmit={(event) => args.onClick?.(event)} />
	),
	parameters: {
		docs: {
			description: {
				story:
					"reserveLoadingSpace reserves the exact loading icon and gap before a request begins, keeping an intrinsic-width action stable. Full-width form actions can also use the designed 336px width. The pending action is disabled so duplicate clicks cannot resubmit. Resolve example request deliberately represents a response from the consuming application; no prototype timer or backend service is implied.",
			},
		},
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const submit = canvas.getByRole("button", { name: "Continue" });
		const before = submit.getBoundingClientRect().width;
		await userEvent.click(submit);
		await expect(submit).toBeDisabled();
		await expect(submit).toHaveAttribute("aria-busy", "true");
		await userEvent.click(submit);
		await expect(args.onClick).toHaveBeenCalledOnce();
		await expect(submit.getBoundingClientRect().width).toBe(before);
		await userEvent.click(
			canvas.getByRole("button", { name: "Resolve example request" }),
		);
		await expect(submit).toBeEnabled();
	},
};
