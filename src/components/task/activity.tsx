"use server";

import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

type Props = {
    taskId: number;
};

const Activity = async ( { taskId }: Props ) => {

    const getSystemComments = await db.select().from(comments).where(eq(comments.taskId, taskId));

    return (
        <div>
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
				Activity
			</h3>
        </div>
    );
};

export default Activity;