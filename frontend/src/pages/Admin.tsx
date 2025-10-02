import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

export default function Admin() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setPosts(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
      setLoading(false)
    })()
  }, [])

  async function approve(id: string) {
    await updateDoc(doc(db, 'posts', id), { approved: true })
    setPosts(p => p.map(x => x.id === id ? { ...x, approved: true } : x))
  }

  // Animation variants with proper TypeScript typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4"
          >
            Admin Panel
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-6"
          >
            <Link 
              to="/admin/users" 
              className="group relative px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-blue-500"
            >
              <span className="text-blue-400 group-hover:text-blue-300 transition-colors font-medium">
                Manage Users
              </span>
              <div className="absolute inset-0 rounded-xl bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity" />
            </Link>
            <Link 
              to="/admin/reports" 
              className="group relative px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-purple-500"
            >
              <span className="text-purple-400 group-hover:text-purple-300 transition-colors font-medium">
                View Reports
              </span>
              <div className="absolute inset-0 rounded-xl bg-purple-500 opacity-0 group-hover:opacity-5 transition-opacity" />
            </Link>
          </motion.div>
        </div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
            Post Approvals
            <span className="ml-3 px-3 py-1 bg-gray-800 rounded-full text-sm font-normal text-gray-400">
              {posts.filter(p => !p.approved).length} pending
            </span>
          </h2>
        </motion.div>

        {/* Posts List */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {posts.map(p => (
              <motion.li
                key={p.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                className="group relative"
              >
                <div className={`
                  p-6 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300
                  ${p.approved 
                    ? 'bg-green-900/20 border-green-700/50 hover:border-green-600/70' 
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white mb-2">
                        {p.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`
                          px-3 py-1 rounded-full font-medium
                          ${p.approved 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                          }
                        `}>
                          {p.type}
                        </span>
                        <span className={`
                          px-3 py-1 rounded-full font-medium
                          ${p.approved 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-orange-500/20 text-orange-300'
                          }
                        `}>
                          {p.approved ? 'Approved' : 'Pending Review'}
                        </span>
                      </div>
                    </div>
                    
                    {!p.approved && (
                      <motion.button
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => approve(p.id)}
                        className="ml-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-400 hover:to-emerald-500"
                      >
                        Approve
                      </motion.button>
                    )}
                  </div>
                  
                  {/* Animated approval indicator */}
                  {p.approved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {/* Empty State */}
        {posts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">No posts to review</h3>
            <p className="text-gray-500">All posts have been approved or there are no posts yet.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}