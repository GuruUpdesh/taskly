import { removeUserFromProject } from "~/actions/settings/settings-actions";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

type Props = {
	projectName: string;
	projectId: string;
};

function LeaveProjectButton({ projectName, projectId }: Props) {
	return (
		<div className="flex flex-col pt-4">
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="default"
						className={
							"flex h-min items-center justify-between space-x-2 whitespace-nowrap rounded-sm border border-red-700 bg-red-900 p-2 px-3 text-sm text-red-300 ring-offset-background placeholder:text-muted-foreground focus:bg-red-700 focus:text-red-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						}
						style={{ width: "fit-content" }}
					>
						Leave Project
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							Leave {projectName ? projectName : "error"}{" "}
						</DialogTitle>
						<DialogDescription>
							Warning, once this action is completed, it cannot be
							undone. Are you sure you want to leave this Project:{" "}
							{projectName ? projectName : "error"}.
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2"></div>
					</div>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								No
							</Button>
						</DialogClose>
						<DialogClose asChild>
							<form action={removeUserFromProject}>
								<input
									hidden
									name="projectId"
									value={projectId}
								></input>
								<Button type="submit" variant="default">
									Yes
								</Button>
							</form>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default LeaveProjectButton;
