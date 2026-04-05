export interface Subtask {
  _id: string
  title: string
  done: boolean
}

export interface Task {
  _id: string
  title: string
  description?: string
  subtasks: Subtask[]
  archived: boolean
  createdAt: string
  updatedAt: string
}
