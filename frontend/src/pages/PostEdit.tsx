import { useEffect, useState } from 'react'
import RichTextEditor from '../components/RichTextEditor'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { updatePost, fetchPosts } from '../features/posts/postsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { containsProfanity } from '../lib/moderation'

export default function PostEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const post = useSelector((s: RootState) => s.posts.items.find(p => p.id === id))
  const [title, setTitle] = useState(post?.title || '')
  const [type, setType] = useState(post?.type || 'job')
  const [content, setContent] = useState(post?.content || '')
  const [tags, setTags] = useState(post?.tags.join(', ') || '')
  const [scheduledAt, setScheduledAt] = useState<string>('')
  const [expiresAt, setExpiresAt] = useState<string>('')
  const [isDraft, setIsDraft] = useState(post?.draft || false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(()=>{ 
    if (!post) {
      void dispatch(fetchPosts())
    } else {
      setTitle(post.title)
      setType(post.type)
      setContent(post.content)
      setTags(post.tags.join(', '))
      setScheduledAt(post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : '')
      setExpiresAt(post.expiresAt ? new Date(post.expiresAt).toISOString().slice(0, 16) : '')
      setIsDraft(post.draft || false)
    }
  }, [post, dispatch])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    
    setIsLoading(true)
    setError('')
    
    try {
      if (containsProfanity(title) || containsProfanity(content)) {
        setError('Please remove inappropriate language from your post.')
        return
      }
      
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      
      await dispatch(updatePost({ 
        id, 
        data: { 
          title, 
          type, 
          content, 
          tags: tagArray,
          scheduledAt: scheduledAt ? new Date(scheduledAt).getTime() : undefined, 
          expiresAt: expiresAt ? new Date(expiresAt).getTime() : undefined,
          draft: isDraft
        } 
      }))
      
      navigate('/posts')
    } catch (err: any) {
      setError(err.message || 'Failed to update post')
    } finally {
      setIsLoading(false)
    }
  }

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
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
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
                onChange={e=>setType(e.target.value as any)}
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
              {isLoading ? 'Updating...' : 'Update Post'}
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
