'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-gray-800">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-red-500">{error.message}</p>
      {error.digest && (
        <p className="mt-1 text-xs text-gray-400">Error ID: {error.digest}</p>
      )}
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try again
      </button>
    </main>
  )
}
