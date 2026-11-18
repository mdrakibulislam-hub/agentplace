import type { Session } from "@agentplace/auth";
import type { Database } from "@agentplace/db";

export type Context = {
	session: Session | null;
	db: Database;
};
