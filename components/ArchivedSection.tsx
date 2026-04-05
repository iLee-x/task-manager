'use client'

import { useState, useTransition } from 'react'
import { unarchiveTask, deleteTask } from '@/app/actions'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
}

export default function ArchivedSection({ tasks }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (tasks.length === 0) return null

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
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
              <div
                key={task._id}
                className={`rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-opacity ${isPending ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-500 line-through">
                      {task.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span>{done}/{total} subtasks</span>
                      <span>·</span>
                      <span>{progress}% complete</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => startTransition(() => unarchiveTask(task._id))}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-white"
                    >
                      Restore
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this task permanently?')) {
                          startTransition(() => deleteTask(task._id))
                        }
                      }}
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
