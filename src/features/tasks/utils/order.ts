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

	sqlChunks.push(sql`cast((case`);

	for (const update of updatesData) {
		sqlChunks.push(
			sql`when ${tasks.id} = ${update.id} then ${update.backlogOrder}`,
		);
		ids.push(update.id);
	}

	sqlChunks.push(sql`end) as integer)`);
	const finalSql: SQL = sql.join(sqlChunks, sql.raw(" "));

	const query = db
		.update(tasks)
		.set({ backlogOrder: finalSql })
		.where(inArray(tasks.id, ids));

	await query.execute();
}
