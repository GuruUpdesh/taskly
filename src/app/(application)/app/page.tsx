import { redirect } from "next/navigation";

import { getUserApplicationData } from "~/actions/application/redis-actions";

export default async function RedirectToApp() {
	const userApplicationData = await getUserApplicationData();

	if (!userApplicationData) {
		return;
	}

	redirect(userApplicationData.lastApplicationPath);
}
