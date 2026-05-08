'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState('')
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: 'draft' })

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserId(data.user?.id || data.id))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && {
        slug: value
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, ''),
      }),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, author: userId }),
      })
      if (res.ok) router.push('/dashboard/blogs')
      else alert('Failed to create blog')
    } catch {
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  }
  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: '6px',
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: '#1e293b',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>B</span>
          </div>
          <Link
            href="/dashboard"
            style={{ color: 'white', fontWeight: '700', fontSize: '18px', textDecoration: 'none' }}
          >
            BlogSphere
          </Link>
        </div>
        <Link
          href="/dashboard"
          style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}
        >
          ← Back to Dashboard
        </Link>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px' }}>
          Create New Blog
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <label style={labelStyle}>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My awesome blog post"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="my-awesome-blog-post"
              required
              style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b' }}
            />
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Auto-generated from title
            </p>
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your blog content here..."
              rows={10}
              required
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
              <option value="draft">📝 Draft</option>
              <option value="published">🌐 Published</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: loading ? '#93c5fd' : '#3b82f6',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Creating...' : '🚀 Publish Blog'}
            </button>
            <Link
              href="/dashboard"
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '15px',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
