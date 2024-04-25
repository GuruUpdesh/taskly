import * as React from "react";

import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface SampleEmailProps {
	projectName: string;
	token: string;
	inviteUserName: string;
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";

export const ProjectInviteEmail = ({
	projectName,
	token,
	inviteUserName,
}: SampleEmailProps) => (
	<Html>
		<Head />
		<Preview>Invitation to join project {projectName} on Taskly</Preview>
		<Tailwind>
			<Body className="mx-auto my-auto bg-white font-sans">
				<Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
					<Section className="mt-[32px]">
						<Img
							src={`${baseUrl}/static/taskly-dark.png`}
							width="100"
							height="38"
							alt="Taskly"
							className="mx-auto my-0"
						/>
					</Section>
					<Text className="text-[14px] leading-[24px] text-black">
						Hello,
					</Text>
					<Text className="text-[14px] leading-[24px] text-black">
						Your have been invited by {inviteUserName} to{" "}
						{projectName} on Taskly. To accept the invitation, click
						the button below.
					</Text>
					<Section className="mb-[32px] mt-[32px] text-center">
						<Button
							className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
							href={`${baseUrl}/join/${token}`}
						>
							Accept Invitation
						</Button>
					</Section>

					<Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
					<Text className="text-[12px] leading-[24px] text-[#666666]">
						<Link
							href={"https://www.tasklypm.com/"}
							className="text-blue-600 no-underline"
						>
							TasklyPM.com
						</Link>
						, simplified project management.
					</Text>
				</Container>
			</Body>
		</Tailwind>
	</Html>
);

export default ProjectInviteEmail;
