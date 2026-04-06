import TaskBoard from '@/components/TaskBoard'

export default function Home() {
  return (
    <main className="flex-1 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <TaskBoard />
      </div>
    </main>
  )
}
