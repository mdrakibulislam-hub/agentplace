import { cn } from "@agentplace/ui/lib/utils";

export interface AgentCardProps {
	name: string;
	category: string;
	description: string;
	className?: string;
}

export function AgentCard({
	name,
	category,
	description,
	className,
}: AgentCardProps) {
	return (
		<article
			className={cn(
				"bg-card text-card-foreground rounded-lg border p-6",
				className,
			)}
		>
			<p className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
				{category}
			</p>
			<h3 className="mb-2 text-lg font-semibold">{name}</h3>
			<p className="text-muted-foreground text-sm leading-relaxed">
				{description}
			</p>
		</article>
	);
}
