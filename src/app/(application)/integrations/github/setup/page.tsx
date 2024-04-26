import React, { Suspense } from "react";

import GithubIntegrationSetupPage from "./components/GithubIntegrationSetupPage";

const Page = () => {
	return (
		<Suspense>
			<GithubIntegrationSetupPage />
		</Suspense>
	);
};

export default Page;
