import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

function formatCents(value: number | null | undefined) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value / 100)
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: userData }, { data: product, error: productError }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('products')
      .select('id, title, description, price, category, product_type, shipping_price, shipping_description, stock_quantity, weight_oz, preview_images, file_url, creator_id')
      .eq('id', id)
      .single(),
  ])

  // Try to fetch creator separately if product found
  let creatorName = 'Creator'
  if (product && product.creator_id) {
    const { data: creator } = await supabase
      .from('creators')
      .select('name')
      .eq('id', product.creator_id)
      .single()
    
    if (creator) {
      creatorName = creator.name
    }
  }

  if (productError || !product) {
    console.error('[Product Page] Query error:', productError?.message || 'Product not found', 'ID:', id)
    return (
      <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
        <div style={{ maxWidth: '720px', margin: '120px auto', padding: '0 24px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314' }}>Product not found</h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', marginTop: '16px' }}>
            We couldn't locate that listing. Please return to the marketplace and try another product.
          </p>
        </div>
      </main>
    )
  }

  const purchaseCheck = userData.user
    ? await supabase
        .from('purchases')
        .select('id')
        .eq('product_id', id)
        .eq('user_id', userData.user.id)
        .eq('access_granted', true)
        .limit(1)
        .single()
    : null

  const purchased = !!purchaseCheck?.data
  const hasDownload = purchased && !!product.file_url
  const shippingInfo = product.product_type !== 'digital'
  const outOfStock = product.product_type !== 'digital' && typeof product.stock_quantity === 'number' && product.stock_quantity <= 0
  const creatorHandle = slugify(creatorName)
  const previewImages = Array.isArray(product.preview_images) ? product.preview_images : []

  const { data: relatedProducts } = await supabase
    .from('products')
    .select('id, title, price, preview_images, creator_id')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(3)

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <div style={{ padding: '48px 24px', maxWidth: '1120px', margin: '0 auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#3D2314', textDecoration: 'none' }}>
            🌿 Mother's Side Market
          </Link>
          <Link href="/browse" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>
            Back to browse
          </Link>
        </nav>

        <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '32px' }}>
          <div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A' }}>
                  {product.category?.replace(/_/g, ' ') || 'Uncategorized'}
                </div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', lineHeight: 1.05, margin: 0 }}>{product.title}</h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', color: '#7A4A2E' }}>by</span>
                  <Link href={`/shop/${creatorHandle}`} style={{ fontSize: '13px', fontWeight: 600, color: '#3D2314', textDecoration: 'none' }}>
                    {creatorName}
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '18px' }}>
                {previewImages.length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ borderRadius: '24px', overflow: 'hidden', minHeight: '360px', background: '#fff' }}>
                      <img
                        src={previewImages[0]}
                        alt={product.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
                      {previewImages.slice(1, 4).map((src, index) => (
                        <div key={index} style={{ borderRadius: '18px', overflow: 'hidden', minHeight: '100px', background: '#fff' }}>
                          <img
                            src={src}
                            alt={`${product.title} preview ${index + 2}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ borderRadius: '24px', background: 'rgba(61,35,20,0.06)', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px' }}>
                    <div>
                      <div style={{ fontSize: '54px' }}>🖼️</div>
                      <div style={{ fontSize: '15px', color: '#7A4A2E', marginTop: '14px' }}>No preview images yet</div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '28px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#3D2314', marginBottom: '12px' }}>Product details</div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#7A4A2E' }}>{product.description}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', color: '#7A4A2E', fontSize: '13px' }}>
                    <span><strong>Type:</strong> {product.product_type}</span>
                    <span><strong>Category:</strong> {product.category.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              {shippingInfo && (
                <div style={{ padding: '24px', borderRadius: '24px', background: '#fff7e6', border: '1px solid rgba(61,35,20,0.12)' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#3D2314', marginBottom: '12px' }}>Shipping</div>
                  <div style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ fontSize: '14px', color: '#3D2314' }}>{product.shipping_description || 'Ships in 3-5 business days'}</div>
                    <div style={{ fontSize: '13px', color: '#7A4A2E' }}>Shipping price: {formatCents(product.shipping_price)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside style={{ display: 'grid', gap: '20px' }}>
            <div style={{ padding: '28px 24px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '14px' }}>Purchase</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div style={{ fontSize: '13px', color: '#7A4A2E' }}>Price</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 600, color: '#3D2314' }}>{formatCents(product.price)}</div>
              </div>
              <div style={{ display: 'grid', gap: '10px', marginBottom: '22px' }}>
                <div style={{ fontSize: '13px', color: '#7A4A2E' }}><strong>Type:</strong> {product.product_type}</div>
                {product.stock_quantity !== null && product.product_type !== 'digital' && (
                  <div style={{ fontSize: '13px', color: '#7A4A2E' }}><strong>Stock:</strong> {product.stock_quantity > 0 ? product.stock_quantity : 'Sold out'}</div>
                )}
              </div>
              {hasDownload ? (
                <button type="button" style={{ width: '100%', padding: '14px 20px', borderRadius: '100px', border: 'none', background: '#3D2314', color: '#FAF6F0', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                  Download
                </button>
              ) : (
                <button
                  type="button"
                  disabled={outOfStock}
                  style={{ width: '100%', padding: '14px 20px', borderRadius: '100px', border: 'none', background: outOfStock ? 'rgba(61,35,20,0.2)' : '#3D2314', color: '#FAF6F0', cursor: outOfStock ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600 }}
                >
                  {outOfStock ? 'Sold out' : 'Buy now'}
                </button>
              )}
            </div>

            <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(61,35,20,0.04)', border: '1px solid rgba(61,35,20,0.12)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#3D2314', marginBottom: '12px' }}>Quick info</div>
              <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#7A4A2E' }}>
                This listing is styled for families shopping homeschool resources. If you already own it, use the download button above.
              </div>
            </div>
          </aside>
        </section>

        {relatedProducts && relatedProducts.length > 0 && (
          <section style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 500, color: '#3D2314', margin: 0 }}>Related products</h2>
              <Link href="/browse" style={{ fontSize: '13px', color: '#3D2314', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
              {relatedProducts.map((item) => {
                const images = Array.isArray(item.preview_images) ? item.preview_images : []

                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ display: 'grid', gap: '14px', padding: '22px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)' }}>
                      <div style={{ borderRadius: '18px', overflow: 'hidden', minHeight: '140px', background: 'rgba(61,35,20,0.06)' }}>
                        {images[0] ? (
                          <img src={images[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px', color: '#7A4A2E' }}>No image</div>
                        )}
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 600, color: '#3D2314' }}>{item.title}</div>
                        <div style={{ fontSize: '13px', color: '#7A4A2E' }}>{formatCents(item.price)}</div>
                        <div style={{ fontSize: '13px', color: '#7A4A2E' }}>by Creator</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 980px) {
          section[style] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 720px) {
          main > div {
            padding: 32px 18px !important;
          }

          h1 {
            font-size: 32px !important;
          }
        }
      `}</style>
    </main>
  )
}
