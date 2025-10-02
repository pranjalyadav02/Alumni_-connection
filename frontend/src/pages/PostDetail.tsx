import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchPosts, incrementViews } from '../features/posts/postsSlice'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function PostDetail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id))
  const [author, setAuthor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!post) {
      void dispatch(fetchPosts())
    } else {
      setIsLoading(false)
    }
  }, [dispatch, post])

  useEffect(() => {
    if (id) {
      void dispatch(incrementViews(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (post?.authorId) {
      (async () => {
        const authorDoc = await getDoc(doc(db, 'users', post.authorId))
        setAuthor(authorDoc.data())
      })()
    }
  }, [post])

  const getTypeConfig = (type: string) => {
    const config = {
      job: { icon: '💼', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20', text: 'text-blue-300' },
      internship: { icon: '🎓', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20', text: 'text-green-300' },
      mentorship: { icon: '🤝', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20', text: 'text-purple-300' },
      announcement: { icon: '📢', color: 'from-orange-500 to-red-500', bg: 'bg-orange-500/20', text: 'text-orange-300' }
    }
    return config[type as keyof typeof config] || config.announcement
  }

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Post Not Found</h3>
          <p className="text-gray-400 mb-4">The post you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/posts')}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Back to Posts
          </button>
        </div>
      </div>
    )
  }

  const typeConfig = getTypeConfig(post.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className={`max-w-4xl mx-auto transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/posts')}
          className="mb-6 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 group"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Posts</span>
        </button>

        {/* Main Content Card */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="relative p-8 border-b border-gray-700/50">
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${typeConfig.color} opacity-5`}></div>
            
            <div className="relative">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full ${typeConfig.bg} ${typeConfig.text} border border-current border-opacity-30 backdrop-blur-sm`}>
                  <span className="mr-2">{typeConfig.icon}</span>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </span>
                {post.draft && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 backdrop-blur-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Draft
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {/* Author */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {(author?.displayName || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{author?.displayName || 'Unknown Author'}</p>
                    <p className="text-gray-400">Author</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{getTimeAgo(post.createdAt)}</span>
                </div>

                {/* Views */}
                <div className="flex items-center space-x-2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views} views</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 backdrop-blur-sm text-sm hover:bg-gray-600/50 transition-all duration-300 cursor-pointer hover:scale-105"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <article className="prose prose-invert max-w-none">
              <div 
                className="text-gray-300 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Expiry Notice */}
            {post.expiresAt && (
              <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-yellow-300 font-semibold mb-1">Time-Sensitive Opportunity</h4>
                    <p className="text-yellow-400/80 text-sm">
                      This post expires on <strong>{new Date(post.expiresAt).toLocaleDateString()}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700/50">
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}