import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
const vars = Object.fromEntries(
  env.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
    })
    .filter(([k]) => k)
)

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY)

const { data: orders } = await supabase
  .from('orders')
  .select('id, buyer_id, product_id, amount_cents, platform_fee_cents, status, stripe_payment_id, shipping_status, created_at')
  .order('created_at', { ascending: false })

console.log('Orders in database:')
console.log(JSON.stringify(orders, null, 2))

const { data: purchases } = await supabase
  .from('purchases')
  .select('id, user_id, product_id, access_granted, granted_at')

console.log('\nPurchases in database:')
console.log(JSON.stringify(purchases, null, 2))
