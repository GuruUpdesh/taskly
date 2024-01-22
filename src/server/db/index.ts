import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env.mjs";
import * as schema from "./schema";

async function createDbConnection() {
	if (env.NODE_ENV === "development") {
		const connection = await mysql.createConnection({
			uri: env.DATABASE_URL,
		});
		return drizzle(connection, { schema, mode: "planetscale" });
	} else {
		const client = new Client({
			url: env.DATABASE_URL,
		});
		return drizzlePS(client.connection(), { schema });
	}
}

const db = await createDbConnection();

export { db };
