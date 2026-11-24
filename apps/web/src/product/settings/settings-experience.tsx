import { FormField } from "@agentplace/ui/components/ap-controls";
import { type CreditValues, Surface } from "@agentplace/ui/components/ap-data";
import type { MenuProject } from "@agentplace/ui/components/ap-menus";
import {
	SettingsNavigation,
	type SettingsNavValue,
} from "@agentplace/ui/components/ap-navigation";
import { Button } from "@agentplace/ui/components/button";
import { type FormEvent, useRef, useState } from "react";
import { BillingSettings } from "./billing-settings";
import { PluginSettings } from "./plugin-settings";
import {
	SettingsFeedback,
	SettingsHeading,
	settingsError,
} from "./settings-parts";
import { useSettingsState } from "./settings-state";
import { SkillsSettings } from "./skills-settings";
import { StaffSettings } from "./staff-settings";
import "./settings.css";

export { SettingsStateProvider } from "./settings-state";

interface SettingsExperienceProps {
	onBack: () => void;
	projects: readonly MenuProject[];
	credits: CreditValues;
	projectUsage?: Readonly<Record<string, number>>;
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
	const [draft, setDraft] = useState<string>();
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [saveError, setSaveError] = useState("");
	const nameInput = useRef<HTMLInputElement>(null);
	const name = draft ?? workspace;
	const dirty = name !== workspace;
	function save(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!dirty) return;
		if (!name.trim()) {
			setError("Enter a workspace name.");
			nameInput.current?.focus();
			return;
		}
		try {
			if (name.trim() !== workspace) onSave(name.trim());
			setDraft(undefined);
			setSaveError("");
			setMessage("Workspace details saved.");
			nameInput.current?.focus({ preventScroll: true });
		} catch (cause) {
			setSaveError(settingsError(cause));
		}
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
						ref={nameInput}
						label="Workspace name"
						value={name}
						onChange={(event) => {
							setDraft(event.currentTarget.value);
							setMessage("");
							setError("");
							setSaveError("");
						}}
						required
						state={error ? "error" : "filled"}
						showSupportingText={Boolean(error)}
						errorMessage={error}
					/>
					<div className="product-settings-actions">
						<Button size="medium" type="submit" disabled={!dirty}>
							Save workspace
						</Button>
						{dirty && (
							<Button
								variant="secondary"
								size="medium"
								onClick={() => {
									setDraft(undefined);
									setMessage("");
									setError("");
									setSaveError("");
									nameInput.current?.focus({ preventScroll: true });
								}}
							>
								Reset changes
							</Button>
						)}
					</div>
					<SettingsFeedback
						notice={message}
						error={saveError}
						dirty={dirty && !saveError}
					/>
				</form>
			</Surface>
		</>
	);
}

export function SettingsExperience({
	onBack,
	projects,
	credits,
	projectUsage,
	initialSection = "Billing & usage",
	onSectionChange,
}: SettingsExperienceProps) {
	const [settings, , saveMembers, saveSettings] = useSettingsState();
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
					if (section === active) return;
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
					data-ap-enter=""
					aria-label="General"
					hidden={active !== "General"}
				>
					<GeneralSettings
						workspace={settings.name}
						onSave={(name) =>
							saveSettings((previous) => ({ ...previous, name }))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					data-ap-enter=""
					aria-label="Billing and usage"
					hidden={active !== "Billing & usage"}
				>
					<BillingSettings
						workspace={settings.name}
						projects={projects}
						credits={credits}
						projectUsage={projectUsage}
						active={active === "Billing & usage"}
					/>
				</section>
				<section
					className="product-settings-section"
					data-ap-enter=""
					aria-label="Skills library"
					hidden={active !== "Skills library"}
				>
					<SkillsSettings
						skills={settings.skills}
						connections={settings.connections}
						projects={projects}
						active={active === "Skills library"}
						onSkillsChange={(update) =>
							saveSettings((previous) => ({
								...previous,
								skills: update(previous.skills),
							}))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					data-ap-enter=""
					aria-label="Plugins"
					hidden={active !== "Plugins"}
				>
					<PluginSettings
						connections={settings.connections}
						projects={projects}
						active={active === "Plugins"}
						onConnectionsChange={(update) =>
							saveSettings((previous) => ({
								...previous,
								connections: update(previous.connections),
							}))
						}
					/>
				</section>
				<section
					className="product-settings-section"
					data-ap-enter=""
					aria-label="Staff and roles"
					hidden={active !== "Staff & roles"}
				>
					<StaffSettings
						members={settings.members}
						projects={projects}
						onMembersChange={saveMembers}
						active={active === "Staff & roles"}
					/>
				</section>
			</main>
		</div>
	);
}
