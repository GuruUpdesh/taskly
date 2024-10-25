import { cookies } from "next/headers";

import LoadingPage from "../../../../../../features/tasks/components/page/LoadingPage";

export default function Loading() {
	const layout = cookies().get("react-resizable-panels:task-layout");
	let defaultLayout;
	if (layout) {
		defaultLayout = JSON.parse(layout.value) as number[] | undefined;
	}

	return <LoadingPage defaultLayout={defaultLayout} />;
}
