"use server";

import crypto from "crypto";

import { SignJWT } from "jose";
import { z } from "zod";

import { env } from "~/env.mjs";

export async function getAccessToken(installationId: number) {
	const privateKey = Buffer.from(
		env.GH_APP_PRIVATE_KEY_BASE_64,
		"base64",
	).toString("utf8");

	const appId = 853399;
	const secret = crypto.createPrivateKey(privateKey);

	const jwtToken = await new SignJWT()
		.setProtectedHeader({ alg: "RS256" })
		.setIssuer(appId.toString())
		.setIssuedAt()
		.setExpirationTime("10m")
		.sign(secret);

	const url = `https://api.github.com/app/installations/${installationId}/access_tokens`;
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${jwtToken}`,
			Accept: "application/vnd.github.v3+json",
		},
	});

	const data = (await response.json()) as unknown;

	if (!response.ok) {
		throw new Error(`GitHub API responded with status ${response.status}`);
	}

	const resultSchema = z.object({
		token: z.string(),
	});
	const result = resultSchema.parse(data);
	console.log("GitHub Integration: successful got access token");
	return result.token;
}
