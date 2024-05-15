/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { type NextRequest, NextResponse } from "next/server";

import { env } from "./env.mjs";

const ratelimit = new Ratelimit({
	redis: kv,
	// 10 requests from the same IP in 10 seconds
	limiter: Ratelimit.slidingWindow(10, "10 s"),
});

async function ratelimitMiddleware(req: NextRequest) {
	if (env.NEXT_PUBLIC_NODE_ENV === "development") {
		return NextResponse.next();
	}

	const ip = req.ip ?? "127.0.0.1";
	const { success, limit, reset, remaining } = await ratelimit.limit(ip);
	console.log("ratelimit:", { success, limit, reset, remaining });
	return success
		? NextResponse.next()
		: NextResponse.redirect(new URL("/blocked", req.url));
}

const isProtectedRoute = createRouteMatcher([
	"/app",
	"/create-project",
	"/project/(.*)",
	"/settings/(.*)",
	"/join/(.*)",
]);

export default clerkMiddleware((auth, req) => {
	if (isProtectedRoute(req)) auth().protect();

	return ratelimitMiddleware(req);
});

export const config = {
	matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
