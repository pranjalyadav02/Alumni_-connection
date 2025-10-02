import { useState, useEffect } from 'react'
import RichTextEditor from '../components/RichTextEditor'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../features/posts/postsSlice'
import type { PostType } from '../features/posts/postsSlice'
import type{  AppDispatch, RootState } from '../store/store'
import { useNavigate } from 'react-router-dom'
import { containsProfanity } from '../lib/moderation'

export default function PostCreate() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((s: RootState) => s.auth.user)
  const [title, setTitle] = useState('')
  const [type, setType] = useState<PostType>('job')
  const [content, setContent] = useState('')
  const [scheduledAt, setScheduledAt] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [tags, setTags] = useState<string>('')
  const [isDraft, setIsDraft] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    
    setIsLoading(true)
    setError('')
    
    try {
      if (containsProfanity(title) || containsProfanity(content)) {
        setError('Please remove inappropriate language from your post.')
        return
      }
      
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      
      await dispatch(createPost({ 
        title, 
        type, 
        content, 
        authorId: user.uid, 
        tags: tagArray,
        scheduledAt: scheduledAt ? new Date(scheduledAt).getTime() : undefined, 
        expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
        draft: isDraft
      }))
      
      navigate('/posts')
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeIcon = (postType: PostType) => {
    switch (postType) {
      case 'job':
        return '💼'
      case 'internship':
        return '🎓'
      case 'mentorship':
        return '🤝'
      case 'announcement':
        return '📢'
      default:
        return '📝'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-gray-400">Please login to create posts</p>
        </div>
      </div>
    )
  }

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
        {/* Header */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Post</h1>
                <p className="text-gray-400">Share opportunities and announcements with the community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300">{error}</span>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Post Title</span>
                </label>
                <input 
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50" 
                  placeholder="Enter an engaging post title..." 
                  value={title} 
                  onChange={e=>setTitle(e.target.value)} 
                  required
                />
              </div>
              
              {/* Type and Tags Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Post Type</span>
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none hover:border-gray-500/50" 
                      value={type} 
                      onChange={e=>setType(e.target.value as PostType)}
                    >
                      <option value="job">💼 Job Opportunity</option>
                      <option value="internship">🎓 Internship</option>
                      <option value="mentorship">🤝 Mentorship</option>
                      <option value="announcement">📢 Announcement</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Tags</span>
                  </label>
                  <input 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50" 
                    placeholder="react, javascript, remote, full-time..." 
                    value={tags} 
                    onChange={e=>setTags(e.target.value)} 
                  />
                  <p className="text-xs text-gray-400">Separate tags with commas</p>
                </div>
              </div>
              
              {/* Schedule and Expiry Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Schedule Post</span>
                  </label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50" 
                    value={scheduledAt} 
                    onChange={e=>setScheduledAt(e.target.value)} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Expires At</span>
                  </label>
                  <input 
                    type="datetime-local" 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 hover:border-gray-500/50" 
                    value={expiresAt} 
                    onChange={e=>setExpiresAt(e.target.value)} 
                  />
                </div>
              </div>
              
              {/* Content Editor */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Post Content</span>
                </label>
                <div className="border border-gray-600/50 rounded-xl overflow-hidden">
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </div>
              
              {/* Draft Toggle */}
              <div className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/30">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="draft" 
                    checked={isDraft} 
                    onChange={e=>setIsDraft(e.target.checked)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="draft" 
                    className={`relative w-12 h-6 flex items-center cursor-pointer rounded-full transition-all duration-300 ${
                      isDraft ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  >
                    <span className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                      isDraft ? 'translate-x-7' : 'translate-x-1'
                    }`}></span>
                  </label>
                </div>
                <div className="ml-3">
                  <label htmlFor="draft" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Save as draft
                  </label>
                  <p className="text-xs text-gray-400">Draft posts are only visible to you</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-700/50">
                <button 
                  type="submit"
                  disabled={isLoading || !title.trim() || !content.trim()}
                  className="flex items-center justify-center flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating Post...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Create Post
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('/posts')}
                  className="px-8 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Post Creation Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">1</span>
              </div>
              <p>Be clear and specific in your title and description</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">2</span>
              </div>
              <p>Use relevant tags to help others discover your post</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">3</span>
              </div>
              <p>Schedule posts for optimal engagement times</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">4</span>
              </div>
              <p>Set expiry dates for time-sensitive opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}