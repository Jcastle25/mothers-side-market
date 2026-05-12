import Link from 'next/link'
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
    day: 'numeric'
  })
}

export default async function PurchasesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
        <div style={{ maxWidth: '720px', margin: '120px auto', padding: '0 24px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314' }}>Please sign in</h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', marginTop: '16px' }}>
            You need to be logged in to view your purchases.
          </p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  const { data: purchases, error } = await supabase
    .from('purchases')
    .select(`
      id,
      access_granted,
      granted_at,
      download_count,
      products (
        id,
        title,
        description,
        product_type,
        file_url,
        preview_images
      )
    `)
    .eq('user_id', user.id)
    .eq('access_granted', true)
    .order('granted_at', { ascending: false })

  if (error) {
    console.error('Error fetching purchases:', error)
  }

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
            <Link href="/browse" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>
              Browse
            </Link>
            <Link href="/dashboard" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>
              Dashboard
            </Link>
          </div>
        </nav>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● My Account
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
            My Purchases
          </h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.6 }}>
            View and download your purchased digital products.
          </p>
        </div>

        {!purchases || purchases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: '54px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              No purchases yet
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', marginBottom: '24px' }}>
              When you buy digital products, they'll appear here for download.
            </p>
            <Link href="/browse" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Browse products
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {purchases.map((purchase) => {
              const product = purchase.products as any
              const images = Array.isArray(product?.preview_images) ? product.preview_images : []

              return (
                <div key={purchase.id} style={{ padding: '28px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'start' }}>
                    <div style={{ borderRadius: '18px', overflow: 'hidden', width: '80px', height: '80px', background: 'rgba(61,35,20,0.06)' }}>
                      {images[0] ? (
                        <img src={images[0]} alt={product?.title || 'Product'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: '#7A4A2E', fontSize: '24px' }}>
                          📄
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gap: '8px' }}>
                      <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 500, color: '#3D2314', margin: 0 }}>
                        {product?.title || 'Unknown Product'}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.5, margin: 0 }}>
                        {product?.description || 'No description available'}
                      </p>
                      <div style={{ fontSize: '13px', color: '#7A4A2E' }}>
                        Purchased on {formatDate(purchase.granted_at)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      {product?.product_type === 'digital' && product?.file_url ? (
                        <Link
                          href={`/api/download/${purchase.id}`}
                          style={{ padding: '10px 16px', borderRadius: '100px', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
                        >
                          Download ({purchase.download_count} downloads)
                        </Link>
                      ) : (
                        <div style={{ padding: '10px 16px', borderRadius: '100px', background: 'rgba(61,35,20,0.1)', color: '#7A4A2E', fontSize: '13px', fontWeight: 600 }}>
                          {product?.product_type === 'physical' ? 'Physical item shipped' : 'Download not available'}
                        </div>
                      )}
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