"use client";

import { db } from "~/server/db";
import { Textarea } from "../ui/textarea";
import React, { useMemo } from 'react';
import { Comment as CommentType, User, comments, users } from "~/server/db/schema";
import { commentAction } from "~/actions/application/comment-actions";
import { eq } from "drizzle-orm";
import { getUser } from "~/actions/user-actions";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";
import typography from "~/styles/typography";
import { Dot } from "lucide-react";
import { TaskProperty as TaskPropertyType, getEnumOptionByKey, getPropertyConfig } from "~/config/TaskConfigType";
import { useAppStore } from "~/store/app";
import { useShallow } from "zustand/react/shallow";
import TaskProperty from "./TaskProperty";
export interface CommentWithUser extends CommentType {
    user: User;
}

type Props = {
    comment: CommentWithUser;
};

const Comment = async ({ comment }: Props) => {

    const [assignees, sprints] = useAppStore(
        useShallow((state) => [state.assignees, state.sprints]),
    );

    const config = useMemo(() => getPropertyConfig(comment.propertyKey as TaskPropertyType, assignees, sprints), [comment.propertyKey, assignees, sprints]);
    

    const newOption = useMemo(() => {
        if (
            config.type !== "enum" &&
            config.type !== "dynamic"
        )
            return null;

        const options = config.options;
        return options.find((option) => option.key === comment.propertyValue);
    }, [config, comment.propertyValue]);

    const oldOption = useMemo(() => {
        if (
            config.type !== "enum" &&
            config.type !== "dynamic"
        )
            return null;

        const options = config.options;
        return options.find((option) => option.key === comment.oldPropertyValue);
    }, [config, comment.oldPropertyValue]);

    if (!config || !newOption || !oldOption) return null;

    return (
        <div className={cn("flex items-center", typography.paragraph.p_muted)}>
            <div className="relative">
                <TaskProperty option={newOption} size="iconSm"/>
                <div className="absolute w-full h-full bg-background left-0 top-0 -z-10"/>
                <div className="absolute w-[1px] h-[200%] bg-muted left-[50%] -translate-x-[50%] -z-20"/>
            </div>
            <p className="ml-3"><b>{comment.user.username}</b> changed {config.displayName} from <b>{oldOption.displayName}</b> to <b>{newOption.displayName}</b></p>
            <Dot />
            {formatDistanceToNow(
                comment.insertedDate,
            )}

        </div>
    );
};

export default Comment;
