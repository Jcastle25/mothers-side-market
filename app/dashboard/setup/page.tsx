'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { setupCreator } from '@/app/actions/setup'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(61,35,20,0.22)',
  background: '#FAF6F0',
  color: '#3D2314',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

const TEXTAREA_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  resize: 'vertical',
  minHeight: '100px',
}

export default function SetupPage() {
  const [state, action, pending] = useActionState(setupCreator, undefined)

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '66px',
        background: 'rgba(250,246,240,0.94)',
        borderBottom: '1px solid rgba(61,35,20,0.12)',
      }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#3D2314', textDecoration: 'none' }}>
          🌿 Mother&apos;s Side Market
        </Link>
        <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#3D2314', fontWeight: 500 }}>Log in</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '520px', margin: '64px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● Set up your storefront
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', fontWeight: 500, lineHeight: 1.1, color: '#3D2314', marginBottom: '8px' }}>
            Let&apos;s set up your storefront
          </h1>
          <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.6 }}>
            Create your creator profile to start selling digital and physical homeschool resources. This only takes a minute.
          </p>
        </div>

        {state?.error && (
          <div style={{ background: 'rgba(200,80,50,0.07)', border: '1px solid rgba(200,80,50,0.25)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#8B2500', lineHeight: 1.5 }}>
            {state.error}
          </div>
        )}

        <form action={action} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D2314', marginBottom: '6px', letterSpacing: '0.03em' }}>
              Store name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Bright Beginnings Co."
              required
              style={INPUT_STYLE}
            />
          </div>

          <div>
            <label htmlFor="bio" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D2314', marginBottom: '6px', letterSpacing: '0.03em' }}>
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell families about your homeschool journey and what you create."
              rows={4}
              style={TEXTAREA_STYLE}
            />
          </div>

          <div>
            <label htmlFor="profile_image" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#3D2314', marginBottom: '6px', letterSpacing: '0.03em' }}>
              Profile image (optional)
            </label>
            <input
              id="profile_image"
              name="profile_image"
              type="file"
              accept="image/*"
              style={{ ...INPUT_STYLE, padding: '8px 14px' }}
            />
            <div style={{ fontSize: '11px', color: '#7A4A2E', marginTop: '4px' }}>
              Upload a photo or logo for your storefront. JPG, PNG up to 5MB.
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            style={{ marginTop: '8px', padding: '14px', borderRadius: '100px', border: 'none', background: pending ? 'rgba(61,35,20,0.4)' : '#3D2314', color: '#FAF6F0', fontSize: '14px', fontFamily: 'inherit', cursor: pending ? 'not-allowed' : 'pointer', fontWeight: 500 }}
          >
            {pending ? 'Setting up…' : 'Create my storefront'}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>
            Skip for now
          </Link>
        </div>
      </div>
    </main>
  )
}