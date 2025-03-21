"use client";

import UserCard from "./components/UserCard";
import { useEffect, useState } from "react";
import { policy } from "@/lib/policy";
import { useSession } from "next-auth/react";
import { Post } from "@prisma/client";

async function getPostsForUser(userId: string) {
  console.log(`getUsersWithPosts for user: ${userId}`);
  try {
    const posts = await policy.post.findMany({
      where: {
        authorId: userId,
      },
    });
    console.log(`posts`, posts);
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
  console.log(`Home — session`, session);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // console.log(`Home — useEffect — session`, session);
        const posts = await getPostsForUser(session?.user.id || "");
        setPosts(posts);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [session]);

  if (!session) {
    return <div>Log in first</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
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
          <ul className="space-y-3">
              <UserCard
                key={session.user.id}
                name={session.user.name}
                email={session.user.email}
                postCount={posts.length}
                posts={posts}
              />
          </ul>
        )}
      </main>
    </div>
  );
}
