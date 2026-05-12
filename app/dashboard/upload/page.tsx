'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useActionState } from 'react'
import MarketLogo from '@/components/Logo'
import { createProduct } from '@/app/actions/products'

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid rgba(61,35,20,0.22)',
  background: '#FAF6F0',
  color: '#3D2314',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function UploadProductPage() {
  const [productType, setProductType] = useState('digital')
  const [state, action, pending] = useActionState(createProduct, undefined)

  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '66px',
        background: 'rgba(250,246,240,0.94)',
        borderBottom: '1px solid rgba(61,35,20,0.12)',
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <MarketLogo size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </Link>
        <Link href="/dashboard" style={{ color: '#3D2314', fontSize: '13px' }}>
          Back to dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: '840px', margin: '64px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A', marginBottom: '12px' }}>
            ● Add a new product
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
            Upload product details
          </h1>
          <p style={{ fontSize: '14px', color: '#7A4A2E', lineHeight: 1.6 }}>
            Add a listing with digital or physical details, preview images, and clear pricing for homeschool families.
          </p>
        </div>

        {state?.error && (
          <div style={{ background: 'rgba(200,80,50,0.07)', border: '1px solid rgba(200,80,50,0.25)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#8B2500', lineHeight: 1.5 }}>
            {state.error}
          </div>
        )}

        {state?.message && (
          <div style={{ background: 'rgba(69,123,157,0.1)', border: '1px solid rgba(61,35,20,0.12)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '13px', color: '#3D2314', lineHeight: 1.5 }}>
            {state.message}
          </div>
        )}

        <form action={action} encType="multipart/form-data" style={{ display: 'grid', gap: '22px' }}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
              Product title
              <input
                name="title"
                type="text"
                required
                placeholder="Example: Morning routine printable bundle"
                style={INPUT_STYLE}
              />
            </label>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
              Description
              <textarea
                name="description"
                required
                rows={6}
                placeholder="Describe what families receive and how it supports homeschool learning."
                style={{ ...INPUT_STYLE, resize: 'vertical' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
              Price (USD)
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="e.g. 9.99"
                style={INPUT_STYLE}
              />
            </label>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
              Category
              <select name="category" required defaultValue="homeschool_resources" style={INPUT_STYLE}>
                <option value="homeschool_resources">Homeschool resources</option>
                <option value="lesson_plans">Lesson plans</option>
                <option value="toddler_activities">Toddler activities</option>
                <option value="parenting_tips">Parenting tips</option>
                <option value="snack_meal_ideas">Snack & meal ideas</option>
                <option value="printables">Printables</option>
                <option value="organization">Organization</option>
                <option value="handmade_goods">Handmade goods</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
              Product type
              <select
                name="product_type"
                value={productType}
                onChange={(event) => setProductType(event.target.value)}
                style={INPUT_STYLE}
              >
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
            </label>
            {productType === 'digital' ? (
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
                Digital product file
                <input
                  name="product_file"
                  type="file"
                  accept=".pdf,image/*,application/zip"
                  required
                  style={{ ...INPUT_STYLE, padding: '10px 14px' }}
                />
              </label>
            ) : (
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
                Shipping price (USD)
                <input
                  name="shipping_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 5.00"
                  style={INPUT_STYLE}
                />
              </label>
            )}
          </div>

          {productType === 'physical' && (
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
                Shipping description
                <input
                  name="shipping_description"
                  type="text"
                  placeholder="Ships in 3–5 business days"
                  style={INPUT_STYLE}
                />
              </label>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
                Stock quantity
                <input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="e.g. 10"
                  style={INPUT_STYLE}
                />
              </label>
            </div>
          )}

          <label style={{ fontSize: '13px', fontWeight: 500, color: '#3D2314' }}>
            Preview images (up to 4)
            <input
              name="preview_images"
              type="file"
              accept="image/*"
              multiple
              style={{ ...INPUT_STYLE, padding: '10px 14px' }}
            />
          </label>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="submit"
              name="save_action"
              value="draft"
              disabled={pending}
              style={{ padding: '14px 22px', borderRadius: '100px', border: '1px solid rgba(61,35,20,0.22)', background: '#FAF6F0', color: '#3D2314', cursor: pending ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              {pending ? 'Saving…' : 'Save as draft'}
            </button>
            <button
              type="submit"
              name="save_action"
              value="publish"
              disabled={pending}
              style={{ padding: '14px 22px', borderRadius: '100px', border: 'none', background: pending ? 'rgba(61,35,20,0.4)' : '#3D2314', color: '#FAF6F0', cursor: pending ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 500 }}
            >
              {pending ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
