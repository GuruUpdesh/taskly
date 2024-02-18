import { authMiddleware } from "@clerk/nextjs";

// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	// "/" will be accessible to all users
	publicRoutes: [
		"/",
		"/api/cron",
		"/api/clerk",
		"/sign-in",
		`/api/project/(.*)`,
		"/api/project",
		`/api/task/(.*)`,
		"/api/task",
		"/api/uploadthing",
	],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
