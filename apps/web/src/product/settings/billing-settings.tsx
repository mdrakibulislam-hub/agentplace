import {
	Badge,
	CreditBalance,
	type CreditValues,
	creditRatio,
	Surface,
} from "@agentplace/ui/components/ap-data";
import { Icon, type IconName } from "@agentplace/ui/components/ap-icon";
import {
	MenuItem,
	MenuPanel,
	MenuPopover,
	type MenuProject,
} from "@agentplace/ui/components/ap-menus";
import { Button } from "@agentplace/ui/components/button";
import { useState } from "react";
import { SettingsDialog, SettingsHeading } from "./settings-parts";

const periods = ["This billing period", "Previous billing period"] as const;
const projectIcons: Record<string, IconName> = {
	"whiteframe-advisor": "briefcase-business",
	"customer-support": "message-square",
	"booking-assistant": "calendar",
};
const number = new Intl.NumberFormat("en-US");

export function BillingSettings({
	workspace,
	projects,
	credits,
}: {
	workspace: string;
	projects: readonly MenuProject[];
	credits: CreditValues;
}) {
	const [period, setPeriod] = useState<(typeof periods)[number]>(periods[0]);
	const [dialog, setDialog] = useState<
		| "Workspace subscription"
		| "Payment method"
		| "Invoices"
		| "Usage details"
		| null
	>(null);
	const ratio = creditRatio(credits);
	const remaining =
		ratio === null || credits.allocation === null
			? null
			: Math.round(credits.allocation * ratio);
	const used =
		remaining === null || credits.allocation === null
			? null
			: credits.allocation - remaining;
	const note =
		remaining === null || used === null || credits.allocation === null
			? "Credit balance unavailable"
			: `${number.format(remaining)} of ${number.format(credits.allocation)} credits · ${number.format(used)} used this period`;
	return (
		<>
			<SettingsHeading
				title="Billing & usage"
				description={`Plan, credits and payment details for the ${workspace} workspace.`}
			/>
			<div className="product-settings-billing-grid">
				<Surface className="product-settings-card product-settings-billing-summary">
					<div className="product-settings-panel-title">
						<p className="product-settings-muted product-settings-medium">
							Current plan
						</p>
						<Badge>Owner access</Badge>
					</div>
					<h2 className="product-settings-small-title">
						Workspace subscription
					</h2>
					<p className="product-settings-muted">
						Manage your plan and renewal preferences.
					</p>
					<div className="product-settings-panel-actions">
						<Button
							variant="secondary"
							onClick={() => setDialog("Workspace subscription")}
						>
							Manage subscription
						</Button>
					</div>
				</Surface>
				<Surface className="product-settings-card product-settings-billing-summary">
					<p className="product-settings-muted product-settings-medium">
						Credits remaining
					</p>
					<h2>
						{remaining === null ? "Unavailable" : number.format(remaining)}
					</h2>
					<CreditBalance {...credits} />
					<p className="product-settings-muted product-settings-caption">
						{note}
					</p>
					<div className="product-settings-panel-actions">
						<Button
							variant="ghost"
							icon={<Icon name="arrow-right" />}
							onClick={() => setDialog("Usage details")}
						>
							View usage details
						</Button>
					</div>
				</Surface>
			</div>
			<Surface className="product-settings-card product-settings-billing-usage">
				<div className="product-settings-panel-title">
					<h2>Usage by project</h2>
					<MenuPopover
						align="end"
						trigger={
							<Button variant="ghost" icon={<Icon name="chevron-down" />}>
								{period}
							</Button>
						}
					>
						{(close) => (
							<MenuPanel title="Billing period" onClose={close}>
								{periods.map((choice) => (
									<MenuItem
										key={choice}
										label={choice}
										icon={period === choice ? "check" : null}
										state={period === choice ? "selected" : "default"}
										data-menu-choice
										onClick={() => {
											setPeriod(choice);
											close();
										}}
									/>
								))}
							</MenuPanel>
						)}
					</MenuPopover>
				</div>
				{period === periods[1] && (
					<p className="product-settings-muted">
						No usage recorded for the previous period.
					</p>
				)}
				{period === periods[0] &&
					(projects.length ? (
						<ul className="product-settings-usage-list">
							{projects.map((project) => (
								<li key={project.id}>
									<Icon
										className="product-settings-muted"
										name={projectIcons[project.id] ?? "briefcase-business"}
									/>
									<span className="product-settings-medium">
										{project.name}
									</span>
									<span className="product-settings-muted">
										{used === null
											? "Unavailable"
											: `${number.format(project.id === "whiteframe-advisor" ? used : 0)} credits`}
									</span>
								</li>
							))}
						</ul>
					) : (
						<p className="product-settings-muted">No projects to show.</p>
					))}
			</Surface>
			<div className="product-settings-actions">
				<Button
					variant="secondary"
					size="medium"
					icon={<Icon name="credit-card" size={20} />}
					onClick={() => setDialog("Payment method")}
				>
					Payment method
				</Button>
				<Button
					variant="ghost"
					size="medium"
					icon={<Icon name="file-text" size={20} />}
					onClick={() => setDialog("Invoices")}
				>
					Download invoices
				</Button>
			</div>
			{dialog && (
				<SettingsDialog title={dialog} onClose={() => setDialog(null)}>
					<p className="product-settings-muted">
						{dialog === "Workspace subscription"
							? "Your workspace is on the workspace subscription. Plan and renewal changes are unavailable in the prototype."
							: dialog === "Payment method"
								? "There is no payment method on file for this prototype."
								: dialog === "Invoices"
									? "There are no invoices to download."
									: note}
					</p>
					<div className="product-settings-dialog-actions">
						<Button variant="secondary" onClick={() => setDialog(null)}>
							Done
						</Button>
					</div>
				</SettingsDialog>
			)}
		</>
	);
}
