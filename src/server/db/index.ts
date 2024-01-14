import { Client } from "@planetscale/database";
import { drizzle as drizzlePS } from "drizzle-orm/planetscale-serverless";
import { type MySql2Database, drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "~/env.mjs";
import * as schema from "./schema";

type devDbConnection = MySql2Database<Record<string, never>>

// Fix for to many client connections (dev only)
declare global {
	// eslint-disable-next-line no-var -- only var works here
	var db: devDbConnection | undefined;
}

let db;

if (env.NODE_ENV === "development") {
	console.log("Connecting to local database...");
	if (!global.db) {
		console.log("Creating new database connection");
		const connection = await mysql.createConnection({
			uri: env.DATABASE_URL,
		});
		console.log("Connected!");

		global.db = drizzle(connection);
	} else {
		console.log("Using existing database connection");
	}

	db = global.db;
} else {
	const client = new Client({
		url: env.DATABASE_URL,
	});
	db = drizzlePS(client.connection(), { schema });
}

export { db };
