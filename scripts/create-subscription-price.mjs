import Stripe from 'stripe'

const secretKey = process.argv[2]
if (!secretKey) {
  console.error('Usage: node scripts/create-subscription-price.mjs sk_live_...')
  process.exit(1)
}

const stripe = new Stripe(secretKey)

const product = await stripe.products.create({
  name: 'Mother Side Market — Seller Subscription',
  description: 'Monthly subscription to sell on Mother Side Market',
})

const price = await stripe.prices.create({
  product: product.id,
  unit_amount: 999,
  currency: 'usd',
  recurring: { interval: 'month' },
})

console.log('\n✅ Subscription price created!')
console.log('\n🔑 Add this to Vercel as STRIPE_SUBSCRIPTION_PRICE_ID:')
console.log(price.id)
