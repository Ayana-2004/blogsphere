import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import LogoutButton from './LogoutButton'
import Link from 'next/link'

export default async function DashboardPage() {
  const headersList = await headers()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/login')

  const allBlogs = await payload.find({
    collection: 'blogs',
    where: { author: { equals: user.id } },
  })

  const published = allBlogs.docs.filter((b) => b.status === 'published').length
  const drafts = allBlogs.docs.filter((b) => b.status === 'draft').length

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
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>BlogSphere</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>{user.name}</span>
          <LogoutButton />
        </div>
      </nav>

      <div
        style={{ backgroundColor: '#1e293b', padding: '32px', borderBottom: '1px solid #334155' }}
      >
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: '0 0 4px' }}>
          Welcome back, {user.name}! 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0' }}>
          Manage your blogs and track your progress
        </p>
      </div>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Total Blogs</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#3b82f6', margin: '0' }}>
              {allBlogs.totalDocs}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Published</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#22c55e', margin: '0' }}>
              {published}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px' }}>Drafts</p>
            <p style={{ fontSize: '32px', fontWeight: '800', color: '#f59e0b', margin: '0' }}>
              {drafts}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/dashboard/blogs/create"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              + Create New Blog
            </Link>
            <Link
              href="/dashboard/blogs"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Manage Blogs
            </Link>
            <Link
              href="/dashboard/profile"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              Profile Settings
            </Link>
            <Link
              href="/"
              style={{
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
              }}
            >
              View Blog →
            </Link>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px' }}>
            Recent Blogs
          </h2>
          {allBlogs.docs.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '14px' }}>
              No blogs yet. Create your first one!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allBlogs.docs.slice(0, 5).map((blog) => (
                <div
                  key={blog.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        margin: '0 0 2px',
                      }}
                    >
                      {blog.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>/{blog.slug}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: blog.status === 'published' ? '#dcfce7' : '#fef9c3',
                        color: blog.status === 'published' ? '#166534' : '#854d0e',
                      }}
                    >
                      {blog.status}
                    </span>
                    <Link
                      href={`/dashboard/blogs/edit/${blog.id}`}
                      style={{ fontSize: '12px', color: '#3b82f6', textDecoration: 'none' }}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
