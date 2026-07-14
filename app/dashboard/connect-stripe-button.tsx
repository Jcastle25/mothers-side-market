'use client'

import { useState } from 'react'

export default function ConnectStripeButton({ label = 'Connect Stripe' }: { label?: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/connect/start', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to start onboarding')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div style={{ flexShrink: 0 }}>
      <button
        onClick={handleConnect}
        disabled={loading}
        style={{
          padding: '10px 20px', borderRadius: '100px',
          background: loading ? '#7A4A2E' : '#3D2314',
          color: '#FAF6F0', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px', opacity: loading ? 0.7 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? 'Loading...' : label}
      </button>
      {error && <div style={{ marginTop: '8px', fontSize: '12px', color: '#8B2500' }}>{error}</div>}
    </div>
  )
}
