import { NextRequest } from "next/server";
import { z } from "zod";

const getInviteSchema = z.object({
	userId: z.string(),
	projectId: z.string(),
});

export async function GET(request: NextRequest) {
	const query = request.nextUrl.searchParams;
	const dataObject = {
		userId: query.get("userId"),
		projectId: query.get("projectId"),
	};
	const validData = getInviteSchema.safeParse(dataObject);

	if (!validData.success) {
		return new Response("Bad Request", {
			status: 404,
		});
	}

	return new Response("Success", {
		status: 200,
	});
}
