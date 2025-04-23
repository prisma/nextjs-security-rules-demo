export const dynamic = "force-dynamic"; // This disables SSG and ISR

import { authorizedClient } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { PostActions } from "@/app/components/PostActions";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = id;

  const post = await authorizedClient.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
    },
  });

  if (!post) {
    notFound();
  }

  // Server action to delete the post
  async function deletePost() {
    "use server";

    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You need to be authenticated to perform this action." };
    }
    console.log("deletePost, set global context");
    console.log("session?.user.id", session?.user.id);
    console.log("post?.author?.id", post?.author?.id);
    authorizedClient.$rules.setGlobalContext({
      userId: session?.user.id || "",
      authorIdOfPostToChange: post?.author?.id || "",
    });
    try {
      await authorizedClient.post.delete({
        where: {
          id: postId,
        },
      });
    } catch (error) {
      console.error(error);
      return { error: "You need to be authenticated to perform this action." };
    }
    redirect("/");
  }

  // Server action to publish the post
  async function publishPost() {
    "use server";

    const session = await getServerSession(authOptions);
        console.log("publishPost, set global context");
    console.log("session?.user.id", session?.user.id);
    console.log("post?.author?.id", post?.author?.id);
    if (!session) {
      return { error: "You need to be authenticated to perform this action." };
    }
    
    authorizedClient.$rules.setGlobalContext({
      userId: session?.user.id || "",
      authorIdOfPostToChange: post?.author?.id || "",
    });
    try {
      await authorizedClient.post.update({
        where: { id: postId },
        data: { published: true },
      });
    } catch (error) {
      console.error(error);
      return { error: "You need to be authenticated to perform this action." };
    }
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <article className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Post Title */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-5xl font-extrabold text-gray-900">{post.title}</h1>
          {!post.published && (
            <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg ml-auto">DRAFT</span>
          )}
        </div>

        {/* Author Information */}
        <p className="text-lg text-gray-600 mb-4">
          by <span className="font-medium text-gray-800">{post.author?.name || "Anonymous"}</span>
        </p>

        {/* Content Section */}
        <div className="text-lg text-gray-800 leading-relaxed space-y-6 border-t pt-6">
          {post.content ? (
            <p>{post.content}</p>
          ) : (
            <p className="italic text-gray-500">No content available for this post.</p>
          )}
        </div>
      </article>

      <PostActions publishAction={publishPost} deleteAction={deletePost} />
    </div>
  );
}
