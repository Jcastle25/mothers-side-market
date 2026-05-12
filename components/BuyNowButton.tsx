'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BuyNowButtonProps {
  productId: string
  disabled?: boolean
  children: React.ReactNode
}

export default function BuyNowButton({ productId, disabled = false, children }: BuyNowButtonProps) {
  const [pending, setPending] = useState(false)

  async function handleCheckout() {
    if (disabled) return

    setPending(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Unable to create checkout session.')
        return
      }

      if (result.url) { window.location.href = result.url; return }
       const stripe = await stripePromise
      if (!stripe) {
        alert('Stripe failed to load.')
        return
      }

      const { error } = await (stripe as any).redirectToCheckout({ sessionId: result.sessionId })
      if (error) {
        alert(error.message)
      }
    } catch (error) {
      alert('An error occurred during checkout.')
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={handleCheckout}
      style={{
        width: '100%',
        padding: '14px 20px',
        borderRadius: '100px',
        border: 'none',
        background: disabled || pending ? 'rgba(61,35,20,0.2)' : '#3D2314',
        color: '#FAF6F0',
        cursor: disabled || pending ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        fontWeight: 600
      }}
    >
      {pending ? 'Processing...' : children}
    </button>
  )
}