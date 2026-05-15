// Add admin emails here. Both are case-insensitive matched.
export const ADMIN_EMAILS = [
  'joshcastle25@yahoo.com',
  'kaleigh@mothersidemarket.com',
]

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
