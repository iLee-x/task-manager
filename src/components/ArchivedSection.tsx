import { useState } from 'react'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '@/store'
import { unarchiveTask, deleteTask } from '@/store/tasksSlice'
import type { Task } from '@/types'

interface Props {
  tasks: Task[]
}

export default function ArchivedSection({ tasks }: Props) {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)

  if (tasks.length === 0) return null

  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm font-medium text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
      >
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        Archived tasks
        <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400">{tasks.length}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {tasks.map((task) => {
            const total = task.subtasks.length
            const done = task.subtasks.filter((s) => s.done).length
            return (
              <div key={task._id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-400 line-through">{task.title}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{done}/{total} subtasks completed</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => dispatch(unarchiveTask(task._id))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete permanently?')) dispatch(deleteTask(task._id)) }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-400 hover:border-red-200 hover:text-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
