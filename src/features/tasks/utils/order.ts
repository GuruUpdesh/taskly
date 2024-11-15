"use server";

import { inArray, sql, type SQL } from "drizzle-orm";

import { db } from "~/db";
import { tasks } from "~/schema";

export async function updateOrder(taskOrder: Map<number, number>) {
	const updatesData = Array.from(taskOrder.entries()).map(
		([id, backlogOrder]) => ({
			id,
			backlogOrder,
		}),
	);

	if (updatesData.length === 0) {
		return;
	}

	const sqlChunks: SQL[] = [];
	const ids: number[] = [];

	sqlChunks.push(sql`(case`);

	for (const update of updatesData) {
		sqlChunks.push(
			sql`when ${tasks.id} = ${update.id} then CAST(${update.backlogOrder} AS INTEGER)`,
		);
		ids.push(update.id);
	}

	sqlChunks.push(sql`end)`);
	const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

	await db
		.update(tasks)
		.set({ backlogOrder: finalSql })
		.where(inArray(tasks.id, ids));
}
