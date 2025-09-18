import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { setRoomMessages, sendMessage } from '../features/chat/chatSlice'
import { collection, onSnapshot, orderBy, query, where, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../lib/firebase'

export default function Messages() {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((s: RootState) => s.auth.user)
  const [roomId] = useState('default-room')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messages = useSelector((s: RootState) => s.chat.messagesByRoom[roomId] || [])

  useEffect(() => {
    if (!user) return
    
    const q = query(
      collection(db, 'messages'), 
      where('roomId','==',roomId), 
      orderBy('createdAt','asc')
    )
    const unsub = onSnapshot(q, (snap)=>{
      const docs = snap.docs.map(d => ({ 
        id: d.id, 
        ...(d.data() as any),
        createdAt: d.data().createdAt?.toDate?.() || new Date()
      }))
      dispatch(setRoomMessages({ roomId, messages: docs }))
    })
    return () => unsub()
  }, [dispatch, roomId, user])

  async function onSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !user) return
    
    setIsLoading(true)
    setError('')
    
    try {
      await addDoc(collection(db, 'messages'), { 
        roomId, 
        senderId: user.uid, 
        senderName: user.displayName || 'Anonymous',
        text: text.trim(),
        createdAt: serverTimestamp() 
      })
      setText('')
    } catch (err: any) {
      setError('Failed to send message')
    } finally {
      setIsLoading(false)
    }
  }

  async function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    
    setIsLoading(true)
    setError('')
    
    try {
      const storageRef = ref(storage, messages/_)
      await uploadBytes(storageRef, file)
      const url = await getDownloadURL(storageRef)
      
      await addDoc(collection(db, 'messages'), { 
        roomId, 
        senderId: user.uid, 
        senderName: user.displayName || 'Anonymous',
        text: [File: ],
        fileUrl: url,
        fileName: file.name,
        createdAt: serverTimestamp() 
      })
    } catch (err: any) {
      setError('Failed to upload file')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="p-6">Please login to view messages</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
        
        <div className="h-96 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map(m => (
              <div key={m.id} className={lex }>
                <div className={max-w-xs lg:max-w-md px-4 py-2 rounded-lg }>
                  <div className="text-xs opacity-75 mb-1">
                    {m.senderName}  {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                  <div>{m.text}</div>
                  {m.fileUrl && (
                    <div className="mt-2">
                      <a 
                        href={m.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline"
                      >
                         {m.fileName}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {error && <div className="px-4 py-2 bg-red-50 text-red-600 text-sm">{error}</div>}
        
        <form onSubmit={onSend} className="p-4 border-t flex gap-2">
          <input 
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={text} 
            onChange={e=>setText(e.target.value)} 
            placeholder="Type a message..." 
            disabled={isLoading}
          />
          <input 
            type="file" 
            onChange={onFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <label 
            htmlFor="file-upload"
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer disabled:opacity-50"
          >
            
          </label>
          <button 
            type="submit"
            disabled={isLoading || !text.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  )
}
