import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
// import { Client } from "pg";
// import postgres from 'postgres'

import { env } from "~/env.mjs";

import * as schema from "./schema";

const connectionString = env.DATABASE_URL;
// const client = postgres(connectionString, { prepare: false, max: 1 })
const client = new Pool({ connectionString: connectionString });
const db = drizzle(client, { schema });
// const client = new Client({
// 	connectionString: connectionString,
// });

export { db };
