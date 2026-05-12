import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import MarketLogo from '@/components/Logo'

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

type Stats = {
  total_earnings: number
  this_month_earnings: number
  total_sales: number
  total_products: number
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id, name, stripe_account_id, stripe_sub_id, plan_type')
    .eq('user_id', user.id)
    .single()

  if (!creator) {
    // If no creator profile, redirect to setup or show message
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

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, title, is_published, price, category')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })

  // Fetch stats (placeholders for now)
  const stats: Stats = {
    total_earnings: 0,
    this_month_earnings: 0,
    total_sales: 0,
    total_products: products?.length || 0,
  }

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '66px',
        background: 'rgba(250,246,240,0.94)',
        borderBottom: '1px solid rgba(61,35,20,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MarketLogo size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </div>
        <form action={logout}>
          <button type="submit" style={{ padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(61,35,20,0.22)', background: 'transparent', color: '#3D2314', cursor: 'pointer', fontSize: '12px' }}>
            Log out
          </button>
        </form>
      </nav>

      <div style={{ padding: '64px 48px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
          ● Your dashboard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
              Welcome back, {creator.name || user.email}
            </h1>
            <p style={{ fontSize: '14px', color: '#7A4A2E' }}>{user.email}</p>
          </div>
          <a href="/dashboard/upload" style={{ padding: '12px 22px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
            Upload new product
          </a>
        </div>

        {/* Stats Row */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Total earnings</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#3D2314' }}>${stats.total_earnings.toFixed(2)}</div>
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>This month</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#3D2314' }}>${stats.this_month_earnings.toFixed(2)}</div>
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Total sales</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#3D2314' }}>{stats.total_sales}</div>
          </div>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Total products</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 600, color: '#3D2314' }}>{stats.total_products}</div>
          </div>
        </section>

        {/* My Products */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>My products</h2>
          {products && products.length > 0 ? (
            <div style={{ display: 'grid', gap: '16px' }}>
              {products.map((product) => (
                <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
                  <div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 500, color: '#3D2314', marginBottom: '4px' }}>{product.title}</div>
                    <div style={{ fontSize: '13px', color: '#7A4A2E' }}>{product.category.replace(/_/g, ' ')} • ${(product.price / 100).toFixed(2)} • {product.is_published ? 'Published' : 'Draft'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,35,20,0.22)', background: 'transparent', color: '#3D2314', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,35,20,0.22)', background: 'transparent', color: '#8B2500', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                  </div>
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
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>Your seller subscription</h2>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#3D2314', marginBottom: '4px' }}>$9.99/month</div>
              <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                All sellers pay this fee. Buyers pay nothing.
              </div>
            </div>
          </div>
        </section>

        {/* Stripe Account */}
        <section>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '20px' }}>Payments</h2>
          <div style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 500, color: '#3D2314', marginBottom: '4px' }}>
                  {creator.stripe_account_id ? 'Stripe account connected' : 'Connect Stripe account'}
                </div>
                <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                  {creator.stripe_account_id ? 'Your Stripe account is set up to receive payments.' : 'Connect your Stripe account to start receiving payments from sales.'}
                </div>
              </div>
              {!creator.stripe_account_id && (
                <button style={{ padding: '10px 20px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Connect Stripe</button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
