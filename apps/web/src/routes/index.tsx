import { AgentCard } from "@agentplace/ui/components/agent-card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({ component: HomeComponent });

const capabilities = [
	{
		name: "Answers, on demand",
		category: "Questions",
		description:
			"Help people find the information they need through a conversation.",
	},
	{
		name: "A time that works",
		category: "Appointments",
		description:
			"Guide customers from availability to a confirmed appointment.",
	},
	{
		name: "Support that keeps up",
		category: "Customer service",
		description:
			"Resolve common questions and help customers take the next step.",
	},
	{
		name: "From request to result",
		category: "Online services",
		description:
			"Deliver services online and keep customers informed along the way.",
	},
];

function HomeComponent() {
	const health = useQuery(trpc.healthCheck.queryOptions());
	return (
		<main className="mx-auto w-full max-w-5xl px-6 py-16 md:py-24">
			<p className="text-muted-foreground mb-4 text-sm font-medium tracking-widest uppercase">
				Agentplace
			</p>
			<h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
				AI agents that get things done.
			</h1>
			<p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
				A place for agents that answer questions, book appointments, support
				customers, and deliver services online.
			</p>
			<section className="mt-12" aria-labelledby="capabilities">
				<h2 id="capabilities" className="mb-5 text-xl font-semibold">
					Built for everyday work
				</h2>
				<div className="grid gap-4 sm:grid-cols-2">
					{capabilities.map((capability) => (
						<AgentCard key={capability.category} {...capability} />
					))}
				</div>
			</section>
			<aside
				className="text-muted-foreground mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-6 text-sm"
				aria-label="Development environment"
			>
				<p role="status">
					API:{" "}
					{health.isPending
						? "Connecting…"
						: health.data
							? "Connected"
							: "Unavailable — start the API server"}
				</p>
				<a
					className="underline underline-offset-4"
					href="http://localhost:6006"
				>
					Open component library ↗
				</a>
				<p>Development starter · Agent workflows coming next</p>
			</aside>
		</main>
	);
}
