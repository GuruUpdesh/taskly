'use server';

import { db } from '~/server/db';
import { posts, Post, NewPost } from "~/server/db/schema";
import { revalidatePath } from 'next/cache';

export async function fetchPosts() {
    try {
        const allPosts: Post[] = await db.select().from(posts);
        return allPosts;
    } catch (err) {
       if (err instanceof Error) console.log(err.stack)
    }
}

export async function createPost(formData: FormData) {
    try {
        const newPost: NewPost = {
            name: formData.get('name') as string,
            createdById: "1",
        };
        await db.insert(posts).values(newPost)
        revalidatePath('/')
    } catch (err) {
       if (err instanceof Error) console.log(err.stack)
    }
}