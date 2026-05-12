import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServiceClient } from '@/lib/supabase/service'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new NextResponse('Missing Stripe signature', { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    return new NextResponse('Webhook signature mismatch', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = session.metadata?.product_id as string | undefined
    const buyerId = session.metadata?.buyer_id as string | undefined

    if (!productId || !buyerId) {
      return new NextResponse('Missing checkout metadata', { status: 400 })
    }

    const db = createServiceClient()
    const { data: product, error: productError } = await db
      .from('products')
      .select('id, price, product_type, shipping_price, file_url, stock_quantity')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return new NextResponse('Product lookup failed', { status: 400 })
    }

    const shippingAddress = (session as any).shipping_details?.address ?? null
    const shippingStatus = shippingAddress ? 'pending' : 'not_applicable'

    const { data: insertOrder, error: orderError } = await db.from('orders').insert([
      {
        buyer_id: buyerId,
        product_id: product.id,
        amount_cents: session.amount_total ?? product.price,
        platform_fee_cents: Math.round(product.price * 0.1),
        stripe_payment_id: session.payment_intent?.toString(),
        shipping_address: shippingAddress,
        shipping_status: shippingStatus,
      },
    ]).select('id').single()

    if (orderError || !insertOrder) {
      console.error('[Webhook] Order insert failed:', orderError)
      return new NextResponse('Failed to record order', { status: 500 })
    }

    if (product.product_type !== 'physical') {
      await db.from('purchases').insert([
        {
          user_id: buyerId,
          product_id: product.id,
          order_id: insertOrder.id,
          access_granted: true,
          download_count: 0,
          granted_at: new Date().toISOString(),
        },
      ])
    }

    if (product.product_type !== 'digital' && typeof product.stock_quantity === 'number') {
      await db
        .from('products')
        .update({ stock_quantity: product.stock_quantity - 1 })
        .eq('id', product.id)
    }
  }

  return NextResponse.json({ received: true })
}
