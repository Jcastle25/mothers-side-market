'use client'

import { useState } from 'react'
import { blockUser, unblockUser, hideProduct, unhideProduct, deleteProduct } from '@/app/actions/admin'
import { isAdmin } from '@/lib/admin'
import CreatorControls from './creator-controls'

type User = {
  id: string
  email: string
  is_buyer: boolean
  is_creator: boolean
  is_blocked: boolean
  created_at: string
}

type Creator = {
  id: string
  name: string
  user_id: string
  fee_override_percent: number | null
  subscription_free_until: string | null
  badges: string[]
}

type Product = {
  id: string
  title: string
  price: number
  is_published: boolean
  is_hidden: boolean
  created_at: string
  creators: { name: string } | { name: string }[] | null
}

type Props = {
  users: User[]
  creators: Creator[]
  products: Product[]
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCents(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100)
}

function creatorName(product: Product): string {
  if (!product.creators) return '—'
  return Array.isArray(product.creators) ? product.creators[0]?.name ?? '—' : (product.creators as any).name ?? '—'
}

export default function AdminContent({ users, creators, products }: Props) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase().trim()

  const filteredUsers = q ? users.filter(u => u.email.toLowerCase().includes(q)) : users
  const filteredCreators = q ? creators.filter(c => c.name.toLowerCase().includes(q)) : creators
  const filteredProducts = q ? products.filter(p =>
    p.title.toLowerCase().includes(q) || creatorName(p).toLowerCase().includes(q)
  ) : products

  const btnBase: React.CSSProperties = {
    padding: '6px 14px', borderRadius: '100px', fontSize: '12px',
    fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: 'inherit',
  }

  return (
    <div>
      {/* Search bar */}
      <div style={{ marginBottom: '40px' }}>
        <input
          type="search"
          placeholder="Search users, creators, or products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '480px', padding: '12px 18px',
            borderRadius: '100px', border: '1px solid rgba(61,35,20,0.22)',
            background: '#fff', color: '#3D2314', fontSize: '14px',
            fontFamily: 'inherit', outline: 'none',
            boxShadow: '0 2px 12px rgba(61,35,20,0.06)',
          }}
        />
        {q && (
          <p style={{ fontSize: '13px', color: '#7A4A2E', marginTop: '10px' }}>
            Showing results for <strong>"{search}"</strong> — {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}, {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''}, {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Creators */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 500, marginBottom: '20px' }}>
          Creators ({filteredCreators.length})
        </h2>
        {filteredCreators.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#7A4A2E' }}>No creators found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredCreators.map(creator => (
              <div key={creator.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(61,35,20,0.12)', padding: '20px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 500, marginBottom: '12px' }}>{creator.name}</div>
                <CreatorControls creator={creator} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users */}
      <section style={{ marginBottom: '56px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 500, marginBottom: '20px' }}>
          Users ({filteredUsers.length})
        </h2>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(61,35,20,0.12)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(61,35,20,0.10)', background: 'rgba(61,35,20,0.03)' }}>
                {['Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: '#7A4A2E' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px 20px', color: '#7A4A2E', fontSize: '13px' }}>No users found.</td></tr>
              ) : filteredUsers.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filteredUsers.length - 1 ? '1px solid rgba(61,35,20,0.08)' : 'none' }}>
                  <td style={{ padding: '14px 20px', color: '#3D2314' }}>{u.email}</td>
                  <td style={{ padding: '14px 20px', color: '#7A4A2E' }}>{u.is_creator ? 'Creator' : 'Buyer'}</td>
                  <td style={{ padding: '14px 20px', color: '#7A4A2E' }}>{formatDate(u.created_at)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: u.is_blocked ? 'rgba(139,37,0,0.1)' : 'rgba(61,35,20,0.08)', color: u.is_blocked ? '#8B2500' : '#7A4A2E' }}>
                      {u.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {isAdmin(u.email) ? (
                      <span style={{ fontSize: '12px', color: '#C8965A', fontWeight: 600 }}>Admin</span>
                    ) : u.is_blocked ? (
                      <form action={unblockUser.bind(null, u.id)}>
                        <button type="submit" style={{ ...btnBase, background: '#3D2314', color: '#FAF6F0' }}>Unblock</button>
                      </form>
                    ) : (
                      <form action={blockUser.bind(null, u.id)}>
                        <button type="submit" style={{ ...btnBase, background: 'rgba(139,37,0,0.1)', color: '#8B2500' }}>Block</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Products */}
      <section>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 500, marginBottom: '20px' }}>
          Products ({filteredProducts.length})
        </h2>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(61,35,20,0.12)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(61,35,20,0.10)', background: 'rgba(61,35,20,0.03)' }}>
                {['Title', 'Creator', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 600, color: '#7A4A2E' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px 20px', color: '#7A4A2E', fontSize: '13px' }}>No products found.</td></tr>
              ) : filteredProducts.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filteredProducts.length - 1 ? '1px solid rgba(61,35,20,0.08)' : 'none' }}>
                  <td style={{ padding: '14px 20px', color: '#3D2314', fontWeight: 500 }}>{p.title}</td>
                  <td style={{ padding: '14px 20px', color: '#7A4A2E' }}>{creatorName(p)}</td>
                  <td style={{ padding: '14px 20px', color: '#7A4A2E' }}>{formatCents(p.price)}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600, background: p.is_hidden ? 'rgba(139,37,0,0.1)' : p.is_published ? 'rgba(61,35,20,0.08)' : 'rgba(200,150,90,0.15)', color: p.is_hidden ? '#8B2500' : p.is_published ? '#7A4A2E' : '#C8965A' }}>
                      {p.is_hidden ? 'Hidden' : p.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {p.is_hidden ? (
                        <form action={unhideProduct.bind(null, p.id)}>
                          <button type="submit" style={{ ...btnBase, background: '#3D2314', color: '#FAF6F0' }}>Unhide</button>
                        </form>
                      ) : (
                        <form action={hideProduct.bind(null, p.id)}>
                          <button type="submit" style={{ ...btnBase, background: 'rgba(61,35,20,0.1)', color: '#3D2314' }}>Hide</button>
                        </form>
                      )}
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" style={{ ...btnBase, background: 'rgba(139,37,0,0.1)', color: '#8B2500' }}>Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
