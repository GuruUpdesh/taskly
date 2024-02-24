import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({ image: { maxFileSize: "4MB" } })
		.middleware(async () => {
			const user = await currentUser();
			if (!user) throw new Error("Unauthorized");

			return { userId: user.id };
		})
		.onUploadComplete(({ metadata, file }) => {
			console.log("Upload complete for user", metadata.userId);
			console.log("File URL", file.url);

			return { success: true, url: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
