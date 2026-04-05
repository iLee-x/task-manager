'use client'

import { useState, useEffect } from 'react'
import TaskCard from '@/components/TaskCard'
import AddTaskModal from '@/components/AddTaskModal'
import ArchivedSection from '@/components/ArchivedSection'
import type { Task } from '@/types'

const STORAGE_KEY = 'task-manager-tasks'

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function newId() {
  return crypto.randomUUID()
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTasks(loadTasks())
    setMounted(true)
  }, [])

  function update(next: Task[]) {
    setTasks(next)
    saveTasks(next)
  }

  function handleCreate(title: string, description: string, subtitleLines: string[]) {
    const task: Task = {
      _id: newId(),
      title,
      description,
      subtasks: subtitleLines.map((t) => ({ _id: newId(), title: t, done: false })),
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    update([task, ...tasks])
  }

  function handleToggleSubtask(taskId: string, subtaskId: string) {
    update(
      tasks.map((t) =>
        t._id !== taskId
          ? t
          : { ...t, subtasks: t.subtasks.map((s) => s._id === subtaskId ? { ...s, done: !s.done } : s) }
      )
    )
  }

  function handleAddSubtask(taskId: string, title: string) {
    update(
      tasks.map((t) =>
        t._id !== taskId
          ? t
          : { ...t, subtasks: [...t.subtasks, { _id: newId(), title, done: false }] }
      )
    )
  }

  function handleArchive(taskId: string) {
    update(tasks.map((t) => t._id === taskId ? { ...t, archived: true } : t))
  }

  function handleUnarchive(taskId: string) {
    update(tasks.map((t) => t._id === taskId ? { ...t, archived: false } : t))
  }

  function handleDelete(taskId: string) {
    update(tasks.filter((t) => t._id !== taskId))
  }

  const active = tasks.filter((t) => !t.archived)
  const archived = tasks.filter((t) => t.archived)

  const completedTasks = active.filter(
    (t) => t.subtasks.length > 0 && t.subtasks.every((s) => s.done)
  ).length
  const overallProgress =
    active.length === 0 ? 0 : Math.round((completedTasks / active.length) * 100)

  if (!mounted) return null

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            {completedTasks}/{active.length} tasks complete
          </p>
          {active.length > 0 && (
            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-xs font-medium text-blue-600">{overallProgress}%</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 active:scale-95 transition-transform"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Task list */}
      {active.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
          <svg className="mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium text-gray-400">No tasks yet</p>
          <p className="mt-1 text-xs text-gray-300">Click &ldquo;New Task&rdquo; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleSubtask={handleToggleSubtask}
              onAddSubtask={handleAddSubtask}
              onArchive={handleArchive}
            />
          ))}
        </div>
      )}

      <ArchivedSection
        tasks={archived}
        onUnarchive={handleUnarchive}
        onDelete={handleDelete}
      />

      {showModal && (
        <AddTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </>
  )
}
