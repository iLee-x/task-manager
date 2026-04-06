import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Task, Subtask } from '@/types'

function loadInitial(): Task[] {
  try {
    const raw = localStorage.getItem('task-manager-tasks')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: loadInitial() as Task[],
  reducers: {
    addTask(state, action: PayloadAction<Task>) {
      state.unshift(action.payload)
    },
    renameTask(state, action: PayloadAction<{ taskId: string; title: string }>) {
      const t = state.find((t) => t._id === action.payload.taskId)
      if (t) t.title = action.payload.title
    },
    renameSubtask(state, action: PayloadAction<{ taskId: string; subtaskId: string; title: string }>) {
      const t = state.find((t) => t._id === action.payload.taskId)
      if (t) {
        const s = t.subtasks.find((s) => s._id === action.payload.subtaskId)
        if (s) s.title = action.payload.title
      }
    },
    toggleSubtask(state, action: PayloadAction<{ taskId: string; subtaskId: string }>) {
      const t = state.find((t) => t._id === action.payload.taskId)
      if (t) {
        const s = t.subtasks.find((s) => s._id === action.payload.subtaskId)
        if (s) s.done = !s.done
      }
    },
    addSubtask(state, action: PayloadAction<{ taskId: string; subtask: Subtask }>) {
      const t = state.find((t) => t._id === action.payload.taskId)
      if (t) t.subtasks.push(action.payload.subtask)
    },
    archiveTask(state, action: PayloadAction<string>) {
      const t = state.find((t) => t._id === action.payload)
      if (t) t.archived = true
    },
    unarchiveTask(state, action: PayloadAction<string>) {
      const t = state.find((t) => t._id === action.payload)
      if (t) t.archived = false
    },
    deleteTask(state, action: PayloadAction<string>) {
      return state.filter((t) => t._id !== action.payload)
    },
  },
})

export const {
  addTask, renameTask, renameSubtask, toggleSubtask,
  addSubtask, archiveTask, unarchiveTask, deleteTask,
} = tasksSlice.actions

export default tasksSlice.reducer
