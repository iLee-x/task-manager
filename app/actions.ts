'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/mongodb'
import { Task } from '@/lib/models/Task'

export async function getTasks() {
  await connectToDatabase()
  const tasks = await Task.find({ archived: false }).sort({ createdAt: -1 }).lean()
  return JSON.parse(JSON.stringify(tasks))
}

export async function getArchivedTasks() {
  await connectToDatabase()
  const tasks = await Task.find({ archived: true }).sort({ updatedAt: -1 }).lean()
  return JSON.parse(JSON.stringify(tasks))
}

export async function createTask(formData: FormData) {
  await connectToDatabase()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const subtasksRaw = formData.get('subtasks') as string

  const subtaskTitles: string[] = subtasksRaw
    ? subtasksRaw.split('\n').map((s) => s.trim()).filter(Boolean)
    : []

  await Task.create({
    title,
    description,
    subtasks: subtaskTitles.map((t) => ({ title: t, done: false })),
    archived: false,
  })

  revalidatePath('/')
}

export async function toggleSubtask(taskId: string, subtaskId: string, done: boolean) {
  await connectToDatabase()

  await Task.updateOne(
    { _id: taskId, 'subtasks._id': subtaskId },
    { $set: { 'subtasks.$.done': done } }
  )

  revalidatePath('/')
}

export async function addSubtask(taskId: string, title: string) {
  await connectToDatabase()

  await Task.updateOne(
    { _id: taskId },
    { $push: { subtasks: { title, done: false } } }
  )

  revalidatePath('/')
}

export async function archiveTask(taskId: string) {
  await connectToDatabase()
  await Task.updateOne({ _id: taskId }, { $set: { archived: true } })
  revalidatePath('/')
}

export async function unarchiveTask(taskId: string) {
  await connectToDatabase()
  await Task.updateOne({ _id: taskId }, { $set: { archived: false } })
  revalidatePath('/')
}

export async function deleteTask(taskId: string) {
  await connectToDatabase()
  await Task.deleteOne({ _id: taskId })
  revalidatePath('/')
}
