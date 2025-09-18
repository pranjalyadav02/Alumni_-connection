import { useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, PostType } from '../features/posts/postsSlice'
import { AppDispatch, RootState } from '../store/store'
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter post title" 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={type} 
                onChange={e=>setType(e.target.value as PostType)}
              >
                <option value="job">Job</option>
                <option value="internship">Internship</option>
                <option value="mentorship">Mentorship</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="react, javascript, remote" 
                value={tags} 
                onChange={e=>setTags(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule at</label>
              <input 
                type="datetime-local" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={scheduledAt} 
                onChange={e=>setScheduledAt(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expires at</label>
              <input 
                type="datetime-local" 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={expiresAt} 
                onChange={e=>setExpiresAt(e.target.value)} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="draft" 
              checked={isDraft} 
              onChange={e=>setIsDraft(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="draft" className="text-sm text-gray-700">Save as draft</label>
          </div>
          
          <div className="flex gap-3">
            <button 
              type="submit"
              disabled={isLoading || !title.trim() || !content.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/posts')}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
