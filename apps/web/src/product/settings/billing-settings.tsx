import {
	Badge,
	CreditBalance,
	type CreditValues,
	creditRatio,
	Surface,
} from "@agentplace/ui/components/ap-data";
import { Icon } from "@agentplace/ui/components/ap-icon";
import {
	MenuItem,
	MenuPanel,
	MenuPopover,
	type MenuProject,
} from "@agentplace/ui/components/ap-menus";
import { useScrollEntrance } from "@agentplace/ui/components/ap-motion";
import { Button } from "@agentplace/ui/components/button";
import { useRef, useState } from "react";
import {
	SettingsDialog,
	SettingsHeading,
	useSettingsDialog,
} from "./settings-parts";

const periods = ["This billing period", "Previous billing period"] as const;
const number = new Intl.NumberFormat("en-US");

export function BillingSettings({
	workspace,
	projects,
	credits,
	projectUsage,
	active,
}: {
	workspace: string;
	projects: readonly MenuProject[];
	credits: CreditValues;
	projectUsage?: Readonly<Record<string, number>>;
	active: boolean;
}) {
	const usage = useRef<HTMLDivElement>(null);
	const dialogTrigger = useRef<HTMLButtonElement>(null);
	useScrollEntrance(usage, active);
	const [period, setPeriod] = useState<(typeof periods)[number]>(periods[0]);
	const [dialog, setDialog] = useSettingsDialog<
		| "Workspace subscription"
		| "Payment method"
		| "Invoices"
		| "Usage details"
		| null
	>(active, null);
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
	function openDialog(
		next: NonNullable<typeof dialog>,
		trigger: HTMLButtonElement,
	) {
		dialogTrigger.current = trigger;
		setDialog(next);
	}
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
							onClick={(event) =>
								openDialog("Workspace subscription", event.currentTarget)
							}
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
							onClick={(event) =>
								openDialog("Usage details", event.currentTarget)
							}
						>
							View usage details
						</Button>
					</div>
				</Surface>
			</div>
			<Surface
				ref={usage}
				className="product-settings-card product-settings-billing-usage"
			>
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
										aria-pressed={period === choice}
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
				<div role="status" className="sr-only" aria-atomic="true">
					Showing usage for {period.toLowerCase()}.
				</div>
				<div key={period} data-ap-enter="message">
					{period === periods[1] && (
						<p className="product-settings-muted">
							Usage data is unavailable for the previous billing period.
						</p>
					)}
					{period === periods[0] &&
						(projects.length ? (
							<ul className="product-settings-usage-list">
								{projects.map((project) => (
									<li key={project.id}>
										<Icon
											className="product-settings-muted"
											name={project.icon ?? "briefcase-business"}
										/>
										<span className="product-settings-medium">
											{project.name}
										</span>
										<span className="product-settings-muted">
											{projectUsage?.[project.id] === undefined
												? "Unavailable"
												: `${number.format(projectUsage[project.id])} credits`}
										</span>
									</li>
								))}
							</ul>
						) : (
							<p className="product-settings-muted">No projects to show.</p>
						))}
				</div>
			</Surface>
			<div className="product-settings-actions">
				<Button
					variant="secondary"
					size="medium"
					icon={<Icon name="credit-card" size={20} />}
					onClick={(event) => openDialog("Payment method", event.currentTarget)}
				>
					Payment method
				</Button>
				<Button
					variant="ghost"
					size="medium"
					icon={<Icon name="file-text" size={20} />}
					onClick={(event) => openDialog("Invoices", event.currentTarget)}
				>
					Invoices
				</Button>
			</div>
			{dialog && (
				<SettingsDialog
					title={dialog}
					onClose={() => setDialog(null)}
					returnFocus={dialogTrigger}
				>
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
