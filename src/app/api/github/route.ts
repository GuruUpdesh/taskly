export async function POST(request: Request) {
	try {
        console.log("Received a request", request);

		return Response.json({ message: "Received" });
	} catch (e) {
		console.error(e);
		return new Response("Bad Request", {
			status: 404,
		});
	}
}