export const dynamic = "force-dynamic"; // This disables SSG and ISR

import { authorizedClient } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const postId = id; // parseInt(id);

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
    // const currentContext = policy.$policy.getGlobalContext();
    authorizedClient.$rules.setGlobalContext({
      userId: session?.user.id || "",
      // authorIdOfPostToChange: post?.author?.id || "",
    });
    await authorizedClient.post.delete({
      where: {
        id: postId,
      },
    });

    redirect("/posts");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <article className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
        {/* Post Title */}
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Author Information */}
        <p className="text-lg text-gray-600 mb-4">
          by{" "}
          <span className="font-medium text-gray-800">
            {post.author?.name || "Anonymous"}
          </span>
        </p>

        {/* Content Section */}
        <div className="text-lg text-gray-800 leading-relaxed space-y-6 border-t pt-6">
          {post.content ? (
            <p>{post.content}</p>
          ) : (
            <p className="italic text-gray-500">
              No content available for this post.
            </p>
          )}
        </div>
      </article>

      {/* Delete Button */}
      <form action={deletePost} className="mt-6">
        <button
          type="submit"
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete Post
        </button>
      </form>
    </div>
  );
}
