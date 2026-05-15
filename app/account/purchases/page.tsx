import Link from 'next/link'
import { redirect } from 'next/navigation'
import MarketLogo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'

function formatCents(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PurchasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all orders (physical + digital)
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      amount_cents,
      created_at,
      shipping_status,
      products (
        id,
        title,
        description,
        product_type,
        preview_images,
        file_url
      )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching orders:', error)

  // Fetch purchase records for digital download links
  const { data: purchases } = await supabase
    .from('purchases')
    .select('id, product_id, download_count')
    .eq('user_id', user.id)
    .eq('access_granted', true)

  const purchaseByProductId = Object.fromEntries(
    (purchases ?? []).map(p => [p.product_id, p])
  )

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <div style={{ padding: '48px 24px', maxWidth: '1120px', margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <MarketLogo size={32} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
              Mother Side Market
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/account" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>My Account</Link>
            <Link href="/browse" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>Browse</Link>
          </div>
        </nav>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● My Account
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
            My Orders
          </h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.6 }}>
            Your complete order history — digital downloads and physical products.
          </p>
        </div>

        {!orders || orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              No orders yet
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', marginBottom: '24px' }}>
              Browse resources made by real homeschool moms.
            </p>
            <Link href="/browse" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {orders.map((order) => {
              const product = order.products as any
              const images = Array.isArray(product?.preview_images) ? product.preview_images : []
              const purchase = product?.id ? purchaseByProductId[product.id] : null
              const isPhysical = product?.product_type === 'physical'
              const shippingLabel =
                order.shipping_status === 'shipped' ? 'Shipped' :
                order.shipping_status === 'delivered' ? 'Delivered' :
                order.shipping_status === 'pending' ? 'Processing' :
                null

              return (
                <div key={order.id} style={{ padding: '28px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'start' }}>
                    <div style={{ borderRadius: '18px', overflow: 'hidden', width: '80px', height: '80px', background: 'rgba(61,35,20,0.06)', flexShrink: 0 }}>
                      {images[0] ? (
                        <img src={images[0]} alt={product?.title || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#7A4A2E', fontSize: '24px' }}>
                          {isPhysical ? '📦' : '📄'}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: '6px' }}>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 500, color: '#3D2314', margin: 0 }}>
                        {product?.title || 'Unknown Product'}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                        {formatCents(order.amount_cents)} · Ordered {formatDate(order.created_at)}
                      </div>
                      {isPhysical && shippingLabel && (
                        <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '100px', background: 'rgba(200,150,90,0.15)', color: '#C8965A', fontSize: '12px', fontWeight: 600, width: 'fit-content' }}>
                          {shippingLabel}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      {!isPhysical && purchase ? (
                        <Link
                          href={`/api/download/${purchase.id}`}
                          style={{ padding: '10px 16px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          Download ({purchase.download_count})
                        </Link>
                      ) : isPhysical ? (
                        <div style={{ padding: '10px 16px', borderRadius: '100px', background: 'rgba(61,35,20,0.08)', color: '#7A4A2E', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          Physical order
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
