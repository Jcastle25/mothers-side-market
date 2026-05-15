import Stripe from 'stripe'

const secretKey = process.argv[2]
if (!secretKey) {
  console.error('Usage: node scripts/create-webhook.mjs sk_live_...')
  process.exit(1)
}

const stripe = new Stripe(secretKey)

const endpoint = await stripe.webhookEndpoints.create({
  url: 'https://www.mothersidemarket.com/api/webhooks/stripe',
  enabled_events: ['checkout.session.completed'],
})

console.log('\n✅ Webhook endpoint created!')
console.log('ID:', endpoint.id)
console.log('\n🔑 STRIPE_WEBHOOK_SECRET (copy this to Vercel):')
console.log(endpoint.secret)
