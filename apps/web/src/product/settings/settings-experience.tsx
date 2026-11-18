import { FormField } from "@agentplace/ui/components/ap-controls";
import { type CreditValues, Surface } from "@agentplace/ui/components/ap-data";
import type { MenuProject } from "@agentplace/ui/components/ap-menus";
import {
	SettingsNavigation,
	type SettingsNavValue,
} from "@agentplace/ui/components/ap-navigation";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useState } from "react";
import { BillingSettings } from "./billing-settings";
import { PluginSettings } from "./plugin-settings";
import { SettingsHeading } from "./settings-parts";
import { useSettingsState } from "./settings-state";
import { SkillsSettings } from "./skills-settings";
import { StaffSettings } from "./staff-settings";
import "./settings.css";

export { SettingsStateProvider } from "./settings-state";

interface SettingsExperienceProps {
	onBack: () => void;
	projects: readonly MenuProject[];
	credits: CreditValues;
	initialSection?: SettingsNavValue;
	onSectionChange?: (section: SettingsNavValue) => void;
}

function GeneralSettings({
	workspace,
	onSave,
}: {
	workspace: string;
	onSave: (name: string) => void;
}) {
	const [name, setName] = useState(workspace);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!name.trim()) {
			setError("Enter a workspace name.");
			return;
		}
		onSave(name.trim());
		setName(name.trim());
		setMessage("Workspace details saved.");
	}
	return (
		<>
			<SettingsHeading
				title="General"
				description="Manage the details shared across all projects in your workspace."
			/>
			<Surface className="product-settings-card product-settings-general">
				<form onSubmit={save} noValidate>
					<h2>Workspace details</h2>
					<FormField
						label="Workspace name"
						value={name}
						onChange={(event) => {
							setName(event.currentTarget.value);
							setMessage("");
							setError("");
						}}
						required
						state={error ? "error" : "filled"}
						showSupportingText={Boolean(error)}
						errorMessage={error}
					/>
					<div className="product-settings-actions">
						<Button size="medium" type="submit">
							Save workspace
						</Button>
						{message && (
							<p className="product-settings-muted" role="status">
								{message}
							</p>
						)}
					</div>
				</form>
			</Surface>
		</>
	);
}

export function SettingsExperience({
	onBack,
	projects,
	credits,
	initialSection = "Billing & usage",
	onSectionChange,
}: SettingsExperienceProps) {
	const [settings, setSettings] = useSettingsState();
	const [active, setActive] = useState(initialSection);
	const [previousEntry, setPreviousEntry] = useState(initialSection);
	if (initialSection !== previousEntry) {
		setPreviousEntry(initialSection);
		setActive(initialSection);
	}
	return (
		<div className="product-settings">
			<SettingsNavigation
				active={active}
				onHome={onBack}
				onChange={(section) => {
					setActive(section);
					onSectionChange?.(section);
				}}
				workspace={settings.name}
			/>
			<main
				className="product-settings-content"
				aria-label="Workspace settings content"
			>
				<section
					className="product-settings-section"
					aria-label="General"
					hidden={active !== "General"}
				>
					<GeneralSettings
						workspace={settings.name}
						onSave={(name) =>
							setSettings((previous) => ({ ...previous, name }))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					aria-label="Billing and usage"
					hidden={active !== "Billing & usage"}
				>
					<BillingSettings
						workspace={settings.name}
						projects={projects}
						credits={credits}
					/>
				</section>
				<section
					className="product-settings-section"
					aria-label="Skills library"
					hidden={active !== "Skills library"}
				>
					<SkillsSettings
						skills={settings.skills}
						connections={settings.connections}
						projects={projects}
						onSkillsChange={(skills) =>
							setSettings((previous) => ({ ...previous, skills }))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					aria-label="Plugins"
					hidden={active !== "Plugins"}
				>
					<PluginSettings
						connections={settings.connections}
						projects={projects}
						onConnectionsChange={(connections) =>
							setSettings((previous) => ({ ...previous, connections }))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					aria-label="Staff and roles"
					hidden={active !== "Staff & roles"}
				>
					<StaffSettings
						members={settings.members}
						projects={projects}
						onMembersChange={(members) =>
							setSettings((previous) => ({ ...previous, members }))
						}
					/>
				</section>
			</main>
		</div>
	);
}
