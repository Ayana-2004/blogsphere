'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data?.errors?.[0]?.message || 'Failed to delete. Please try again.')
        return
      }

      router.refresh()
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}
