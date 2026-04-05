'use client'

import { useRef, useState } from 'react'

interface Props {
  onClose: () => void
  onCreate: (title: string, description: string, subtasks: string[]) => void
}

export default function AddTaskModal({ onClose, onCreate }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = (data.get('title') as string).trim()
    if (!title) { setError('Title is required'); return }

    const description = (data.get('description') as string).trim()
    const subtasks = (data.get('subtasks') as string)
      .split('\n').map((s) => s.trim()).filter(Boolean)

    onCreate(title, description, subtasks)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold text-gray-800">New Task</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              placeholder="Task title"
              onChange={() => setError('')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={2}
              placeholder="Optional description"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subtasks <span className="text-gray-400 text-xs">(one per line)</span>
            </label>
            <textarea
              name="subtasks"
              rows={4}
              placeholder={"Design mockup\nWrite backend API\nDeploy"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
