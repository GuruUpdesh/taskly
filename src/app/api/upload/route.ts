import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request): Promise<NextResponse<unknown>> {
	const { searchParams } = new URL(request.url);
	const filename = searchParams.get("filename");
	if (!filename) {
		return new NextResponse("filename is required", { status: 400 });
	}
	if (!request.body) {
		return new NextResponse("body is required", { status: 400 });
	}

	const imageBuffer = await request.arrayBuffer();
	const buffer = Buffer.from(imageBuffer);

	// Resize the image to make it square without stretching, then convert to WebP
	const resizedImage = await sharp(buffer)
		.resize(500, 500, {
			fit: "cover",
		})
		.webp()
		.toBuffer();

	const webpFilename = `${filename.split(".").slice(0, -1).join(".")}.webp`;
	const blob = await put(webpFilename, resizedImage, {
		access: "public",
		contentType: "image/webp",
	});

	return NextResponse.json(blob);
}
