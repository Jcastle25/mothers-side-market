'use client'

import { useState } from 'react'
import {
  setCreatorFeeOverride,
  grantCreatorFreeMonths,
  removeCreatorFreeSubscription,
  addCreatorBadge,
  removeCreatorBadge,
} from '@/app/actions/admin'

const PRESET_BADGES = ['Founding Creator', 'Top Seller', 'Featured', 'Verified']

type Creator = {
  id: string
  name: string
  fee_override_percent: number | null
  subscription_free_until: string | null
  badges: string[]
}

export default function CreatorControls({ creator }: { creator: Creator }) {
  const [customBadge, setCustomBadge] = useState('')
  const freeUntil = creator.subscription_free_until ? new Date(creator.subscription_free_until) : null
  const isFreeActive = freeUntil && freeUntil > new Date()

  const inputStyle: React.CSSProperties = {
    padding: '7px 12px', borderRadius: '8px',
    border: '1px solid rgba(61,35,20,0.22)',
    background: '#FAF6F0', color: '#3D2314',
    fontSize: '13px', fontFamily: 'inherit', width: '80px',
  }

  const btnStyle: React.CSSProperties = {
    padding: '7px 14px', borderRadius: '100px', border: 'none',
    background: '#3D2314', color: '#FAF6F0', fontSize: '12px',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  }

  const ghostStyle: React.CSSProperties = {
    ...btnStyle, background: 'transparent',
    border: '1px solid rgba(61,35,20,0.22)', color: '#3D2314',
  }

  return (
    <div style={{ display: 'grid', gap: '16px', padding: '16px 20px', background: 'rgba(61,35,20,0.02)', borderRadius: '12px' }}>

      {/* Fee override */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#3D2314', minWidth: '120px' }}>
          Fee override: <strong>{creator.fee_override_percent != null ? `${creator.fee_override_percent}%` : 'global default'}</strong>
        </span>
        <form action={setCreatorFeeOverride} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="hidden" name="creator_id" value={creator.id} />
          <input type="number" name="fee_override" placeholder="e.g. 5" min="0" max="30" step="0.5" style={inputStyle} />
          <button type="submit" style={btnStyle}>Set</button>
        </form>
        {creator.fee_override_percent != null && (
          <form action={setCreatorFeeOverride}>
            <input type="hidden" name="creator_id" value={creator.id} />
            <input type="hidden" name="fee_override" value="" />
            <button type="submit" style={ghostStyle}>Clear override</button>
          </form>
        )}
      </div>

      {/* Free subscription */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#3D2314', minWidth: '120px' }}>
          Subscription: <strong>
            {isFreeActive
              ? `Free until ${freeUntil!.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'standard'}
          </strong>
        </span>
        <form action={grantCreatorFreeMonths} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="hidden" name="creator_id" value={creator.id} />
          <select name="months" style={{ ...inputStyle, width: 'auto' }}>
            {[1, 2, 3, 6, 12].map(m => (
              <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
            ))}
          </select>
          <button type="submit" style={btnStyle}>Grant free</button>
        </form>
        {isFreeActive && (
          <form action={removeCreatorFreeSubscription.bind(null, creator.id)}>
            <button type="submit" style={ghostStyle}>Remove</button>
          </form>
        )}
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '13px', color: '#3D2314', minWidth: '120px', paddingTop: '4px' }}>Badges:</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>

          {/* Current badges */}
          {creator.badges.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {creator.badges.map(badge => (
                <form key={badge} action={removeCreatorBadge.bind(null, creator.id, badge)} style={{ display: 'inline-flex' }}>
                  <button type="submit" style={{
                    padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                    background: 'rgba(200,150,90,0.2)', color: '#8B5E2A', border: '1px solid rgba(200,150,90,0.4)',
                    cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '5px',
                  }}>
                    {badge} ✕
                  </button>
                </form>
              ))}
            </div>
          )}

          {/* Add preset badge */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PRESET_BADGES.filter(b => !creator.badges.includes(b)).map(badge => (
              <form key={badge} action={addCreatorBadge}>
                <input type="hidden" name="creator_id" value={creator.id} />
                <input type="hidden" name="badge" value={badge} />
                <button type="submit" style={{
                  padding: '4px 10px', borderRadius: '100px', fontSize: '11px',
                  background: 'transparent', color: '#7A4A2E',
                  border: '1px dashed rgba(61,35,20,0.3)', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  + {badge}
                </button>
              </form>
            ))}
          </div>

          {/* Custom badge */}
          <form action={addCreatorBadge} style={{ display: 'flex', gap: '8px' }} onSubmit={() => setCustomBadge('')}>
            <input type="hidden" name="creator_id" value={creator.id} />
            <input
              type="text" name="badge" placeholder="Custom badge..."
              value={customBadge} onChange={e => setCustomBadge(e.target.value)}
              style={{ ...inputStyle, width: '160px' }}
            />
            <button type="submit" style={btnStyle}>Add</button>
          </form>
        </div>
      </div>
    </div>
  )
}
