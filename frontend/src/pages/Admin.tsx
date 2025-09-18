import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Link } from 'react-router-dom'

export default function Admin() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(()=>{
    (async()=>{
      const q = query(collection(db, 'posts'), orderBy('createdAt','desc'))
      const snap = await getDocs(q)
      setPosts(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })))
    })()
  },[])

  async function approve(id: string) {
    await updateDoc(doc(db, 'posts', id), { approved: true })
    setPosts(p=>p.map(x=>x.id===id? { ...x, approved: true }: x))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <div className="flex gap-4 text-sm">
        <Link to="/admin/users" className="text-blue-600">Manage Users</Link>
        <Link to="/admin/reports" className="text-blue-600">View Reports</Link>
      </div>
      <h2 className="text-lg font-medium">Post Approvals</h2>
      <ul className="space-y-3">
        {posts.map(p=> (
          <li key={p.id} className="p-4 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-500">{p.type} {p.approved? '(Approved)': '(Pending)'}</div>
            </div>
            {!p.approved && <button className="text-sm text-blue-600" onClick={()=>approve(p.id)}>Approve</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}
