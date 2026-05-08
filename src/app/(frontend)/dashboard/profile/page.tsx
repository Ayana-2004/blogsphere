import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const headersList = await headers()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <a href="/dashboard" className="text-xl font-bold text-blue-600">
          BlogSphere
        </a>
        <a href="/dashboard" className="text-gray-600 hover:text-gray-800">
          ← Back to Dashboard
        </a>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
        <ProfileForm user={{ id: user.id, name: user.name, email: user.email }} />
      </main>
    </div>
  )
}
