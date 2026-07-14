import Link from 'next/link'
import MarketLogo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

function formatCents(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100)
}

export default async function ShopPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const supabase = await createClient()

  const { data: creators } = await supabase
    .from('creators')
    .select('id, name, badges, user_id')

  const creator = (creators ?? []).find(c => slugify(c.name) === handle)
  if (!creator) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, product_type, category, preview_images')
    .eq('creator_id', creator.id)
    .eq('is_published', true)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false })

  const { data: creatorUser } = await supabase
    .from('users')
    .select('is_blocked')
    .eq('id', creator.user_id)
    .single()

  if (creatorUser?.is_blocked) notFound()

  const listings = products ?? []

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <style>{`
        .shop-nav { display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 66px; background: rgba(250,246,240,0.94); border-bottom: 1px solid rgba(61,35,20,0.12); position: sticky; top: 0; z-index: 100; }
        .shop-wrap { max-width: 1100px; margin: 0 auto; padding: 56px 24px 80px; }
        .shop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        @media (max-width: 640px) {
          .shop-nav { padding: 0 16px; }
          .shop-nav-title { display: none; }
          .shop-wrap { padding: 32px 16px 60px; }
          .shop-hero-name { font-size: 32px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="shop-nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <MarketLogo size={32} />
          <span className="shop-nav-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </Link>
        <Link href="/browse" style={{ fontSize: '13px', color: '#7A4A2E', textDecoration: 'none' }}>
          ← Browse all
        </Link>
      </nav>

      <div className="shop-wrap">
        {/* Creator header */}
        <header style={{ marginBottom: '48px', paddingBottom: '40px', borderBottom: '1px solid rgba(61,35,20,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px',
              background: 'rgba(61,35,20,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', flexShrink: 0,
            }}>
              🏡
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '8px' }}>
                ● Creator storefront
              </div>
              <h1 className="shop-hero-name" style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', margin: '0 0 12px' }}>
                {creator.name}
              </h1>
              {creator.badges && creator.badges.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {creator.badges.map((badge: string) => (
                    <span key={badge} style={{
                      padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      background: 'rgba(200,150,90,0.2)', color: '#8B5E2A', letterSpacing: '0.04em',
                    }}>
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '14px', color: '#7A4A2E', margin: 0 }}>
                {listings.length} product{listings.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </header>

        {/* Products */}
        {listings.length === 0 ? (
          <div style={{ padding: '62px 24px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#3D2314', marginBottom: '8px' }}>No listings yet</div>
            <p style={{ fontSize: '14px', color: '#7A4A2E' }}>This creator hasn't published any products yet. Check back soon.</p>
          </div>
        ) : (
          <div className="shop-grid">
            {listings.map(product => {
              const images = Array.isArray(product.preview_images) ? product.preview_images : []
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    background: '#fff', border: '1px solid rgba(61,35,20,0.12)',
                    borderRadius: '20px', overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(61,35,20,0.06)',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <div style={{ height: '180px', background: 'rgba(61,35,20,0.06)', overflow: 'hidden' }}>
                      {images[0] ? (
                        <img src={images[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                          {product.product_type === 'digital' ? '📄' : '📦'}
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '18px' }}>
                      <div style={{ fontSize: '11px', color: '#C8965A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                        {product.category?.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 500, color: '#3D2314', marginBottom: '10px', lineHeight: 1.3 }}>
                        {product.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#3D2314' }}>
                          {formatCents(product.price)}
                        </span>
                        <span style={{ fontSize: '11px', color: '#7A4A2E', background: 'rgba(61,35,20,0.06)', padding: '3px 10px', borderRadius: '100px' }}>
                          {product.product_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
