import { db } from "~/server/db";
import { Textarea } from "../ui/textarea";
import React from 'react';
import { comments } from "~/server/db/schema";
import { commentAction } from "~/actions/application/comment-actions";

type Props = {
    comments: any;
};

const Comments = ( {comments}: Props ) => {

    console.log(comments[0].comment);

    return (
        <Textarea
            placeholder="Add a comment..."
        >
        </Textarea>
    );
};

export default Comments;
