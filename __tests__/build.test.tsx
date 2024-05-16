import buildUrl from "../src/utils/buildUrl";

test("buildUrl returns the correct url", () => {
	if (process.env.NODE_ENV === "development") {
		expect(buildUrl("/test")).toBe(
			`http://${process.env.NEXT_PUBLIC_VERCEL_URL}/test`,
		);
	} else {
		expect(buildUrl("/test")).toBe(
			`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/test`,
		);
	}
});
