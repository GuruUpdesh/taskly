import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";
import { type MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env.mjs";
import * as schema from "./schema";

type devDbConnection = MySql2Database<Record<string, never>>

declare global {
	// eslint-disable-next-line no-var -- only var works here
	var db: devDbConnection;
}

let db;

if (env.NODE_ENV === "development") {
	if (!global.db) {
		const connection = await mysql.createConnection({
			uri: env.DATABASE_URL,
		});

		global.db = drizzle(connection);
	}

	db = global.db;
} else {
	const client = new Client({
		url: env.DATABASE_URL,
	});
	db = drizzlePS(client.connection(), { schema });
}

export { db };
