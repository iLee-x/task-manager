'use client'

import { useState } from 'react'
import TaskCard from '@/components/TaskCard'
import AddTaskModal from '@/components/AddTaskModal'
import ArchivedSection from '@/components/ArchivedSection'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  archivedTasks: Task[]
}

export default function TaskBoard({ tasks, archivedTasks }: Props) {
  const [showModal, setShowModal] = useState(false)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => {
    if (t.subtasks.length === 0) return false
    return t.subtasks.every((s) => s.done)
  }).length
  const overallProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            {completedTasks}/{totalTasks} tasks complete
          </p>
          {totalTasks > 0 && (
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
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
          <svg className="mb-3 h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium text-gray-400">No tasks yet</p>
          <p className="mt-1 text-xs text-gray-300">Click &ldquo;New Task&rdquo; to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}

      {/* Archived */}
      <ArchivedSection tasks={archivedTasks} />

      {/* Modal */}
      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </>
  )
}
