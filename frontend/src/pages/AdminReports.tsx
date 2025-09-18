import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'

export default function AdminReports() {
  const [reports, setReports] = useState<any[]>([])

  useEffect(()=>{
    (async()=>{
      const q = query(collection(db, 'reports'))
      const snap = await getDocs(q)
      setReports(snap.docs.map(d=>({ id: d.id, ...(d.data() as any) })))
    })()
  },[])

  async function markResolved(id: string) {
    await updateDoc(doc(db, 'reports', id), { resolved: true })
    setReports(r=>r.map(x=>x.id===id? { ...x, resolved: true }: x))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <ul className="space-y-3">
        {reports.map(r => (
          <li key={r.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-medium">Post: {r.postId}</div>
              <div className="text-xs text-gray-500">Reason: {r.reason || 'Inappropriate'}</div>
            </div>
            {!r.resolved && <button className="text-sm text-blue-600" onClick={()=>markResolved(r.id)}>Resolve</button>}
          </li>
        ))}
        {reports.length===0 && <div className="text-sm text-gray-500">No reports</div>}
      </ul>
    </div>
  )
}
