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

// Check if already exists
const { data: { users } } = await supabase.auth.admin.listUsers()
const existing = users.find(u => u.email?.toLowerCase() === 'joshcastle25@yahoo.com')

if (existing) {
  console.log('Account already exists:', existing.id)
  console.log('Go to http://localhost:3000/login and log in with Joshcastle25@yahoo.com')
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'Joshcastle25@yahoo.com',
    password: 'changeme123',
    email_confirm: true,
    user_metadata: { full_name: 'Josh Castle' },
  })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Admin account created:', data.user.id)
    console.log('\nLog in at http://localhost:3000/login with:')
    console.log('  Email:    Joshcastle25@yahoo.com')
    console.log('  Password: changeme123')
    console.log('\nChange your password after logging in!')
  }
}
