import TaskBoard from '@/components/TaskBoard'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <TaskBoard />
      </div>
    </main>
  )
}
