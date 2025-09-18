import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(()=>{
    (async()=>{
      const snap = await getDocs(collection(db, 'users'))
      setUsers(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })))
    })()
  },[])

  async function changeRole(id: string, role: 'student'|'alumni'|'admin') {
    await updateDoc(doc(db, 'users', id), { role })
    setUsers(u=>u.map(x=>x.id===id? { ...x, role }: x))
  }

  async function toggleSuspend(id: string, suspended: boolean) {
    await updateDoc(doc(db, 'users', id), { suspended })
    setUsers(u=>u.map(x=>x.id===id? { ...x, suspended }: x))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Manage Users</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Suspended</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.displayName || u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select value={u.role} onChange={e=>changeRole(u.id, e.target.value as any)} className="border p-1">
                  <option value="student">Student</option>
                  <option value="alumni">Alumni</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2">{u.suspended? 'Yes':'No'}</td>
              <td className="p-2">
                <button className="text-sm" onClick={()=>toggleSuspend(u.id, !u.suspended)}>{u.suspended? 'Reactivate':'Suspend'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
