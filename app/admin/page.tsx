import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarketLogo from '@/components/Logo'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isAdmin } from '@/lib/admin'
import SettingsForm from './settings-form'
import AdminContent from './admin-content'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) redirect('/')

  const db = createServiceClient()

  const [
    { data: users },
    { data: creators },
    { data: products },
    { data: settings },
  ] = await Promise.all([
    db.from('users').select('id, email, is_buyer, is_creator, is_blocked, created_at').order('created_at', { ascending: false }),
    db.from('creators').select('id, name, user_id, fee_override_percent, subscription_free_until, badges').order('name'),
    db.from('products').select('id, title, price, is_published, is_hidden, created_at, creators(name)').order('created_at', { ascending: false }),
    db.from('platform_settings').select('platform_fee_percent, subscription_price_cents').eq('id', 1).single(),
  ])

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
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>Mother Side Market</span>
        </Link>
        <span style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8965A' }}>● Admin</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 500, marginBottom: '4px' }}>Admin Dashboard</h1>
        <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '48px' }}>Logged in as {user.email}</p>

        {/* ── Global Settings ── */}
        <section style={{ marginBottom: '56px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 500, marginBottom: '20px' }}>Global Settings</h2>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid rgba(61,35,20,0.12)', padding: '28px', maxWidth: '560px' }}>
            <SettingsForm
              initialFee={settings?.platform_fee_percent ?? 10}
              initialSubscriptionCents={settings?.subscription_price_cents ?? 999}
            />
          </div>
        </section>

        <AdminContent
          users={users ?? []}
          creators={(creators ?? []).map(c => ({ ...c, badges: c.badges ?? [] }))}
          products={products ?? []}
        />
      </div>
    </main>
  )
}
