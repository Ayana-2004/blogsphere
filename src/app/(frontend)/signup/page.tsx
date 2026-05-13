'use client' // Makes this a client-side component in Next.js

// React hook for managing state
import { useState } from 'react'

// React Hook Form for form handling
import { useForm } from 'react-hook-form'

// Connects Zod validation with React Hook Form
import { zodResolver } from '@hookform/resolvers/zod'

// Zod library for schema validation
import { z } from 'zod'

// Next.js router for page navigation
import { useRouter } from 'next/navigation'

// Next.js Link component for navigation without page reload
import Link from 'next/link'

// Validation schema using Zod
const signupSchema = z.object({
  // Name must contain minimum 2 characters
  name: z.string().min(2, 'Name must be at least 2 characters'),

  // Email must be valid format
  email: z.string().email('Please enter a valid email'),

  // Password must contain minimum 6 characters
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Automatically creates TypeScript type from schema
type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  // Used for page redirection
  const router = useRouter()

  // Stores error messages
  const [error, setError] = useState('')

  // Stores loading state
  const [loading, setLoading] = useState(false)

  // Initialize React Hook Form
  const {
    register, // Connects inputs with form
    handleSubmit, // Handles form submission
    formState: { errors }, // Contains validation errors
  } = useForm<SignupForm>({
    // Connect Zod validation
    resolver: zodResolver(signupSchema),
  })

  // Function runs when form is submitted
  const onSubmit = async (data: SignupForm) => {
    // Start loading
    setLoading(true)

    // Clear old errors
    setError('')

    try {
      // Send POST request to create user
      const res = await fetch('/api/users', {
        method: 'POST',

        // Sending JSON data
        headers: { 'Content-Type': 'application/json' },

        // Convert form data into JSON
        body: JSON.stringify(data),

        // Include authentication cookies/session
        credentials: 'include',
      })

      // If signup fails
      if (!res.ok) {
        setError('Email already exists or something went wrong')
        return
      }

      // Redirect user to dashboard after successful signup
      router.push('/dashboard')
    } catch {
      // Handle unexpected errors
      setError('Something went wrong')
    } finally {
      // Stop loading in all cases
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        // Full screen height
        minHeight: '100vh',

        // Background color
        backgroundColor: '#f8fafc',

        // Flex layout
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Navbar Section */}
      <nav
        style={{
          backgroundColor: '#1e293b',
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Logo Box */}
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
            {/* Logo Text */}
            <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>B</span>
          </div>

          {/* Navigate to Home Page */}
          <Link
            href="/"
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: '18px',
              textDecoration: 'none',
            }}
          >
            BlogSphere
          </Link>
        </div>
      </nav>

      {/* Main Form Container */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 16px',
        }}
      >
        {/* Signup Card */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '40px',
            width: '100%',
            maxWidth: '420px',
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            {/* Large Logo */}
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#3b82f6',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px',
              }}
            >
              <span style={{ color: 'white', fontWeight: '700', fontSize: '22px' }}>B</span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 4px',
              }}
            >
              Create account
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>Join BlogSphere today</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label>Name</label>

              {/* Name Input */}
              <input {...register('name')} type="text" placeholder="Your full name" />

              {/* Show name validation error */}
              {errors.name && <p>{errors.name.message}</p>}
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label>Email</label>

              {/* Email Input */}
              <input {...register('email')} type="email" placeholder="you@example.com" />

              {/* Show email validation error */}
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label>Password</label>

              {/* Password Input */}
              <input {...register('password')} type="password" placeholder="••••••••" />

              {/* Show password validation error */}
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            {/* Global Error Message */}
            {error && (
              <div>
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              // Disable button while loading
              disabled={loading}
            >
              {/* Dynamic button text */}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Redirect */}
          <p>
            Already have an account? {/* Navigate to login page */}
            <Link href="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
