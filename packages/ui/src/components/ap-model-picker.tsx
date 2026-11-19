import { useState } from "react";
import { Icon } from "./ap-icon";
import { MenuPanel, MenuPopover, RichMenuItem } from "./ap-menus";
import { Button } from "./button";
import "../styles/ap-model-picker.css";

const modelModes = [
	{
		label: "Automatic",
		description: "Choose a mode automatically",
		icon: "lightbulb",
	},
	{ label: "Fast", description: "Prioritize speed", icon: "zap" },
	{ label: "Detailed", description: "Prioritize depth", icon: "file-text" },
] as const;

export type ModelMode = (typeof modelModes)[number]["label"];
export const defaultModelMode: ModelMode = "Automatic";

export function ModelPickerPanel({
	value,
	onSelect,
	onClose,
}: {
	value: ModelMode;
	onSelect?: (value: ModelMode) => void;
	onClose?: () => void;
}) {
	return (
		<MenuPanel title="Model" className="ap-model-picker" onClose={onClose}>
			<div className="ap-menu-list" role="menu" aria-label="Model options">
				{modelModes.map(({ label, description, icon }) => {
					const selected = label === value;
					return (
						<RichMenuItem
							key={label}
							label={label}
							description={description}
							icon={icon}
							state={selected ? "selected" : "default"}
							data-menu-choice
							data-menu-autofocus={selected || undefined}
							role="menuitemradio"
							aria-checked={selected}
							aria-label={label}
							aria-description={description}
							onClick={() => onSelect?.(label)}
						/>
					);
				})}
			</div>
		</MenuPanel>
	);
}

export function ModelPicker({
	value: controlledValue,
	defaultValue = defaultModelMode,
	onValueChange,
	side = "top",
	disabled,
}: {
	value?: ModelMode;
	defaultValue?: ModelMode;
	onValueChange?: (value: ModelMode) => void;
	side?: "top" | "bottom";
	disabled?: boolean;
}) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const value = controlledValue ?? internalValue;
	return (
		<MenuPopover
			side={side}
			trigger={
				<Button
					type="button"
					variant="ghost"
					className="ap-model-picker-trigger"
					aria-label={`Model: ${value}`}
					icon={<Icon name="chevron-down" />}
					disabled={disabled}
				>
					{value}
				</Button>
			}
		>
			{(close) => (
				<ModelPickerPanel
					value={value}
					onClose={close}
					onSelect={(next) => {
						if (controlledValue === undefined) setInternalValue(next);
						onValueChange?.(next);
						close();
					}}
				/>
			)}
		</MenuPopover>
	);
}
