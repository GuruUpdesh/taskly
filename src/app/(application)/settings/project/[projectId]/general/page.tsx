import { eq } from "drizzle-orm";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { projects } from "~/server/db/schema";

type Params = {
    params: {
        projectId: string;
    };
};

export default async function projectSettingsGeneral(
    { params: { projectId } }: Params,
) {

    const getProjects = await db
        .select()
        .from(projects)
        .where(
            eq(projects.id, Number(projectId))
        );

    const currentProject = getProjects[0];


	return (
		<div className="container flex flex-col pt-4">
			<h1>General</h1>
			<div className="container flex flex-col pt-4 border-t border-red-500">
				<Button className="bg-red-500 text-background"> Delete {currentProject ? currentProject.name : 'error'} </Button>
			</div>
		</div>
	);
}

