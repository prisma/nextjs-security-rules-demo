'use client'

import { useState } from 'react'

type Post = {
  id: string
  title: string
  published: boolean
}

type UserCardProps = {
  name: string | null
  email: string
  postCount: number
  posts: Post[]
}

export default function UserCard({ name, email, postCount, posts }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  console.log(`UserCard - posts`, posts);
  return (
    <li 
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer transition-all duration-200 hover:shadow-md"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="font-medium">{name}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {email} ({postCount} posts)
      </div>
      
      {isExpanded && posts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold mb-2">Posts</h3>
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="text-sm">
                {post.title}
                <span className="ml-2 text-xs text-gray-400">
                  {post.published ? '(Published)' : '(Draft)'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
} 