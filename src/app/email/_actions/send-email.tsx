"use server";

import { Resend } from "resend";
import { env } from "~/env.mjs";
import {render} from "@react-email/render"
import SampleEmail from "~/emails/SampleEmail";

export async function sendSampleEmailAction(userName: string, emailTo: string) {
	const resend = new Resend(env.RESEND_API_KEY);
	await resend.emails.send({
		from: "no-reply@tasklypm.com",
		to: emailTo,
		subject: `(sample email) Thanks for using Taskly`,
		html: render(<SampleEmail name={userName} />),
	});
}
