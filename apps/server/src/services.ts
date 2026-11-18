import { createAuth } from "@agentplace/auth";
import { createDb } from "@agentplace/db";

import { ENV } from "./env.server";

export const db = createDb(ENV);
export const auth = createAuth(ENV, db);
