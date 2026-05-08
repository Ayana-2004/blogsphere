'use client'

import { useRouter } from 'next/navigation'

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog?')) return

    await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
    >
      Delete
    </button>
  )
}
