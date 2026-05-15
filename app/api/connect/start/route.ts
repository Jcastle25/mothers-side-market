import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  try {
    // Verify the user is logged in
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get the creator record
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id, stripe_account_id')
      .eq('user_id', user.id)
      .single()

    if (creatorError || !creator) {
      return NextResponse.json({ error: 'Creator profile not found' }, { status: 404 })
    }

    let accountId = creator.stripe_account_id

    // If they don't have a Stripe account yet, create one
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          creator_id: creator.id,
          user_id: user.id,
        },
      })

      accountId = account.id

      // Save the Stripe account ID to the database immediately
      const { error: updateError } = await supabase
        .from('creators')
        .update({ stripe_account_id: accountId })
        .eq('id', creator.id)

      if (updateError) {
        console.error('Failed to save stripe_account_id:', updateError)
        return NextResponse.json({ error: 'Failed to save account' }, { status: 500 })
      }
    }

    // Create the onboarding link (this is what the creator clicks)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${siteUrl}/api/connect/start`,
      return_url: `${siteUrl}/api/connect/return`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error('Stripe Connect error:', error)
    return NextResponse.json({ error: 'Failed to create onboarding link' }, { status: 500 })
  }
}