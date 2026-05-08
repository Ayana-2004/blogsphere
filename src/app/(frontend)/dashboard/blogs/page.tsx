import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import DeleteButton from './DeleteButton'

import Link from 'next/link'

export default async function ManageBlogsPage() {
  const headersList = await headers()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/login')

  const blogs = await payload.find({
    collection: 'blogs',
    where: { author: { equals: user.id } },
  })

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
          href="/dashboard/blogs/create"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          + Create New Blog
        </Link>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: '0' }}>
            My Blogs
          </h1>
          <span style={{ fontSize: '14px', color: '#64748b' }}>
            {blogs.totalDocs} blog{blogs.totalDocs !== 1 ? 's' : ''}
          </span>
        </div>

        {blogs.docs.length === 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '48px', margin: '0 0 16px' }}>📝</p>
            <h2
              style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px' }}
            >
              No blogs yet!
            </h2>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
              Start writing your first blog post
            </p>
            <Link
              href="/dashboard/blogs/create"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Create your first blog
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blogs.docs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px',
                    }}
                  >
                    <h3
                      style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0' }}
                    >
                      {blog.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        backgroundColor: blog.status === 'published' ? '#dcfce7' : '#fef9c3',
                        color: blog.status === 'published' ? '#166534' : '#854d0e',
                      }}
                    >
                      {blog.status === 'published' ? '🌐 Published' : '📝 Draft'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '0' }}>/{blog.slug}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    style={{
                      fontSize: '13px',
                      color: '#3b82f6',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #bfdbfe',
                      textDecoration: 'none',
                    }}
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/blogs/edit/${blog.id}`}
                    style={{
                      fontSize: '13px',
                      color: '#1e293b',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      textDecoration: 'none',
                    }}
                  >
                    Edit
                  </Link>
                  <DeleteButton id={blog.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Link
            href="/dashboard"
            style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none' }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
