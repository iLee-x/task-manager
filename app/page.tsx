export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getTasks, getArchivedTasks } from '@/app/actions'
import TaskBoard from '@/components/TaskBoard'

export default async function HomePage() {
  const [tasks, archivedTasks] = await Promise.all([getTasks(), getArchivedTasks()])

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Suspense>
          <TaskBoard tasks={tasks} archivedTasks={archivedTasks} />
        </Suspense>
      </div>
    </main>
  )
}
