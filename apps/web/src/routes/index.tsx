import { createFileRoute, Navigate } from "@tanstack/react-router";
import { usePrototype } from "@/product/prototype-state";

export const Route = createFileRoute("/")({ component: IndexPage });

function IndexPage() {
	const { workspace } = usePrototype();
	return <Navigate to={workspace ? "/projects" : "/login"} replace />;
}
