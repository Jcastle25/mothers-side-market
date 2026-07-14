import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) return NextResponse.redirect(new URL('/dashboard?sub=error', siteUrl))

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/login', siteUrl))

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    const subscription = session.subscription as Stripe.Subscription | null
    if (!subscription || subscription.status !== 'active') {
      return NextResponse.redirect(new URL('/dashboard?sub=incomplete', siteUrl))
    }

    const creatorId = session.metadata?.creator_id
    if (creatorId) {
      const db = createServiceClient()
      await db.from('creators').update({
        stripe_sub_id: subscription.id,
        plan_type: 'paid',
      }).eq('id', creatorId)
    }

    return NextResponse.redirect(new URL('/dashboard?sub=success', siteUrl))
  } catch (err) {
    console.error('[Subscribe return]', err)
    return NextResponse.redirect(new URL('/dashboard?sub=error', siteUrl))
  }
}
