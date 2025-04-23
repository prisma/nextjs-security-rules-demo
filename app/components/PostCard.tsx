import Link from 'next/link'
import { Post } from '@prisma/client'

type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link 
      href={`/posts/${post.id}`}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-semibold text-gray-900">
          {post.title}
        </h3>
        {!post.published && (
          <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-lg">
            DRAFT
          </span>
        )}
      </div>
      {post.content && (
        <p className="text-gray-600 line-clamp-2">
          {post.content}
        </p>
      )}
      <div className="mt-4 text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </Link>
  )
}