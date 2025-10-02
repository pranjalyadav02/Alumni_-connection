import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(db, 'users'))
      setUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })))
      setLoading(false)
    })()
  }, [])

  async function changeRole(id: string, role: 'student' | 'alumni' | 'admin') {
    setUpdatingId(id)
    await updateDoc(doc(db, 'users', id), { role })
    setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
    setUpdatingId(null)
  }

  async function toggleSuspend(id: string, suspended: boolean) {
    setUpdatingId(id)
    await updateDoc(doc(db, 'users', id), { suspended })
    setUsers(u => u.map(x => x.id === id ? { ...x, suspended } : x))
    setUpdatingId(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/50'
      case 'alumni': return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      default: return 'bg-green-500/20 text-green-300 border-green-500/50'
    }
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            className="text-gray-400 text-lg font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading users...
          </motion.p>
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
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            User Management
          </motion.h1>
          <motion.p 
            className="text-gray-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage user roles and account status
          </motion.p>
        </div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="text-2xl font-bold text-white">{users.length}</div>
            <div className="text-gray-400 text-sm">Total Users</div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300"
          >
            <div className="text-2xl font-bold text-white">
              {users.filter(u => u.role === 'student').length}
            </div>
            <div className="text-gray-400 text-sm">Students</div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="text-2xl font-bold text-white">
              {users.filter(u => u.role === 'alumni').length}
            </div>
            <div className="text-gray-400 text-sm">Alumni</div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="text-2xl font-bold text-white">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-gray-400 text-sm">Admins</div>
          </motion.div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="p-4 text-left text-gray-400 font-semibold">User</th>
                  <th className="p-4 text-left text-gray-400 font-semibold">Email</th>
                  <th className="p-4 text-left text-gray-400 font-semibold">Role</th>
                  <th className="p-4 text-left text-gray-400 font-semibold">Status</th>
                  <th className="p-4 text-left text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((u) => (
                    <motion.tr
                      key={u.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="border-b border-gray-700/20 hover:bg-gray-700/20 transition-all duration-300 group"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {u.displayName?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {u.displayName || 'Unknown User'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              ID: {u.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-300">{u.email}</td>
                      <td className="p-4">
                        <motion.select
                          whileFocus={{ scale: 1.02 }}
                          value={u.role}
                          onChange={e => changeRole(u.id, e.target.value as any)}
                          disabled={updatingId === u.id}
                          className={`px-3 py-1.5 rounded-lg border ${getRoleColor(u.role)} backdrop-blur-sm text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-blue-500 disabled:opacity-50`}
                        >
                          <option value="student">Student</option>
                          <option value="alumni">Alumni</option>
                          <option value="admin">Admin</option>
                        </motion.select>
                      </td>
                      <td className="p-4">
                        <motion.span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            u.suspended
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-green-500/20 text-green-300 border border-green-500/30'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {u.suspended ? (
                            <>
                              <motion.div
                                className="w-2 h-2 bg-red-400 rounded-full mr-2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              Suspended
                            </>
                          ) : (
                            <>
                              <motion.div
                                className="w-2 h-2 bg-green-400 rounded-full mr-2"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              Active
                            </>
                          )}
                        </motion.span>
                      </td>
                      <td className="p-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleSuspend(u.id, !u.suspended)}
                          disabled={updatingId === u.id}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                            u.suspended
                              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30'
                              : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {updatingId === u.id ? (
                            <motion.div
                              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          ) : u.suspended ? (
                            'Reactivate'
                          ) : (
                            'Suspend'
                          )}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-500 text-lg">No users found</div>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Manage your platform users with ease
        </motion.div>
      </motion.div>
    </div>
  )
}