import type { NextRequest } from 'next/server';
import { env } from '~/env.mjs';
import { Resend } from "resend";
import SampleEmail from "~/emails/SampleEmail";
 
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
      from: "no-reply@tasklypm.com",
      to: "guruupdeshsingh@gmail.com",
      subject: `Taskly - Cron Job`,
      react: <SampleEmail name={"Cron"} />,
  });
  
  return Response.json({ success: true });
}