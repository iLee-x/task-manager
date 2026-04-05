import mongoose, { Schema, Document } from 'mongoose'

export interface ISubtask {
  _id: string
  title: string
  done: boolean
}

export interface ITask extends Document {
  title: string
  description?: string
  subtasks: ISubtask[]
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

const SubtaskSchema = new Schema<ISubtask>({
  title: { type: String, required: true },
  done: { type: Boolean, default: false },
})

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    subtasks: [SubtaskSchema],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Task = mongoose.models.Task ?? mongoose.model<ITask>('Task', TaskSchema)
