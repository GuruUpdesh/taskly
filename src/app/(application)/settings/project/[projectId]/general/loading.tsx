import { Skeleton } from "~/components/ui/skeleton";
import { generalSettings } from "~/config/settings-config";

export default function Loading() {
	return (
		<div className="flex flex-col gap-8 p-6">
			{generalSettings.map((setting, index) => (
				<Skeleton key={index} className="h-[300px] rounded-lg" />
			))}
		</div>
	);
}
