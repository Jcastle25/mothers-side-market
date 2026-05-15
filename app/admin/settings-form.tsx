'use client'

import { useState } from 'react'
import { updateGlobalSettings } from '@/app/actions/admin'

type Props = {
  initialFee: number
  initialSubscriptionCents: number
}

export default function SettingsForm({ initialFee, initialSubscriptionCents }: Props) {
  const [fee, setFee] = useState(initialFee)
  const [subPrice, setSubPrice] = useState(initialSubscriptionCents / 100)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(formData: FormData) {
    await updateGlobalSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form action={handleSubmit} style={{ display: 'grid', gap: '28px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#3D2314' }}>Platform fee</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input
              type="number" name="fee_percent" min="0" max="30" step="0.5"
              value={fee}
              onChange={e => setFee(parseFloat(e.target.value) || 0)}
              style={{ width: '64px', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(61,35,20,0.22)', background: '#FAF6F0', color: '#3D2314', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, textAlign: 'right' }}
            />
            <span style={{ fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#3D2314' }}>%</span>
          </div>
        </div>
        <input
          type="range" min="0" max="30" step="0.5"
          value={fee}
          onChange={e => setFee(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#3D2314' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7A4A2E', marginTop: '4px' }}>
          <span>0%</span><span>30%</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#3D2314' }}>Monthly subscription price</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, color: '#3D2314' }}>$</span>
            <input
              type="number" name="subscription_price" min="0" max="50" step="0.01"
              value={subPrice}
              onChange={e => setSubPrice(parseFloat(e.target.value) || 0)}
              style={{ width: '72px', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(61,35,20,0.22)', background: '#FAF6F0', color: '#3D2314', fontSize: '18px', fontFamily: 'Georgia, serif', fontWeight: 600, textAlign: 'right' }}
            />
            <span style={{ fontSize: '14px', color: '#7A4A2E' }}>/mo</span>
          </div>
        </div>
        <input
          type="range" min="0" max="50" step="0.5"
          value={subPrice}
          onChange={e => setSubPrice(parseFloat(e.target.value))}
          style={{ width: '100%', accentColor: '#3D2314' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7A4A2E', marginTop: '4px' }}>
          <span>$0</span><span>$50</span>
        </div>
      </div>

      <button type="submit" style={{
        padding: '10px 24px', borderRadius: '100px', background: saved ? 'rgba(61,35,20,0.15)' : '#3D2314',
        color: saved ? '#3D2314' : '#FAF6F0', border: 'none', fontSize: '13px', fontWeight: 600,
        cursor: 'pointer', width: 'fit-content', transition: 'all 0.2s',
      }}>
        {saved ? 'Saved ✓' : 'Save global settings'}
      </button>
    </form>
  )
}
