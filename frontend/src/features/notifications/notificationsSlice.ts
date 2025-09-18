import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface NotificationItem {
  id: string
  title: string
  body: string
  createdAt: number
  read: boolean
}

interface NotificationsState {
  items: NotificationItem[]
}

const initialState: NotificationsState = { items: [] }

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NotificationItem>) {
      state.items.unshift(action.payload)
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find(x => x.id === action.payload)
      if (n) n.read = true
    },
    clearAll(state) {
      state.items = []
    }
  }
})

export const { addNotification, markRead, clearAll } = notificationsSlice.actions
export default notificationsSlice.reducer
