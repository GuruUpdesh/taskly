"use client";

import React, { useOptimistic, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Post } from "~/server/db/schema";
import { createPost } from "~/app/_actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "~/lib/utils";

type FormComponentProps = {
  posts: Post[];
};

type OptimisticPost = Post & { pending: boolean };

function reducer (
  state: OptimisticPost[],
  action: { type: "ADD"; payload: Post }
) {
  switch (action.type) {
    case "ADD":
      return [...state, { ...action.payload, pending: true }];
    default:
      throw new Error("Invalid action type")
  }
}

const Form = ({ posts }: FormComponentProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [optimisticPosts, dispatch] = useOptimistic(posts.map(post => ({...post, pending: false})), reducer)

  return (
    <>
      <form
        ref={ref}
        action={async (formData) => {
          ref.current?.reset();
          dispatch({ type: "ADD", payload: {
            id: Math.random(),
            name: formData.get("name") as string,
            createdAt: new Date(),
            createdById: "1",
            updatedAt: null,
          }})
          await createPost(formData);
        }}
        className="w-600 flex flex-col gap-4"
      >
        <Input type="text" name="name" placeholder="Create post..."></Input>
        <AddButton />
      </form>

      <div className="flex flex-col items-center gap-6">
        {optimisticPosts.map((post) => (
            <Card key={post.id} className={cn(
              {"opacity-50 pointer-events-none": post.pending}
            )}>
              <CardHeader>
                <CardTitle>{post.name}</CardTitle>
                <CardDescription>
                  {formatDistanceToNow(post.createdAt)} - User:{" "}
                  {post.createdById}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
      </div>
    </>
  );
};

export default Form;

export const AddButton = () => {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>{pending ? "Adding..." : "Add"}</Button>;
};
