import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../../lib/firebase'

export type UserRole = 'student' | 'alumni' | 'admin'

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
}

interface AuthState {
  user: AppUser | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
}

export const initAuthListener = createAsyncThunk('auth/init', async () => {
  const authInstance = getAuth()
  return new Promise<AppUser | null>((resolve) => {
    onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (!firebaseUser) return resolve(null)
      const profileRef = doc(db, 'users', firebaseUser.uid)
      const profileSnap = await getDoc(profileRef)
      const profileData = profileSnap.data() as Partial<AppUser> | undefined
      resolve({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: (profileData?.role as UserRole) || 'student',
      })
    })
  })
})

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (payload: { email: string; password: string }) => {
    const credential = await signInWithEmailAndPassword(auth, payload.email, payload.password)
    const user = credential.user
    const profileSnap = await getDoc(doc(db, 'users', user.uid))
    const profileData = profileSnap.data() as Partial<AppUser> | undefined
    const appUser: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: (profileData?.role as UserRole) || 'student',
    }
    return appUser
  }
)

export const logOut = createAsyncThunk('auth/logOut', async () => {
  await signOut(auth)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initAuthListener.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(initAuthListener.fulfilled, (state, action: PayloadAction<AppUser | null>) => {
        state.user = action.payload
        state.status = 'succeeded'
      })
      .addCase(initAuthListener.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Auth init failed'
      })
      .addCase(signIn.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Sign in failed'
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
