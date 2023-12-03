"use server";

import { Resend } from "resend";
import { env } from "~/env.mjs";
import SampleEmail from "~/emails/SampleEmail";

export async function sendSampleEmailAction(userName: string, emailTo: string) {
	const resend = new Resend(env.RESEND_API_KEY);
	await resend.emails.send({
		from: "no-reply@tasklypm.com",
		to: emailTo,
		subject: `Thans for using Taskly`,
		react: <SampleEmail name={userName} />,
	});
}
