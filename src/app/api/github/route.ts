import { z } from "zod";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as unknown;

		const schema = z.object({
			action: z.string(),
			installation: z.object({
				id: z.number(),
			}),
			pull_request: z.object({
				state: z.string(),
				title: z.string(),
			}),
		});
		const result = schema.parse(body);
		console.log("Github Webhook", result);

		return Response.json({ message: "Received" });
	} catch (e) {
		console.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}
