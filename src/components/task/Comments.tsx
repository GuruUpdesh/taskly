import { Textarea } from "../ui/textarea";
import React from 'react';

const Comments = () => {

    const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            console.log("Enter key pressed");
            const comment = (e.target as HTMLTextAreaElement).value;
            console.log('comment:  ', comment);
        }
    };

    return (
        <Textarea
            placeholder="Add a comment..."
            onKeyDown={handleEnterKey}
        >
        </Textarea>
    );
};

export default Comments;
