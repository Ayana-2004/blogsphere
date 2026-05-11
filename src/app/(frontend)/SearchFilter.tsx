'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchFilter({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [isPending, startTransition] = useTransition()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    router.push(`/?${params.toString()}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    // live search after 500ms delay
    startTransition(() => {
      const params = new URLSearchParams()
      if (value) params.set('search', value)
      router.push(`/?${params.toString()}`)
    })
  }

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          placeholder="Search blogs..."
          style={{
            width: '100%',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {isPending && (
          <span
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#94a3b8',
            }}
          >
            Searching...
          </span>
        )}
      </div>
      <button
        type="submit"
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        Search
      </button>
      {search && (
        <button
          type="button"
          onClick={() => {
            setSearch('')
            router.push('/')
          }}
          style={{
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            color: '#64748b',
          }}
        >
          Clear
        </button>
      )}
    </form>
  )
}
