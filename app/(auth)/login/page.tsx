'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/actions/auth'

const NAV_STYLE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 48px', height: '66px',
  background: 'rgba(250,246,240,0.94)',
  borderBottom: '1px solid rgba(61,35,20,0.12)',
  position: 'sticky', top: 0, zIndex: 100,
}

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={NAV_STYLE}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#3D2314', textDecoration: 'none' }}>
          🌿 Mother Side Market
        </Link>
        <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
          New here?{' '}
          <Link href="/signup" style={{ color: '#3D2314', fontWeight: 500 }}>Create account</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '440px', margin: '64px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● Welcome back
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 500, lineHeight: 1.1, color: '#3D2314', marginBottom: '8px' }}>
            Log in to your account
          </h1>
          <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.6 }}>
            Good to see you again.
          </p>
        </div>

        {state?.error && (
          <div style={{ background: 'rgba(200,80,50,0.07)', border: '1px solid rgba(200,80,50,0.25)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#8B2500', lineHeight: 1.5 }}>
            {state.error}
          </div>
        )}

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D2314', marginBottom: '6px', letterSpacing: '0.03em' }}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(61,35,20,0.22)', background: '#FAF6F0', color: '#3D2314', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <label htmlFor="password" style={{ fontSize: '12px', fontWeight: 500, color: '#3D2314', letterSpacing: '0.03em' }}>
                Password
              </label>
              <Link href="#" style={{ fontSize: '11px', color: '#7A4A2E' }}>Forgot password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Your password"
              required
              style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid rgba(61,35,20,0.22)', background: '#FAF6F0', color: '#3D2314', fontSize: '14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            style={{ marginTop: '4px', padding: '13px', borderRadius: '100px', border: 'none', background: pending ? 'rgba(61,35,20,0.4)' : '#3D2314', color: '#FAF6F0', fontSize: '13px', fontFamily: 'inherit', cursor: pending ? 'not-allowed' : 'pointer', fontWeight: 500 }}
          >
            {pending ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link href="/signup" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>
            Don&apos;t have an account?{' '}
            <span style={{ color: '#3D2314', fontWeight: 500 }}>Sign up free</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
