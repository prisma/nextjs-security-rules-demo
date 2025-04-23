"use client";

import { useEffect, useState } from "react";
import { authorizedClient } from "@/lib/db";
import { useSession } from "next-auth/react";
import { Post } from "@prisma/client";
import PostCard from "./components/PostCard";

async function getPostsForUser(userId: string) {
  try {
    const posts = await authorizedClient.post.findMany({
      where: {
        authorId: userId,
      },
    });
    return posts;
  } catch (error) {
    throw error;
  }
}

async function getLatestPosts(take: number) {
  try {
    const posts = await authorizedClient.post.findMany({
      take: take,
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    throw error;
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (session?.user.id) {
          const posts = await getPostsForUser(session?.user.id || "");
          setPosts(posts);
        } else {
          const posts = await getLatestPosts(5);
          setPosts(posts);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch posts"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [session]);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{session ? "My Posts" : "Latest Posts"}</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 mt-1">{error.message}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You haven&apos;t created any posts yet.</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        )}
      </main>
    </div>
  );
}
