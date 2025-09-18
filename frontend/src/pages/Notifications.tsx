import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { markRead, clearAll, addNotification } from '../features/notifications/notificationsSlice'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function Notifications() {
  const dispatch = useDispatch()
  const user = useSelector((s: RootState) => s.auth.user)
  const items = useSelector((s: RootState) => s.notifications.items)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    
    // Listen for new notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    
    const unsub = onSnapshot(q, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data()
          dispatch(addNotification({
            id: change.doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt?.toDate?.()?.getTime() || Date.now(),
            read: data.read || false
          }))
        }
      })
    })
    
    return () => unsub()
  }, [dispatch, user])

  async function markAsRead(id: string) {
    dispatch(markRead(id))
    // In a real app, you'd update the database here
  }

  async function clearAllNotifications() {
    dispatch(clearAll())
    // In a real app, you'd update the database here
  }

  if (!user) {
    return <div className="p-6">Please login to view notifications</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold">Notifications</h1>
          {items.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        
        <div className="divide-y">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            items.map(n => (
              <div 
                key={n.id} 
                className={p-4 hover:bg-gray-50 }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{n.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{n.body}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.read && (
                    <button 
                      onClick={() => markAsRead(n.id)}
                      className="ml-4 text-blue-600 hover:underline text-sm"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
