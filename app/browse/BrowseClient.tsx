'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const CATEGORY_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Homeschool Resources', value: 'homeschool_resources' },
  { label: 'Lesson Plans', value: 'lesson_plans' },
  { label: 'Toddler Activities', value: 'toddler_activities' },
  { label: 'Parenting Tips', value: 'parenting_tips' },
  { label: 'Printables', value: 'printables' },
  { label: 'Snack & Meal Ideas', value: 'snack_meal_ideas' },
  { label: 'Organization', value: 'organization' },
  { label: 'Handmade Goods', value: 'other' },
]

const CARD_STYLE: React.CSSProperties = {
  background: '#FAF6F0',
  border: '1px solid rgba(61,35,20,0.12)',
  borderRadius: '18px',
  padding: '22px',
  display: 'grid',
  gap: '18px',
  boxShadow: '0 2px 16px rgba(61,35,20,0.06)',
  minHeight: '260px',
}

const BUTTON_STYLE: React.CSSProperties = {
  fontSize: '12px',
  padding: '10px 16px',
  borderRadius: '999px',
  border: '1px solid rgba(61,35,20,0.12)',
  background: 'transparent',
  color: '#3D2314',
  cursor: 'pointer',
}

const ACTIVE_BUTTON_STYLE: React.CSSProperties = {
  ...BUTTON_STYLE,
  background: '#3D2314',
  color: '#FAF6F0',
  borderColor: '#3D2314',
}

export type BrowseProduct = {
  id: string
  title: string
  category: string
  price: number
  product_type: string
  creator_name: string
}

export default function BrowseClient({ initialProducts }: { initialProducts: BrowseProduct[] }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, initialProducts, searchTerm])

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', color: '#3D2314', minHeight: '100vh' }}>
      <div style={{ padding: '72px 24px 48px', maxWidth: '1280px', margin: '0 auto' }}>
        <header style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● Browse marketplace
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, marginBottom: '14px' }}>
            Explore digital and physical homeschool products
          </h1>
          <p style={{ fontSize: '15px', color: '#7A4A2E', maxWidth: '760px', lineHeight: 1.75 }}>
            Discover fresh resources built for families like yours. Search by title, filter by category, and shop items that ship or download instantly.
          </p>
        </header>

        <section style={{ display: 'grid', gap: '18px', marginBottom: '28px' }}>
          <div style={{ display: 'grid', gap: '14px', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D2314', minWidth: '110px' }}>Search</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '999px', border: '1px solid rgba(61,35,20,0.12)', background: '#FAF6F0', color: '#3D2314', fontSize: '14px', outline: 'none' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                style={activeCategory === option.value ? ACTIVE_BUTTON_STYLE : BUTTON_STYLE}
                onClick={() => setActiveCategory(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {filteredProducts.length === 0 ? (
          <div style={{ padding: '62px 24px', borderRadius: '24px', background: '#fff', border: '1px solid rgba(61,35,20,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#3D2314', marginBottom: '12px' }}>No products match yet</div>
            <p style={{ fontSize: '14px', color: '#7A4A2E', maxWidth: '620px', margin: '0 auto' }}>
              We’re still building the marketplace. Check back soon or try a different search term or filter.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                style={CARD_STYLE}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '16px', background: 'rgba(61,35,20,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {product.product_type === 'digital' ? '📄' : '📦'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 600, color: '#3D2314' }}>{product.title}</div>
                      <div style={{ fontSize: '12px', color: '#7A4A2E', marginTop: '4px' }}>{product.creator_name || 'Creator'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#3D2314' }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price / 100)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7A4A2E', marginTop: '4px' }}>{product.product_type}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#7A4A2E', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{product.category.replace(/_/g, ' ')}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
