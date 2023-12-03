import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env.mjs";

let db;

if (env.NODE_ENV === "development") {
	const connection = await mysql.createConnection({
		uri: env.DATABASE_URL,
	});

	db = drizzle(connection);
} else {
	db = drizzlePS(
		new Client({
			url: env.DATABASE_URL,
		}).connection(),
		{ schema },
	);
}

export { db };
