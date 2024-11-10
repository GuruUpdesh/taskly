import { Poppins } from "next/font/google";

import { cn } from "~/lib/utils";

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export default function PrivacyPage() {
	return (
		<div
			className={cn(
				poppins.className,
				"mx-auto max-w-3xl px-4 py-12 text-foreground",
			)}
		>
			<h1 className="mb-8 text-3xl font-bold">Taskly - Privacy Policy</h1>
			<p className="mb-8 text-sm text-muted-foreground">
				Last updated and effective date: November 10, 2024
			</p>

			<div className="prose prose-gray dark:prose-invert max-w-none">
				<p className="mb-8">
					Welcome to Taskly (the &quot;Site&quot;), an open-source
					project management platform (&quot;we&quot;, &quot;us&quot;,
					and/or &quot;our&quot;). Taskly provides a platform for
					simplified project management and team collaboration (the
					&quot;Services&quot;). We value your privacy and are
					dedicated to protecting your personal data. This Privacy
					Policy covers how we collect, handle, and disclose personal
					data on our Platform.
				</p>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						To Whom Does This Policy Apply
					</h2>
					<p>
						This Privacy Policy applies to all users of Taskly. Each
						user is responsible for ensuring the accuracy of the
						information they provide and compliance with all
						applicable laws and regulations.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						Changes To This Privacy Policy
					</h2>
					<p>
						This Privacy Policy may change from time to time, as our
						Platform and our business may change. Your continued use
						of the Platform after any changes to this Privacy Policy
						indicates your agreement with the terms of the revised
						Privacy Policy.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						What Information Do We Collect
					</h2>
					<p className="mb-4">
						We collect information directly from you when you
						provide it to us explicitly on our Site, including:
					</p>
					<ul className="mb-4 list-disc pl-6">
						<li>Account information (name, email)</li>
						<li>Project and task data</li>
						<li>Team information</li>
						<li>User-generated content</li>
					</ul>
					<p>
						We do not use third-party cookies and only using basic
						tracking technologies for the purpose of analytics on
						our Site.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						What We Use Your Information For
					</h2>
					<p className="mb-4">We use your information to:</p>
					<ul className="mb-4 list-disc pl-6">
						<li>Provide our task management Services</li>
						<li>Enable team collaboration features</li>
						<li>Improve our Platform functionality</li>
						<li>Understand how you use our Platform</li>
						<li>Communicate essential updates</li>
					</ul>
					<p>We do not sell any information to any third party.</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						Your Rights and Choices
					</h2>
					<p className="mb-4">You have the right to:</p>
					<ul className="list-disc pl-6">
						<li>Access your personal information</li>
						<li>Correct or update your data</li>
						<li>Delete your account and associated data</li>
						<li>Export your project data</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">Security</h2>
					<p>
						As an open-source platform, we implement appropriate
						technical and organizational measures to protect your
						personal information. However, no method of transmission
						over the Internet or electronic storage is 100% secure,
						so we cannot guarantee absolute security.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						Data Storage
					</h2>
					<p>
						Your data is stored securely and you maintain full
						control over your information. As we are open-source,
						you can verify our data handling practices by reviewing
						our code.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="mb-4 text-2xl font-semibold">
						How To Contact Us
					</h2>
					<p className="mb-4">
						For privacy-related questions or to exercise your
						rights, please:
					</p>
					<ul className="list-disc pl-6">
						<li>Open an issue on our GitHub repository</li>
						<li>Contact us through our support channels</li>
						<li>
							Email us at{" "}
							<a
								href="mailto:guruupdeshsingh@gmail.com"
								className="text-primary hover:underline"
							>
								guruupdeshsingh@gmail.com
							</a>
						</li>
					</ul>
				</section>

				<p className="mt-12 text-sm text-muted-foreground">
					This policy is designed to be transparent about our data
					practices while maintaining the open-source nature of
					Taskly.
				</p>
			</div>
		</div>
	);
}
