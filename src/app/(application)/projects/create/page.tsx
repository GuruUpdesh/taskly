import ProjectCreateForm from "~/app/(application)/projects/create-form";

export default function ProjectsCreatePage() {
	return (
		<div className="container flex flex-col gap-4 px-4 py-16 pt-24 ">
			<header className="flex items-center gap-2">
				<h3 className="scroll-m-20 text-2xl font-normal tracking-tight">
					Create Project
				</h3>
			</header>
			<ProjectCreateForm />
		</div>
	);
}
