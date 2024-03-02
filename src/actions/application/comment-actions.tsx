import { db } from "~/server/db";
import { comments } from "~/server/db/schema";

export async function commentAction(comment: {
    comment: string;
    taskId: number;
    propertyKey: string;
    propertyValue: string;
    insertedDate: Date;
}) {

    console.log(comment);
    await db.insert(comments).values(
        comment
    );


}