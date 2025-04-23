"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { authorizedClient } from "@/lib/db";

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions);
  console.log(`set global context`, session);
  authorizedClient.$rules.setGlobalContext({ userId: session? session?.user.id : "" });

  if (!session?.user) {
    throw new Error("You must be logged in to create a post");
  }

  await authorizedClient.post.create({
    data: {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      authorId: session.user.id,
    },
  });

  redirect("/");
}
