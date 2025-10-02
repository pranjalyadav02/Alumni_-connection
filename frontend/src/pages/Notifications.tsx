import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { markRead, clearAll, addNotification } from '../features/notifications/notificationsSlice'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function Notifications() {
  const dispatch = useDispatch()
  const user = useSelector((s: RootState) => s.auth.user)
  const items = useSelector((s: RootState) => s.notifications.items)
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (!user) return

    setIsLoading(true)
    
    // Listen for new notifications
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      setIsLoading(false)
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data()
          dispatch(addNotification({
            id: change.doc.id,
            title: data.title,
            body: data.body,
            createdAt: data.createdAt?.toDate?.()?.getTime() || Date.now(),
            read: data.read || false,
          }))
        }
      })
    })

    return () => unsub()
  }, [dispatch, user])

  async function markAsRead(id: string) {
    dispatch(markRead(id))
    // TODO: update database
  }

  async function clearAllNotifications() {
    dispatch(clearAll())
    // TODO: update database
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
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
          <p className="text-gray-400">Please login to view notifications</p>
        </div>
      </div>
    )
  }

  const unreadCount = items.filter(item => !item.read).length

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg relative">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-gray-800">
                      <span className="text-xs font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Notifications</h1>
                  <p className="text-gray-400">
                    {items.length === 0 ? 'No notifications' : `${items.length} total, ${unreadCount} unread`}
                  </p>
                </div>
              </div>
              
              {items.length > 0 && (
                <button 
                  onClick={clearAllNotifications}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {isLoading ? (
            // Loading Skeleton
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/30 animate-pulse">
                  <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
              <p className="text-gray-400 max-w-sm">
                When you receive notifications, they will appear here. Stay tuned for updates!
              </p>
            </div>
          ) : (
            // Notifications List
            <div className="divide-y divide-gray-700/50">
              {items.map((notification, index) => (
                <div 
                  key={notification.id}
                  className={`p-6 transition-all duration-500 transform hover:scale-[1.02] ${
                    notification.read 
                      ? 'bg-gray-800/20 hover:bg-gray-700/30' 
                      : 'bg-purple-500/5 hover:bg-purple-500/10 border-l-4 border-l-purple-500'
                  } ${index === 0 ? 'animate-fade-in' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Notification Icon */}
                    {getNotificationIcon((notification as any).type || 'info')}
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className={`font-semibold ${
                            notification.read ? 'text-gray-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-400 mt-1 leading-relaxed">
                            {notification.body}
                          </p>
                          <div className="flex items-center space-x-4 mt-3">
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{getTimeAgo(notification.createdAt)}</span>
                            </span>
                            {!notification.read && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        {!notification.read && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="ml-4 px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-300 flex items-center space-x-2 group"
                          >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm">Mark Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {items.length > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{unreadCount} unread notifications</span>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <button 
                  onClick={clearAllNotifications}
                  className="text-red-400 hover:text-red-300 transition-colors duration-300"
                >
                  Clear all
                </button>
                <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                  Mark all as read
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}