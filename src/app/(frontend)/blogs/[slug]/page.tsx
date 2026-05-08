import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 2,
  })

  if (blogs.docs.length === 0) notFound()

  const blog = blogs.docs[0]
  const author = typeof blog.author === 'object' ? blog.author : null

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
            href="/"
            style={{ color: 'white', fontWeight: '700', fontSize: '18px', textDecoration: 'none' }}
          >
            BlogSphere
          </Link>
        </div>
        <Link href="/" style={{ color: '#94a3b8', fontSize: '14px', textDecoration: 'none' }}>
          ← Back to blogs
        </Link>
      </nav>

      {/* Cover */}
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '48px 32px',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <span
              style={{
                backgroundColor: '#dcfce7',
                color: '#166534',
                fontSize: '12px',
                padding: '3px 12px',
                borderRadius: '20px',
              }}
            >
              Published
            </span>
          </div>
          <h1
            style={{
              color: 'white',
              fontSize: '36px',
              fontWeight: '800',
              margin: '0 0 16px',
              lineHeight: '1.2',
            }}
          >
            {blog.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
                  {author?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: '0' }}>
                  {author?.name || 'Unknown'}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0' }}>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Cover Image */}
        {typeof blog.coverImage === 'object' && blog.coverImage?.url && (
          <img
            src={blog.coverImage.url}
            alt={blog.title}
            style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: '24px',
              maxHeight: '420px',
              objectFit: 'cover',
            }}
          />
        )}

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151',
            }}
          >
            <RichText data={blog.content} />
          </div>
        </div>

        {/* Author card */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              backgroundColor: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ color: 'white', fontWeight: '700', fontSize: '20px' }}>
              {author?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px' }}>
              Written by {author?.name || 'Unknown'}
            </p>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0' }}>Author on BlogSphere</p>
          </div>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            ← Read more blogs
          </Link>
        </div>
      </main>
    </div>
  )
}
