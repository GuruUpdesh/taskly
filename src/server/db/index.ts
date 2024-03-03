import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";

import { env } from "~/env.mjs";

import * as schema from "./schema";

const client = new Client({
	url: env.DATABASE_URL,
});
const db = drizzlePS(client.connection(), { schema });

export { db };
