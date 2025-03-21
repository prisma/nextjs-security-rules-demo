"use client";

import UserCard from "./components/UserCard";
import { useEffect, useState} from "react";
import { policy } from "@/lib/policy";

type User = {
  id: string;
  name: string | null;
  email: string;
  _count: { posts: number };
  posts: { id: string; title: string; published: boolean }[];
};

async function getUsersWithPosts() {
  console.log(`getUsersWithPosts`);
  const users = await policy.user.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
      posts: {
        select: {
          id: true,
          title: true,
          published: true,
        },
      },
    },
  });
  console.log(`users`, users);
  return users;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersWithPosts();
        setUsers(users);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <UserCard
                key={user.id}
                name={user.name}
                email={user.email}
                postCount={user._count.posts}
                posts={user.posts}
              />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
