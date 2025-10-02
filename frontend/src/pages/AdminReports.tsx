import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setReports(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
      setLoading(false)
    })()
  }, [])

  async function markResolved(id: string) {
    await updateDoc(doc(db, 'reports', id), { resolved: true })
    setReports(r => r.map(x => x.id === id ? { ...x, resolved: true } : x))
  }

  // Animation variants
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
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.2
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-400 text-lg">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Admin Reports
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage and resolve user reports
          </motion.p>
        </div>

        {/* Stats Card */}
        <motion.div 
          className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">Reports Overview</h3>
              <p className="text-gray-400 text-sm">Total reports: {reports.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {reports.filter(r => !r.resolved).length}
              </div>
              <div className="text-sm text-yellow-400">Pending Resolution</div>
            </div>
          </div>
        </motion.div>

        {/* Reports List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {reports.map(report => (
              <motion.div
                key={report.id}
                variants={itemVariants}
                layout
                exit="exit"
                className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  report.resolved 
                    ? 'bg-gray-800/50 border-green-500/20' 
                    : 'bg-gray-800/80 border-red-500/20 hover:border-red-500/40'
                } hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${
                        report.resolved ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                      }`} />
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        report.resolved 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {report.resolved ? 'Resolved' : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {report.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">Post ID:</span>
                        <code className="bg-gray-700 px-2 py-1 rounded text-sm text-blue-300">
                          {report.postId}
                        </code>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <span className="text-white font-semibold min-w-16">Reason:</span>
                        <p className="text-gray-300 flex-1">
                          {report.reason || 'Content reported as inappropriate'}
                        </p>
                      </div>

                      {report.additionalInfo && (
                        <div className="flex items-start gap-2">
                          <span className="text-white font-semibold min-w-20">Details:</span>
                          <p className="text-gray-400 text-sm flex-1">
                            {report.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {!report.resolved && (
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => markResolved(report.id)}
                      className="ml-4 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                    >
                      Mark Resolved
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reports.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 text-gray-600">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reports Found</h3>
              <p className="text-gray-500">All clear! No pending reports to display.</p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}