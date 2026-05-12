import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(request: Request) {
  const body = await request.json()
  const productId = (body.productId as string)?.trim()

  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to checkout.' }, { status: 401 })
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, title, description, price, product_type, shipping_price, shipping_description, creator_id')
    .eq('id', productId)
    .single()

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 })
  }

  if (product.product_type !== 'digital' && (product.shipping_price === null || product.shipping_price === undefined)) {
    return NextResponse.json({ error: 'This physical product is missing shipping pricing.' }, { status: 400 })
  }

  const lineItem = {
    price_data: {
      currency: 'usd',
      unit_amount: product.price,
      product_data: {
        name: product.title,
        description: product.description,
      },
    },
    quantity: 1,
  }

  const sessionPayload: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [lineItem],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
    metadata: {
      product_id: product.id,
      buyer_id: user.id,
    },
  }

  if (product.product_type !== 'digital') {
    sessionPayload.shipping_address_collection = {
      allowed_countries: ['US'],
    }
    sessionPayload.shipping_options = [
      {
        shipping_rate_data: {
          display_name: product.shipping_description || 'Shipping',
          type: 'fixed_amount',
          fixed_amount: {
            amount: product.shipping_price ?? 0,
            currency: 'usd',
          },
        },
      },
    ]
  }

  const { data: creator } = await supabase
    .from('creators')
    .select('stripe_account_id')
    .eq('id', product.creator_id)
    .limit(1)
    .single()

  if (creator?.stripe_account_id) {
    sessionPayload.payment_intent_data = {
      application_fee_amount: Math.round(product.price * 0.1),
      transfer_data: {
        destination: creator.stripe_account_id,
      },
    }
  }

  const session = await stripe.checkout.sessions.create(sessionPayload)

  return NextResponse.json({ sessionId: session.id })
}
