"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { authorizedClient } from "@/lib/db";
import { encodeUserId } from "@/lib/jwt";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("You must be logged in to create a post");
  }

  const userIdToken = await encodeUserId(session.user.id);
  authorizedClient.$rules.setGlobalContext({ userIdToken });

  await authorizedClient.post.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      authorId: session.user.id,
    },
  });

  redirect("/");
}
