import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarketLogo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if this user already has a creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  // Fetch recent orders for a quick summary (includes physical + digital)
  const { data: purchases } = await supabase
    .from('orders')
    .select('id, created_at, products(title)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)

  const displayName = creator?.name || user.user_metadata?.full_name || user.email

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '66px',
        background: 'rgba(250,246,240,0.94)',
        borderBottom: '1px solid rgba(61,35,20,0.12)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <MarketLogo size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/browse" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>Browse</Link>
          <Link href="/account/purchases" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>My Orders</Link>
          {creator && (
            <Link href="/dashboard" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>Creator Dashboard</Link>
          )}
          <form action={logout} style={{ margin: 0 }}>
            <button type="submit" style={{ padding: '8px 18px', borderRadius: '100px', border: '1px solid rgba(61,35,20,0.22)', background: 'transparent', color: '#3D2314', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
              Log out
            </button>
          </form>
        </div>
      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
          ● My Account
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '6px' }}>
          Welcome, {displayName}
        </h1>
        <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '48px' }}>{user.email}</p>

        {/* Purchases card */}
        <div style={{ background: '#fff', border: '1px solid rgba(61,35,20,0.12)', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 500, color: '#3D2314', margin: 0 }}>My Orders</h2>
            <Link href="/account/purchases" style={{ fontSize: '12px', color: '#7A4A2E', textDecoration: 'none' }}>View all →</Link>
          </div>

          {!purchases || purchases.length === 0 ? (
            <div>
              <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '16px' }}>
                You haven&apos;t ordered anything yet. Browse resources made by real homeschool moms.
              </p>
              <Link href="/browse" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
                Browse resources
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {purchases.map((p) => {
                const product = p.products as any
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(61,35,20,0.08)' }}>
                    <span style={{ fontSize: '14px', color: '#3D2314' }}>{product?.title || 'Product'}</span>
                    <span style={{ fontSize: '12px', color: '#7A4A2E' }}>
                      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )
              })}
              <Link href="/account/purchases" style={{ display: 'inline-block', marginTop: '8px', fontSize: '13px', color: '#3D2314', fontWeight: 500 }}>
                View all purchases →
              </Link>
            </div>
          )}
        </div>

        {/* Become a creator CTA — only shown to non-creators */}
        {!creator && (
          <div style={{ background: 'rgba(61,35,20,0.04)', border: '1px solid rgba(61,35,20,0.22)', borderRadius: '16px', padding: '28px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '10px' }}>
              ● For homeschool creators
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
              Want to sell your resources?
            </h2>
            <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.7, marginBottom: '20px' }}>
              Join hundreds of homeschool creators earning on Mother&apos;s Side Market. Just $9.99/month and a 10% fee — far less than the alternatives.
            </p>
            <Link href="/dashboard/setup" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              Set up your storefront →
            </Link>
          </div>
        )}

        {/* If already a creator, show shortcut to dashboard */}
        {creator && (
          <div style={{ background: 'rgba(61,35,20,0.04)', border: '1px solid rgba(61,35,20,0.22)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
              Your storefront
            </h2>
            <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '20px' }}>
              You&apos;re selling as <strong>{creator.name}</strong>. Manage your products, earnings, and Stripe account from your creator dashboard.
            </p>
            <Link href="/dashboard" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}>
              Go to creator dashboard →
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
