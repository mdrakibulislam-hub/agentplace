import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
	component: () => <Navigate to="/" replace />,
});
