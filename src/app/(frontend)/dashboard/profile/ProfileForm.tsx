'use client'

import { useState } from 'react'

export default function ProfileForm({
  user,
}: {
  user: { id: string; name: string; email: string }
}) {
  const [name, setName] = useState(user.name)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name }),
    })

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          value={user.email}
          disabled
          className="w-full border rounded-md px-3 py-2 bg-gray-50 text-gray-500"
        />
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {success && <p className="text-green-600 text-sm">Profile updated successfully!</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
