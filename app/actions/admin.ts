'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isAdmin } from '@/lib/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdmin(user.email)) throw new Error('Unauthorized')
  return createServiceClient()
}

// ── User actions ──────────────────────────────────────────────────────────────

export async function blockUser(userId: string) {
  const db = await requireAdmin()
  await db.from('users').update({ is_blocked: true }).eq('id', userId)
  await db.auth.admin.signOut(userId)
  revalidatePath('/admin')
}

export async function unblockUser(userId: string) {
  const db = await requireAdmin()
  await db.from('users').update({ is_blocked: false }).eq('id', userId)
  revalidatePath('/admin')
}

// ── Product actions ───────────────────────────────────────────────────────────

export async function hideProduct(productId: string) {
  const db = await requireAdmin()
  await db.from('products').update({ is_hidden: true, is_published: false }).eq('id', productId)
  revalidatePath('/admin')
  revalidatePath('/browse')
}

export async function unhideProduct(productId: string) {
  const db = await requireAdmin()
  await db.from('products').update({ is_hidden: false }).eq('id', productId)
  revalidatePath('/admin')
  revalidatePath('/browse')
}

export async function deleteProduct(productId: string) {
  const db = await requireAdmin()
  await db.from('products').delete().eq('id', productId)
  revalidatePath('/admin')
  revalidatePath('/browse')
}

// ── Global platform settings ──────────────────────────────────────────────────

export async function updateGlobalSettings(formData: FormData) {
  const db = await requireAdmin()
  const feePercent = parseFloat(formData.get('fee_percent') as string)
  const subscriptionCents = Math.round(parseFloat(formData.get('subscription_price') as string) * 100)

  if (isNaN(feePercent) || isNaN(subscriptionCents)) throw new Error('Invalid values')

  await db.from('platform_settings')
    .update({ platform_fee_percent: feePercent, subscription_price_cents: subscriptionCents, updated_at: new Date().toISOString() })
    .eq('id', 1)

  revalidatePath('/admin')
}

// ── Per-creator overrides ─────────────────────────────────────────────────────

export async function setCreatorFeeOverride(formData: FormData) {
  const db = await requireAdmin()
  const creatorId = formData.get('creator_id') as string
  const raw = formData.get('fee_override') as string
  const feePercent = raw === '' ? null : parseFloat(raw)
  await db.from('creators').update({ fee_override_percent: feePercent }).eq('id', creatorId)
  revalidatePath('/admin')
}

export async function grantCreatorFreeMonths(formData: FormData) {
  const db = await requireAdmin()
  const creatorId = formData.get('creator_id') as string
  const months = parseInt(formData.get('months') as string)
  const until = new Date()
  until.setMonth(until.getMonth() + months)
  await db.from('creators').update({ subscription_free_until: until.toISOString() }).eq('id', creatorId)
  revalidatePath('/admin')
}

export async function removeCreatorFreeSubscription(creatorId: string) {
  const db = await requireAdmin()
  await db.from('creators').update({ subscription_free_until: null }).eq('id', creatorId)
  revalidatePath('/admin')
}

// ── Badge actions ─────────────────────────────────────────────────────────────

export async function addCreatorBadge(formData: FormData) {
  const db = await requireAdmin()
  const creatorId = formData.get('creator_id') as string
  const badge = (formData.get('badge') as string)?.trim()
  if (!badge) return

  const { data: creator } = await db.from('creators').select('badges').eq('id', creatorId).single()
  const current: string[] = creator?.badges ?? []
  if (current.includes(badge)) return

  await db.from('creators').update({ badges: [...current, badge] }).eq('id', creatorId)
  revalidatePath('/admin')
  revalidatePath('/browse')
}

export async function removeCreatorBadge(creatorId: string, badge: string) {
  const db = await requireAdmin()
  const { data: creator } = await db.from('creators').select('badges').eq('id', creatorId).single()
  const updated = (creator?.badges ?? []).filter((b: string) => b !== badge)
  await db.from('creators').update({ badges: updated }).eq('id', creatorId)
  revalidatePath('/admin')
  revalidatePath('/browse')
}
