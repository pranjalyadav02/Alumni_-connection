import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { useParams } from 'react-router-dom'
import { fetchPosts, incrementViews } from '../features/posts/postsSlice'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id))
  const [author, setAuthor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(()=>{
    if (!post) void dispatch(fetchPosts())
  },[dispatch, post])

  useEffect(()=>{
    if (id) {
      void dispatch(incrementViews(id))
    }
  },[dispatch, id])

  useEffect(() => {
    if (post?.authorId) {
      (async () => {
        const authorDoc = await getDoc(doc(db, 'users', post.authorId))
        setAuthor(authorDoc.data())
      })()
    }
  }, [post])

  if (!post) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading post...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.type}
            </span>
            {post.draft && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Draft
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span>By {author?.displayName || 'Unknown Author'}</span>
            <span></span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span></span>
            <span>{post.views} views</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <article className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
        
        {post.expiresAt && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> This post expires on {new Date(post.expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
