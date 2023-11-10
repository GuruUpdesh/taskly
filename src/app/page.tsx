import Posts from "~/components/Posts";
import { fetchPosts } from "./_actions";

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 ">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Posts Example
        </h3>
        {posts ? <Posts posts={posts}/> : null}
        
      </div>
    </main>
  );
}