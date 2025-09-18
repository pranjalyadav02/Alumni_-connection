import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export type PostType = 'job' | 'internship' | 'mentorship' | 'announcement'

export interface PostEntity {
  id: string
  title: string
  type: PostType
  content: string
  authorId: string
  tags: string[]
  createdAt: number
  updatedAt: number
  scheduledAt?: number
  expiresAt?: number
  draft?: boolean
  views: number
}

interface PostsState {
  items: PostEntity[]
  status: 'idle'|'loading'|'succeeded'|'failed'
  error: string | null
}

const initialState: PostsState = { items: [], status: 'idle', error: null }

export const fetchPosts = createAsyncThunk('posts/fetch', async () => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  const now = Date.now()
  return snap.docs
    .map(d => ({ id: d.id, ...(d.data() as Omit<PostEntity,'id'>) }))
    .filter(p => !p.expiresAt || (p.expiresAt as number) > now) as PostEntity[]
})

export const createPost = createAsyncThunk('posts/create', async (payload: Omit<PostEntity,'id'|'createdAt'|'updatedAt'|'views'>) => {
  const now = Date.now()
  const docRef = await addDoc(collection(db, 'posts'), { ...payload, createdAt: now, updatedAt: now, views: 0 })
  return { id: docRef.id, ...payload, createdAt: now, updatedAt: now, views: 0 } as PostEntity
})

export const updatePost = createAsyncThunk('posts/update', async (payload: { id: string; data: Partial<PostEntity> }) => {
  const { id, data } = payload
  const ref = doc(db, 'posts', id)
  await updateDoc(ref, { ...data, updatedAt: Date.now() })
  return { id, data }
})

export const deletePostById = createAsyncThunk('posts/delete', async (id: string) => {
  await deleteDoc(doc(db, 'posts', id))
  return id
})

export const incrementViews = createAsyncThunk('posts/incViews', async (id: string) => {
  const ref = doc(db, 'posts', id)
  await updateDoc(ref, { views: increment(1) })
  return id
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (s)=>{ s.status='loading' })
      .addCase(fetchPosts.fulfilled, (s,a:PayloadAction<PostEntity[]>)=>{ s.status='succeeded'; s.items=a.payload })
      .addCase(fetchPosts.rejected, (s,a)=>{ s.status='failed'; s.error=a.error.message||'Failed' })
      .addCase(createPost.fulfilled, (s,a)=>{ s.items.unshift(a.payload) })
      .addCase(updatePost.fulfilled, (s,a)=>{ const i=s.items.findIndex(x=>x.id===a.payload.id); if(i>-1) s.items[i] = { ...s.items[i], ...a.payload.data } as PostEntity })
      .addCase(deletePostById.fulfilled, (s,a)=>{ s.items = s.items.filter(x=>x.id!==a.payload) })
      .addCase(incrementViews.fulfilled, ()=>{})
  },
})

export default postsSlice.reducer
