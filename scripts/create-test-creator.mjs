import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
const vars = Object.fromEntries(
  env.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=')
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()]
    })
    .filter(([k]) => k)
)

const supabase = createClient(vars.NEXT_PUBLIC_SUPABASE_URL, vars.SUPABASE_SERVICE_ROLE_KEY)

// Check if auth user already exists
let userId
const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers()
const existing = existingUsers.find(u => u.email === 'creator@test.com')

if (existing) {
  userId = existing.id
  console.log('Auth user already exists:', userId)
} else {
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'creator@test.com',
    password: 'testcreator123',
    email_confirm: true,
    user_metadata: { full_name: 'Test Creator' },
  })
  if (authError) {
    console.error('Auth error:', authError.message)
    process.exit(1)
  }
  userId = authData.user.id
  console.log('Created auth user:', userId)
  await new Promise(r => setTimeout(r, 1500))
}

// Insert creator profile
const { data: creator, error: creatorError } = await supabase
  .from('creators')
  .insert({
    user_id: userId,
    name: 'Test Creator Shop',
    bio: 'A test creator for development.',
    plan_type: 'free',
  })
  .select('id')
  .single()

if (creatorError) {
  console.error('Creator error:', creatorError.message)
  process.exit(1)
}

console.log('Created creator profile, id:', creator.id)
console.log('\nDone! Log in at http://localhost:3000/login with:')
console.log('  Email:    creator@test.com')
console.log('  Password: testcreator123')
console.log('\nThen go to /dashboard and connect your Stripe account.')
