import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";
import postgres from 'postgres'

import { env } from "~/env.mjs";

import * as schema from "./schema";

const client = postgres(env.DATABASE_URL, { prepare: false })
const db = drizzle(client);

export { db };
