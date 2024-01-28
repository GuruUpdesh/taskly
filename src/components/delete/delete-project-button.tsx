import { handleDeleteProject } from "~/actions/delete-actions";
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

function DeleteProjectButton({ projectName, projectId }: Props) {
	return (
		<div className="container flex flex-col pt-4">
			<h1>General</h1>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant="outline">
						{" "}
						Delete {projectName ? projectName : "error"}{" "}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{" "}
							Delete {projectName ? projectName : "error"}{" "}
						</DialogTitle>
						<DialogDescription>
							Warning, once this action is completed, it cannot be
							undone. Are you sure you want to delete this
							Project: {projectName ? projectName : "error"}.
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
							<form action={handleDeleteProject}>
								<input
									hidden
									name="projectId"
									value={projectId}
								></input>
								<Button type="submit" variant="destructive">
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

export default DeleteProjectButton;
