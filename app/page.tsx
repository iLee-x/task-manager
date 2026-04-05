import TaskBoard from '@/components/TaskBoard'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <TaskBoard />
      </div>
    </main>
  )
}
