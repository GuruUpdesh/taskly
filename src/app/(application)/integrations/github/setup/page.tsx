import React, { Suspense } from "react";

import GithubIntegrationSetupPage from "~/features/github-integration/components/GithubIntegrationSetupPage";

const Page = () => {
	return (
		<Suspense>
			<GithubIntegrationSetupPage />
		</Suspense>
	);
};

export default Page;
