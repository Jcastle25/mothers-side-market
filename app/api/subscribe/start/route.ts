import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: creator } = await supabase
    .from('creators')
    .select('id, stripe_sub_id')
    .eq('user_id', user.id)
    .single()

  if (!creator) return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID
  if (!priceId) return NextResponse.json({ error: 'Subscription price not configured' }, { status: 500 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/api/subscribe/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/dashboard?sub=cancelled`,
    customer_email: user.email,
    metadata: { creator_id: creator.id },
    subscription_data: {
      metadata: { creator_id: creator.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
