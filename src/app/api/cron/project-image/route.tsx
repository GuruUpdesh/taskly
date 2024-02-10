import { isNull } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { generateAndUpdateProjectImage } from "~/actions/project-actions";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";

export async function GET(request: NextRequest) {
	console.log("Cron job started > Project Image Generation");
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}

	const projectsWithoutImage = await db
		.select()
		.from(projects)
		.where(isNull(projects.image));
	const images = projectsWithoutImage.map((project) =>
		generateAndUpdateProjectImage(
			project.id,
			project.name,
			project.description,
		),
	);

	Promise.allSettled(images)
		.then((results) => {
			console.log("Project images generated and updated successfully.");
			console.log("Results:", results);
		})
		.catch((error) => {
			console.error("Error generating or updating project image:", error);
		});
}
