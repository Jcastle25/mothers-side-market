import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    }

    // Get the creator's Stripe account ID
    const { data: creator } = await supabase
      .from('creators')
      .select('id, stripe_account_id')
      .eq('user_id', user.id)
      .single()

    if (!creator || !creator.stripe_account_id) {
      return NextResponse.redirect(new URL('/dashboard?stripe=error', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
    }

    // Check the account status with Stripe
    const account = await stripe.accounts.retrieve(creator.stripe_account_id)

    const isComplete =
      account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    if (isComplete) {
      return NextResponse.redirect(new URL('/dashboard?stripe=success', siteUrl))
    } else {
      return NextResponse.redirect(new URL('/dashboard?stripe=incomplete', siteUrl))
    }
  } catch (error) {
    console.error('Stripe return error:', error)
    return NextResponse.redirect(new URL('/dashboard?stripe=error', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  }
}
