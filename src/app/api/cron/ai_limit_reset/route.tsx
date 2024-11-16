import { kv } from "@vercel/kv";
import { type NextRequest } from "next/server";

import { db } from "~/db";
import { env } from "~/env.mjs";
import { users } from "~/schema";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	const allUsers = await db.select().from(users);

	const promises = [];
	for (const user of allUsers) {
		promises.push(kv.set(user.userId + "aiDailyLimit", { count: 0 }));
	}

	await Promise.all(promises);

	return new Response("Success", {
		status: 200,
	});
}
