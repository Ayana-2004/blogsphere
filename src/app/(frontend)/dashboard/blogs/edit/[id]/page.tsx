'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
  })

  useEffect(() => {
    fetch(`/api/blogs/${id}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          content: typeof data.content === 'string' ? data.content : '',
          status: data.status || 'draft',
        })
        if (data.coverImage?.url) {
          setImagePreview(data.coverImage.url)
        }
      })
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', 'blogsphere_uploads')
      const res = await fetch(`https://api.cloudinary.com/v1_1/dkkf4schl/image/upload`, {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        const data = await res.json()
        return data.secure_url
      }
      return null
    } catch {
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let coverImageId = null
      if (imageFile) {
        coverImageId = await uploadImage()
      }

      const blogData: any = { ...form }
      if (coverImageId) blogData.coverImageUrl = coverImageId
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(blogData),
      })

      if (res.ok) router.push('/dashboard/blogs')
      else alert('Failed to update blog')
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
          href="/dashboard/blogs"
          style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}
        >
          ← Back to Blogs
        </Link>
      </nav>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0 0 24px' }}>
          Edit Blog
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
              required
              style={{ ...inputStyle, backgroundColor: '#f8fafc', color: '#64748b' }}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label style={labelStyle}>Cover Image</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f8fafc',
              }}
            >
              {imagePreview ? (
                <div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0' }}>
                    Click to change image
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '32px', margin: '0 0 8px' }}>🖼️</p>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      margin: '0 0 4px',
                    }}
                  >
                    Click to upload cover image
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0' }}>
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
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
              disabled={loading || uploadingImage}
              style={{
                flex: 1,
                backgroundColor: loading || uploadingImage ? '#93c5fd' : '#3b82f6',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                border: 'none',
                cursor: loading || uploadingImage ? 'not-allowed' : 'pointer',
              }}
            >
              {uploadingImage
                ? '📤 Uploading image...'
                : loading
                  ? 'Updating...'
                  : '✅ Update Blog'}
            </button>
            <Link
              href="/dashboard/blogs"
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
