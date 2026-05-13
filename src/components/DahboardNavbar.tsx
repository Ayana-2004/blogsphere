'use client'

import Link from 'next/link'
import LogoutButton from '@/app/(frontend)/dashboard/LogoutButton'

export default function DashboardNavbar() {
  return (
    <nav
      style={{
        backgroundColor: '#1e293b',
        padding: '14px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Logo */}
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
          <span style={{ color: 'white', fontWeight: '700' }}>B</span>
        </div>

        <Link
          href="/dashboard"
          style={{
            color: 'white',
            fontWeight: '700',
            textDecoration: 'none',
            fontSize: '18px',
          }}
        >
          BlogSphere
        </Link>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
          Dashboard
        </Link>

        <Link href="/dashboard/blogs" style={{ color: 'white', textDecoration: 'none' }}>
          My Blogs
        </Link>

        <Link href="/dashboard/blogs/create" style={{ color: 'white', textDecoration: 'none' }}>
          Create Blog
        </Link>
        <LogoutButton />
      </div>
    </nav>
  )
}
