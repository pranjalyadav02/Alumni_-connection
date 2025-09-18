import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage, db, auth } from '../lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { getLinkedInAuthUrl, fetchLinkedInProfile } from '../lib/linkedin'
import { logOut } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const user = useSelector((s: RootState) => s.auth.user)
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(()=>{
    if (!user) return
    (async()=>{
      const snap = await getDoc(doc(db, 'users', user.uid))
      const data = snap.data() as any
      setHeadline(data?.headline || '')
      setBio(data?.bio || '')
      setPhotoURL(data?.photoURL || user.photoURL || '')
      setDisplayName(data?.displayName || user.displayName || '')
    })()
  },[user])

  async function save() {
    if (!user) return
    setIsLoading(true)
    setMessage('')
    try {
      const refDoc = doc(db, 'users', user.uid)
      await setDoc(refDoc, { 
        displayName, 
        headline, 
        bio,
        photoURL, 
        updatedAt: Date.now() 
      }, { merge: true })
      setMessage('Profile saved successfully!')
    } catch (err: any) {
      setMessage('Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setIsLoading(true)
    try {
      const storageRef = ref(storage, vatars/)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      setPhotoURL(url)
      await updateDoc(doc(db, 'users', user.uid), { photoURL: url })
      setMessage('Photo updated successfully!')
    } catch (err: any) {
      setMessage('Failed to upload photo')
    } finally {
      setIsLoading(false)
    }
  }

  async function importLinkedIn() {
    setIsLoading(true)
    setMessage('')
    try {
      const profile = await fetchLinkedInProfile('demo')
      setHeadline(profile.headline)
      setBio(${profile.firstName}  - )
      setMessage('LinkedIn data imported successfully!')
    } catch (err: any) {
      setMessage('Failed to import LinkedIn data')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogout() {
    await dispatch(logOut())
    navigate('/login')
  }

  if (!user) return <div className="p-6">Please login</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        {message && <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4">{message}</div>}
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="text-center">
              <img 
                src={photoURL || 'https://via.placeholder.com/150'} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto mb-4" 
                alt="Profile"
              />
              <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={onUpload} />
              <button 
                onClick={() => fileInput.current?.click()} 
                disabled={isLoading}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isLoading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={displayName} 
                onChange={e=>setDisplayName(e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={headline} 
                onChange={e=>setHeadline(e.target.value)} 
                placeholder="e.g., Software Engineer at Google"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24" 
                value={bio} 
                onChange={e=>setBio(e.target.value)} 
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={save} 
                disabled={isLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={importLinkedIn} 
                disabled={isLoading}
                className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 disabled:opacity-50"
              >
                Import from LinkedIn
              </button>
            </div>
            
            <div className="pt-4 border-t">
              <button 
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
