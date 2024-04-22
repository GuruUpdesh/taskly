import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { env } from "~/env.mjs";

import * as schema from "./schema";

const connectionString = env.DATABASE_URL;
const client = new Pool({ connectionString: connectionString });
const db = drizzle(client, { schema });

export { db };
