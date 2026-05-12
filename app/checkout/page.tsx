'use client'

import { FormEvent, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const FIELD_STYLE: React.CSSProperties = {
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

export default function CheckoutPage() {
  const [productId, setProductId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryId = params.get('productId')
    if (queryId) setProductId(queryId)
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })

    const result = await response.json()
    setPending(false)

    if (!response.ok) {
      setError(result.error || 'Unable to create checkout session.')
      return
    }

    const stripe = (await stripePromise) as any
    if (!stripe) {
      setError('Stripe failed to load.')
      return
    }

    const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: result.sessionId })
    if (stripeError) {
      setError(stripeError.message)
    }
  }

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <div style={{ maxWidth: '680px', margin: '64px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● Checkout
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
            Purchase a product
          </h1>
          <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.6 }}>
            Enter the product ID to begin checkout. Physical items will collect shipping address and add shipping cost automatically.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(200,80,50,0.07)', border: '1px solid rgba(200,80,50,0.25)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#8B2500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
            Product ID
            <input
              value={productId}
              onChange={(event) => setProductId(event.target.value)}
              placeholder="Enter the Supabase product ID"
              required
              style={FIELD_STYLE}
            />
          </label>
          {productId && (
            <div style={{ fontSize: '12px', color: '#7A4A2E' }}>Using product ID <strong>{productId}</strong></div>
          )}

          <button
            type="submit"
            disabled={pending}
            style={{ padding: '14px 22px', borderRadius: '100px', border: 'none', background: pending ? 'rgba(61,35,20,0.4)' : '#3D2314', color: '#FAF6F0', cursor: pending ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            {pending ? 'Preparing checkout…' : 'Start checkout'}
          </button>
        </form>
      </div>
    </main>
  )
}
