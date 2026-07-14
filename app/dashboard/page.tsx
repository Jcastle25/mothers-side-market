import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import MarketLogo from '@/components/Logo'
import ConnectStripeButton from './connect-stripe-button'
import SubscribeButton from './subscribe-button'
import Stripe from 'stripe'

type Creator = {
  id: string
  name: string
  stripe_account_id: string | null
  stripe_sub_id: string | null
  plan_type: string
}

type Product = {
  id: string
  title: string
  is_published: boolean
  price: number
  category: string
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ stripe?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: creator } = await supabase
    .from('creators')
    .select('id, name, stripe_account_id, stripe_sub_id, plan_type, subscription_free_until')
    .eq('user_id', user.id)
    .single()

  if (!creator) {
    return (
      <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
        <div style={{ padding: '64px 48px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '16px' }}>
            Set up your creator profile
          </h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', marginBottom: '24px' }}>
            To access your dashboard, you need to create a creator profile first.
          </p>
          <a href="/dashboard/setup" style={{ padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '14px' }}>
            Set up profile
          </a>
        </div>
      </main>
    )
  }

  const { data: products } = await supabase
    .from('products')
    .select('id, title, is_published, price, category')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })

  // Check real Stripe account status
  let stripeConnected = false
  let stripeIncomplete = false
  if (creator.stripe_account_id) {
    try {
      const account = await stripe.accounts.retrieve(creator.stripe_account_id)
      stripeConnected = !!(account.details_submitted && account.charges_enabled && account.payouts_enabled)
      stripeIncomplete = account.details_submitted && !stripeConnected
    } catch {
      // account may not exist yet
    }
  }

  // Check subscription status
  let subActive = false
  let subCancelled = false
  if (creator.stripe_sub_id) {
    try {
      const sub = await stripe.subscriptions.retrieve(creator.stripe_sub_id)
      subActive = sub.status === 'active' || sub.status === 'trialing'
      subCancelled = sub.status === 'canceled' || sub.status === 'unpaid'
    } catch {
      subCancelled = true
    }
  }
  // Respect free subscription granted by admin
  const freeUntil = (creator as any).subscription_free_until
  if (freeUntil && new Date(freeUntil) > new Date()) subActive = true

  const { stripe: stripeParam, sub: subParam } = await searchParams

  const totalProducts = products?.length || 0

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <style>{`
        .dash-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 66px; background: rgba(250,246,240,0.94); border-bottom: 1px solid rgba(61,35,20,0.12); }
        .dash-wrap { padding: 64px 48px; }
        .dash-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; margin-bottom: 48px; }
        @media (max-width: 640px) {
          .dash-nav { padding: 0 16px; }
          .dash-nav-title { display: none; }
          .dash-wrap { padding: 32px 16px; }
          .dash-header h1 { font-size: 28px !important; }
        }
      `}</style>

      <nav className="dash-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MarketLogo size={32} />
          <span className="dash-nav-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </div>
        <form action={logout}>
          <button type="submit" style={{ padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(61,35,20,0.22)', background: 'transparent', color: '#3D2314', cursor: 'pointer', fontSize: '12px' }}>
            Log out
          </button>
        </form>
      </nav>

      <div className="dash-wrap">
        {/* Banners */}
        {stripeParam === 'success' && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(61,35,20,0.08)', border: '1px solid rgba(61,35,20,0.2)', fontSize: '14px', color: '#3D2314', fontWeight: 500 }}>
            ✓ Stripe account connected — you're set up to receive payments!
          </div>
        )}
        {stripeParam === 'incomplete' && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(200,150,90,0.15)', border: '1px solid rgba(200,150,90,0.4)', fontSize: '14px', color: '#8B5E2A', fontWeight: 500 }}>
            ⚠ Your Stripe setup isn't complete yet. Click "Finish setup" below to continue.
          </div>
        )}
        {stripeParam === 'error' && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(139,37,0,0.08)', border: '1px solid rgba(139,37,0,0.2)', fontSize: '14px', color: '#8B2500', fontWeight: 500 }}>
            Something went wrong with Stripe. Please try connecting again.
          </div>
        )}
        {subParam === 'success' && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(61,35,20,0.08)', border: '1px solid rgba(61,35,20,0.2)', fontSize: '14px', color: '#3D2314', fontWeight: 500 }}>
            ✓ Subscription active — you can now publish products!
          </div>
        )}
        {subParam === 'cancelled' && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(200,150,90,0.15)', border: '1px solid rgba(200,150,90,0.4)', fontSize: '14px', color: '#8B5E2A', fontWeight: 500 }}>
            Subscription not completed. Subscribe below to start selling.
          </div>
        )}

        <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
          ● Your dashboard
        </div>
        <div className="dash-header">
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
              Welcome back, {creator.name || user.email}
            </h1>
            <p style={{ fontSize: '14px', color: '#7A4A2E' }}>{user.email}</p>
          </div>
          <a href="/dashboard/upload" style={{ padding: '12px 22px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            + Upload product
          </a>
        </div>

        {/* Stats */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { label: 'Total earnings', value: '$0.00' },
            { label: 'This month', value: '$0.00' },
            { label: 'Total sales', value: '0' },
            { label: 'Total products', value: String(totalProducts) },
          ].map(stat => (
            <div key={stat.label} style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#3D2314' }}>{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Payments / Stripe Connect */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>Payments</h2>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#3D2314' }}>
                    {stripeConnected ? 'Stripe account connected' : stripeIncomplete ? 'Stripe setup incomplete' : 'Connect Stripe to get paid'}
                  </div>
                  {stripeConnected && (
                    <span style={{ padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: 'rgba(61,35,20,0.08)', color: '#3D2314' }}>
                      ✓ Active
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                  {stripeConnected
                    ? 'Your payouts are enabled. You will receive your earnings after each sale.'
                    : stripeIncomplete
                    ? 'You started setup but didn\'t finish. Complete it so you can receive payments.'
                    : 'Connect your bank account through Stripe so you receive money when products sell.'}
                </div>
              </div>
              {!stripeConnected && (
                <ConnectStripeButton label={stripeIncomplete ? 'Finish setup' : 'Connect Stripe'} />
              )}
            </div>
          </div>
        </section>

        {/* Products */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>My products</h2>
          {products && products.length > 0 ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {products.map((product) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 500, color: '#3D2314', marginBottom: '4px' }}>{product.title}</div>
                    <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                      {product.category.replace(/_/g, ' ')} · ${(product.price / 100).toFixed(2)} ·{' '}
                      <span style={{ color: product.is_published ? '#3D2314' : '#C8965A', fontWeight: 500 }}>
                        {product.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <a href={`/product/${product.id}`} style={{ fontSize: '12px', color: '#7A4A2E', textDecoration: 'none', padding: '6px 14px', border: '1px solid rgba(61,35,20,0.22)', borderRadius: '8px' }}>
                    View listing
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)', textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>No products yet</div>
              <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '16px' }}>Start by uploading your first product.</p>
              <a href="/dashboard/upload" style={{ padding: '10px 20px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px' }}>Upload product</a>
            </div>
          )}
        </section>

        {/* Subscription */}
        <section>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>Seller subscription</h2>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#3D2314' }}>
                    {subActive ? 'Subscription active' : 'Subscribe to sell'}
                  </div>
                  {subActive && (
                    <span style={{ padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: 'rgba(61,35,20,0.08)', color: '#3D2314' }}>
                      ✓ Active
                    </span>
                  )}
                  {subCancelled && (
                    <span style={{ padding: '2px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600, background: 'rgba(139,37,0,0.1)', color: '#8B2500' }}>
                      Cancelled
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                  {subActive
                    ? '$9.99/month · Cancel anytime from your Stripe billing portal.'
                    : 'Pay $9.99/month to list and sell products. Buyers pay nothing to browse.'}
                </div>
              </div>
              {!subActive && <SubscribeButton />}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
