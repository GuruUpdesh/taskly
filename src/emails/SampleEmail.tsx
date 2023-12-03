import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Img,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import * as React from "react";

interface SampleEmailProps {
	name?: string;
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

export const SampleEmail = ({ name = "User" }: SampleEmailProps) => (
	<Html>
		<Head />
		<Preview>
			Streamline your projects and collaborate better with Taskly.
		</Preview>
		<Body style={main}>
			<Container style={container}>
				<Img
					src={`${baseUrl}/static/taskly-logo.png`}
					width="170"
					height="50"
					alt="Taskly"
					style={logo}
				/>
				<Text style={paragraph}>Hi {name},</Text>
				<Text style={paragraph}>
					Welcome to Taskly, the project management tool that empowers
					you to streamline projects and collaborate effectively.
				</Text>
				<Section style={btnContainer}>
					<Button style={button} href="https://tasklypm.com">
						Discover Taskly
					</Button>
				</Section>
				<Text style={paragraph}>
					Cheers,
					<br />
					The Taskly Team
				</Text>
				<Hr style={hr} />
				<Text style={footer}>
					123 Project Ave - Project City, PC 12345
				</Text>
			</Container>
		</Body>
	</Html>
);

export default SampleEmail;

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
};

const logo = {
	margin: "0 auto",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const btnContainer = {
	textAlign: "center" as const,
};

const button = {
	backgroundColor: "#5F51E8",
	borderRadius: "3px",
	color: "#fff",
	fontSize: "16px",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "block",
	padding: "12px",
};

const hr = {
	borderColor: "#cccccc",
	margin: "20px 0",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
};
