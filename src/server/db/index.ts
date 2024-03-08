import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from "./schema";

import { env } from "~/env.mjs";


const connectionString = env.DATABASE_URL
const client = postgres(connectionString, { prepare: false, max: 1 })
const db = drizzle(client, { schema });

export { db };
