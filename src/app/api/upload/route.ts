import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse<unknown>> {
	const { searchParams } = new URL(request.url);
	const filename = searchParams.get("filename");
	if (!filename) {
		return new NextResponse("filename is required", { status: 400 });
	}
	if (!request.body) {
		return new NextResponse("body is required", { status: 400 });
	}

	const blob = await put(filename, request.body, {
		access: "public",
	});

	return NextResponse.json(blob);
}
