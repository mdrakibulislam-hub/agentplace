import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const serverEnv = Bun.file(resolve(root, "apps/server/.env"));
const webEnv = Bun.file(resolve(root, "apps/web/.env"));

if (!(await serverEnv.exists())) {
	await Bun.write(
		serverEnv,
		[
			`BETTER_AUTH_SECRET=${randomBytes(48).toString("base64url")}`,
			"BETTER_AUTH_URL=http://localhost:4100",
			"CORS_ORIGIN=http://localhost:4101",
			`DATABASE_URL=file:${resolve(root, "packages/db/local.db")}`,
			"",
		].join("\n"),
	);
	console.info(
		"Created apps/server/.env with a local auth secret and SQLite path.",
	);
} else {
	console.info("Kept existing apps/server/.env.");
}

if (!(await webEnv.exists())) {
	await Bun.write(webEnv, "VITE_SERVER_URL=http://localhost:4100\n");
	console.info("Created apps/web/.env.");
} else {
	console.info("Kept existing apps/web/.env.");
}
