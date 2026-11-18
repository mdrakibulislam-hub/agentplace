import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AuthExperience } from "@/product/auth/auth-experience";
import { usePrototype } from "@/product/prototype-state";

export const Route = createFileRoute("/login")({
	validateSearch: (search): { agent?: string } => ({
		agent: typeof search.agent === "string" ? search.agent : undefined,
	}),
	component: LoginPage,
});

function LoginPage() {
	const { signIn } = usePrototype();
	const { agent } = Route.useSearch();
	const navigate = useNavigate();
	return (
		<AuthExperience
			onAuthenticated={(account) => {
				signIn(account);
				if (agent) {
					void navigate({
						to: "/agent/$projectId",
						params: { projectId: agent },
						replace: true,
					});
				} else {
					void navigate({ to: "/projects", replace: true });
				}
			}}
		/>
	);
}
