'use client'

import { useState } from 'react'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
  onUnarchive: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export default function ArchivedSection({ tasks, onUnarchive, onDelete }: Props) {
  const [open, setOpen] = useState(false)

  if (tasks.length === 0) return null

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        Archived ({tasks.length})
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {tasks.map((task) => {
            const total = task.subtasks.length
            const done = task.subtasks.filter((s) => s.done).length
            const progress = total === 0 ? 0 : Math.round((done / total) * 100)

            return (
              <div key={task._id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-500 line-through">{task.title}</h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{done}/{total} subtasks</span>
                      <span>·</span>
                      <span>{progress}% complete</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => onUnarchive(task._id)}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this task permanently?')) onDelete(task._id) }}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
