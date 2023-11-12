import { db } from "~/server/db";
import { task, type NewTask, insertTaskSchema } from "~/server/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body: unknown = await request.json();
		const parseTask = insertTaskSchema.safeParse(body);

		if (!parseTask.success) {
			return NextResponse.json(
				{ error: parseTask.error, sucess: false },
				{
					status: 422,
				},
			);
		}

		const newTask: NewTask = {
			title: parseTask.data.title,
			description: parseTask.data.description,
			status: parseTask.data.status,
			priority: parseTask.data.priority,
			type: parseTask.data.type,
		};
		await db.insert(task).values(newTask);

		return NextResponse.json({ success: true }, { status: 201 });
	} catch (error) {
		// todo in production return generic error
		return NextResponse.json(
			{ error: error, sucess: false },
			{ status: 500 },
		);
	}
}
