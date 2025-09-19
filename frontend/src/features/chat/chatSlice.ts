import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export interface Message {
  id?: string
  roomId: string
  senderId: string
  text: string
  createdAt?: unknown
}

interface ChatState {
  messagesByRoom: Record<string, Message[]>
}

const initialState: ChatState = { messagesByRoom: {} }

export const sendMessage = createAsyncThunk('chat/send', async (payload: Omit<Message,'id'|'createdAt'>) => {
  await addDoc(collection(db, 'messages'), { ...payload, createdAt: serverTimestamp() })
  return true
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoomMessages(state, action: PayloadAction<{ roomId: string; messages: Message[] }>) {
      state.messagesByRoom[action.payload.roomId] = action.payload.messages
    }
  }
})

export const { setRoomMessages } = chatSlice.actions
export default chatSlice.reducer
