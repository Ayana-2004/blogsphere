import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import SearchFilter from './SearchFilter'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const { search } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const where: any = {
    status: { equals: 'published' },
  }

  if (search) {
    where.or = [
      {
        title: {
          contains: search,
        },
      },
      {
        slug: {
          contains: search,
        },
      },
    ]
  }
  const blogs = await payload.find({ collection: 'blogs', where, limit: 12 })

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
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>BlogSphere</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#94a3b8', fontSize: '14px' }}>
            Login
          </Link>
          <Link
            href="/signup"
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '14px',
            }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          backgroundColor: '#1e293b',
          padding: '64px 32px',
          textAlign: 'center',
          borderBottom: '1px solid #334155',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            backgroundColor: '#1d4ed8',
            color: '#bfdbfe',
            fontSize: '12px',
            padding: '4px 14px',
            borderRadius: '20px',
            marginBottom: '16px',
          }}
        >
          New posts every week ✨
        </div>
        <h1 style={{ color: 'white', fontSize: '40px', fontWeight: '800', margin: '0 0 12px' }}>
          Welcome to BlogSphere
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '16px', margin: '0 0 24px' }}>
          Discover amazing stories and share your own
        </p>
        <Link
          href="/signup"
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
          }}
        >
          Start Writing →
        </Link>
      </div>

      {/* Search */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px 32px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <SearchFilter categories={[]} />
        </div>
      </div>

      {/* Blog listing */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#1e293b' }}>
          {search ? `Results for "${search}"` : 'Latest Posts'}
        </h2>

        {blogs.docs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <p style={{ fontSize: '18px' }}>No blogs found.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {blogs.docs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      height: '180px',
                      overflow: 'hidden',
                      backgroundColor: '#dbeafe',
                    }}
                  >
                    {typeof blog.coverImage === 'object' && blog.coverImage?.url ? (
                      <img
                        src={blog.coverImage.url}
                        alt={blog.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '40px' }}>📝</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span
                        style={{
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          fontSize: '11px',
                          padding: '2px 10px',
                          borderRadius: '20px',
                        }}
                      >
                        Published
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#1e293b',
                        margin: '0 0 6px',
                      }}
                    >
                      {blog.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0' }}>/{blog.slug}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#1e293b',
          padding: '24px 32px',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <p style={{ color: '#64748b', fontSize: '13px' }}>
          © 2026 BlogSphere. Built with Next.js & Payload CMS
        </p>
      </footer>
    </div>
  )
}
