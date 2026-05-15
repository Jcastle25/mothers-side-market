# MOTHER SIDE MARKET — Session 5 Handoff for Claude Code

Last updated: May 15, 2026 (after Session 5 main chat work)
User: Josh Castle (beginner with code — walk through step-by-step)
Local path: `C:\Users\MyMD\mothers-side-market`
GitHub: `github.com/Jcastle25/mothers-side-market` (private)
Branch: `master`
Latest commit: `f43721b` — "Add Stripe Connect onboarding (start/return routes + dashboard button)"

═══════════════════════════════════════════════════════════════════
THE BUSINESS (UNCHANGED FROM PREVIOUS HANDOFFS)
═══════════════════════════════════════════════════════════════════

WHAT IT IS:
A digital AND physical products marketplace primarily for homeschool
families, stay-at-home moms, and teachers. Think Etsy meets Teachers
Pay Teachers, but with much lower fees.

LEGAL & DOMAIN:
- Legal Entity: Castle Haus LLC
- DBA: Mother Side Market — **OFFICIALLY FILED** with Texas SOS on 05/13/2026
  - File Number: 804409362
  - Document Number: 1586399640003
  - Certificate of Filing PDF saved
- Primary domain: mothersidemarket.com (Namecheap)
- Redirect domain: motherssidemarket.com (Namecheap)

WHO RUNS IT:
- Wife (Kaleigh) will run day-to-day (marketing, creator outreach, community)
- Josh keeps $180k day job and builds the technical side
- No external pressure to scale fast — bootstrap pace

PRICING MODEL:
- Creators pay $9.99/month subscription (required to sell, no free tier)
- Platform takes 10% per transaction (handled via Stripe)
- Creator pays Stripe processing fees (via on_behalf_of in checkout)
- Buyers pay nothing - free to browse and purchase
- Stripe Connect handles creator payouts automatically

═══════════════════════════════════════════════════════════════════
TECH STACK
═══════════════════════════════════════════════════════════════════

- Frontend: Next.js 16.2.6 (Turbopack) with TypeScript and Tailwind CSS
- Database: Supabase (PostgreSQL with Row Level Security)
- Auth: Supabase Auth (email/password)
- File Storage: Supabase Storage
- Payments: Stripe + Stripe Connect (NOW WORKING)
- Hosting: Vercel (account created, not deployed yet)
- Stripe CLI installed at C:\stripe

═══════════════════════════════════════════════════════════════════
🚨 CRITICAL STRIPE ACCOUNT CONTEXT (READ THIS FIRST)
═══════════════════════════════════════════════════════════════════

We hit a complex Stripe environment issue mid-session. Final state:

**Stripe has TWO test environments visible to Josh:**
1. **Main account in "Test mode"** — `acct_1TUvwA3VWPcxUmkW`
   - Stripe Connect is NOT enabled here in test mode
   - Stripe requires Connect to be enabled in sandbox first
   - .env.local keys do NOT belong to this environment

2. **"Motherside Market sandbox"** — `acct_1TUvwNKxI5rIihRC`
   - Stripe Connect IS enabled here ✅
   - Business model: Platform (Merchants → Mother Side Market flow)
   - All API keys in .env.local belong to THIS environment
   - Stripe CLI is authorized for THIS environment

**Why this matters for Claude Code:**
- All Stripe testing must be done while browser is in the SANDBOX
- DO NOT regenerate API keys from the main account — you'll break everything
- The old MAIN ACCOUNT test keys are commented out at the top of .env.local
  as backup if needed

═══════════════════════════════════════════════════════════════════
✅ COMPLETED IN SESSION 5 (THIS SESSION)
═══════════════════════════════════════════════════════════════════

QUICK WINS (all done, committed, pushed):
✅ Fixed "Browse first" button — now <a href="/browse">
✅ Fixed "Browse resources" button on homepage hero — now links to /browse
✅ Fixed "Start selling →" button on homepage hero — now links to /dashboard
✅ Deleted test product (with foreign key cascade — purchases, orders, then product)
✅ Replaced fake stats ("2,400+ resources, 340 creators, 18k families")
   with founding-stage messaging: "● FOUNDING CREATORS WANTED — first 50 get
   permanent badge" (pill-shaped badge with gold accent)

BUSINESS:
✅ DBA filed and APPROVED — Mother Side Market is officially live as
   DBA of Castle Haus LLC, certificate effective 05/13/2026
   - Saved to multiple places (cloud, email, local)

STRIPE CONNECT BUILD (the big one — fully working):
✅ Created /api/connect/start/route.ts
   - POST endpoint creates Stripe Express account, saves stripe_account_id
     to creators table, returns onboarding link
✅ Created /api/connect/return/route.ts
   - GET endpoint catches user returning from Stripe, checks account status
     (details_submitted, charges_enabled, payouts_enabled), redirects to
     /dashboard with ?stripe=success|incomplete|error
✅ Created app/dashboard/connect-stripe-button.tsx
   - Client component, calls /api/connect/start, redirects to Stripe URL
✅ Modified app/dashboard/page.tsx
   - Imported ConnectStripeButton
   - Replaced placeholder button in Payments section
✅ Successfully tested end-to-end:
   - Click button → Stripe Connect onboarding → fill test data →
     redirect back → dashboard shows "Stripe account connected"
✅ Stripe CLI re-authorized to sandbox (account: acct_1TUvwNKxI5rIihRC)
✅ Updated STRIPE_WEBHOOK_SECRET in .env.local
✅ Restarted dev server
✅ Uploaded a fresh test product (creator successfully created one post-key-swap)

═══════════════════════════════════════════════════════════════════
🐛 BUGS DISCOVERED (NOT YET FIXED) — IMPORTANT
═══════════════════════════════════════════════════════════════════

🐛 BUG #1 — SIGNUP FORCES CREATOR ONBOARDING
   - When new user signs up, they're immediately taken to creator profile
     setup with no option to skip
   - This is wrong for a marketplace — buyers should NOT be forced into
     creator setup
   - Database supports both is_buyer and is_creator on users table
   - Fix: Make signup default to buyer-only role. Add a separate "Become
     a creator" call-to-action somewhere (probably on dashboard or as a
     menu item) that triggers creator profile setup
   - This blocks the marketplace UX — needs fix before launch

🐛 BUG #2 — DEV SERVER LOGS SHOWING UNUSUAL VOLUME OF GET /
   - Saw a rapid stream of GET / 200 responses in dev server logs at
     one point during session
   - Could be auto-refresh from a stale tab, or could be a real issue
   - Worth investigating: is there a polling/infinite-loop somewhere?

🐛 NOTE — .claude/worktrees/awesome-tharp-41378e got committed accidentally
   - Should add `.claude/` to .gitignore to prevent future inclusion
   - Not harmful, just noise

═══════════════════════════════════════════════════════════════════
🎯 IMMEDIATE NEXT STEPS (FOR CLAUDE CODE TO TACKLE)
═══════════════════════════════════════════════════════════════════

PRIORITY 1 — FINISH TESTING THE FULL PURCHASE FLOW
We stopped here when user hit signup-forces-creator bug.

To resume:
1. Either fix Bug #1 above (signup as buyer), OR
2. Quick workaround: create buyer user via Supabase auth dashboard
   directly, then test purchase

Once buyer can purchase:
1. Open incognito window, log in as buyer
2. Browse to test product, click buy
3. Pay with test card 4242 4242 4242 4242 / 12/30 / 123 / any zip
4. Verify on success:
   - Order row appears in Supabase orders table
   - Purchase row appears in purchases table
   - Stripe CLI listener shows checkout.session.completed event
   - on_behalf_of fired (creator pays processing fees, platform keeps clean 10%)

PRIORITY 2 — FIX SIGNUP UX (BUG #1)
- Decouple buyer signup from creator onboarding
- Default new users to is_buyer=true, is_creator=false
- Move creator profile setup to a separate trigger (button on dashboard?)

PRIORITY 3 — BLOCK PRODUCT PUBLISHING WITHOUT CONNECTED STRIPE
- In /api/checkout or /dashboard/upload, check creator.stripe_account_id
- If null, prevent publishing or show "Connect Stripe first" message
- This protects against creators listing products they can't get paid for

PRIORITY 4 — SECURE DOWNLOAD ENDPOINT
- /api/download/[id] route needs to be built
- Verify purchase exists for user + product
- Return signed Supabase Storage URL (not direct file path)
- Increment download_count on purchases table

PRIORITY 5 — DASHBOARD UX POLISH
- Handle ?stripe=success|incomplete|error query params on /dashboard
- Show toast/banner messages based on status
- After successful Connect, the dashboard already shows "Stripe account
  connected" but no confirmation toast appears

PRIORITY 6 — CREATOR STOREFRONT PAGE
- /shop/[handle] public page
- Lists all creator's published products
- Bio, profile image, social links

PRIORITY 7 — ADMIN PAGE (WIFE WILL USE THIS DAILY)
- Hardcoded admin email auth (Josh + Kaleigh only)
- Manage users (list, view, block/unblock)
- Manage products (list, hide, delete)
- Adjust platform fee % and subscription price
- DB additions needed:
  - is_blocked column on users
  - is_hidden column on products
  - platform_settings table

PRIORITY 8 — DEPLOY TO VERCEL
- Connect GitHub repo
- Add ALL env variables (don't forget STRIPE_WEBHOOK_SECRET)
- Update Supabase Site URL + Redirect URL to real domain
- Connect mothersidemarket.com domain in Vercel

PRIORITY 9 — SWITCH TO LIVE STRIPE
- ONLY after business verification complete (already approved!)
- Update .env.local on Vercel (NOT local dev)
- Create live webhook endpoint in Stripe dashboard
- Update STRIPE_WEBHOOK_SECRET on Vercel
- 🚨 ACTIVATE STRIPE CONNECT IN LIVE MODE (currently only enabled in sandbox)

═══════════════════════════════════════════════════════════════════
DATABASE TABLES (UNCHANGED — all live in Supabase)
═══════════════════════════════════════════════════════════════════

users: id, email, is_buyer, is_creator, created_at
creators: id, user_id, name, bio, profile_image, plan_type,
          stripe_account_id, stripe_sub_id
products: id, creator_id, title, description, price (cents), category,
          file_url, preview_images, is_published, created_at,
          product_type, shipping_price, shipping_description,
          stock_quantity, weight_oz
orders: id, buyer_id, product_id, amount_cents, platform_fee_cents,
        stripe_payment_id, status, created_at, shipping_address (jsonb),
        shipping_status (text)
purchases: id, user_id, product_id, order_id, access_granted,
           download_count, granted_at
posts: id, creator_id, title, body, is_published, created_at

Views: creator_sales_summary, my_downloads
RLS policies on all tables. Auth trigger auto-creates user row on signup.

═══════════════════════════════════════════════════════════════════
SUPABASE STORAGE BUCKETS
═══════════════════════════════════════════════════════════════════

- product-files (private) — digital downloads
- product-images (public) — product preview photos

═══════════════════════════════════════════════════════════════════
PAGES BUILT AND WORKING
═══════════════════════════════════════════════════════════════════

✅ Homepage — /
✅ Browse marketplace — /browse
✅ Product detail page — /product/[id]
✅ Signup — /signup (HAS BUG #1)
✅ Login — /login
✅ Auth callback — /auth/callback
✅ Creator dashboard — /dashboard
✅ Creator profile setup — /dashboard/setup
✅ Product upload — /dashboard/upload
✅ My Purchases — /account/purchases
✅ Terms of Service — /terms
✅ Privacy Policy — /privacy

═══════════════════════════════════════════════════════════════════
API ROUTES
═══════════════════════════════════════════════════════════════════

✅ /api/checkout — creates Stripe checkout session, returns URL
✅ /api/webhooks/stripe — processes checkout.session.completed
✅ /api/connect/start — NEW IN SESSION 5 — creates Stripe Connect account
✅ /api/connect/return — NEW IN SESSION 5 — catches return from Stripe
❌ /api/download/[id] — NOT BUILT (PRIORITY 4)

═══════════════════════════════════════════════════════════════════
DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════

- Background: cream #FAF6F0
- Primary text: chocolate brown #3D2314
- Secondary text: #7A4A2E
- Gold accents: #C8965A
- Heading font: Cormorant Garamond (serif) and Georgia (serif)
- Body font: Jost
- Logo: wife's hand-drawn house illustration in /public folder

═══════════════════════════════════════════════════════════════════
ENVIRONMENT VARIABLES (.env.local — NOT IN GIT)
═══════════════════════════════════════════════════════════════════

NEXT_PUBLIC_SUPABASE_URL=https://ujzcficmisyapeisynns.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[set]
SUPABASE_SERVICE_ROLE_KEY=[set]

# CURRENT KEYS: belong to Motherside Market SANDBOX (acct_1TUvwNKxI5rIihRC)
# OLD MAIN ACCOUNT KEYS (acct_1TUvwA3VWPcxUmkW) commented out as backup
STRIPE_SECRET_KEY=sk_test_[sandbox key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[sandbox key]
STRIPE_WEBHOOK_SECRET=whsec_[generated by Stripe CLI when listener starts]

NEXT_PUBLIC_SITE_URL=http://localhost:3000

═══════════════════════════════════════════════════════════════════
🛠️ HOW TO RUN LOCAL DEV (THREE TERMINALS REQUIRED)
═══════════════════════════════════════════════════════════════════

Terminal 1 — Next.js dev server:
    npm run dev
    (Runs on http://localhost:3000)

Terminal 2 — Git/file operations (as needed)

Terminal 3 — Stripe webhook listener:
    C:\stripe\stripe.exe listen --forward-to localhost:3000/api/webhooks/stripe
    (When it starts, it prints a whsec_... secret. If different from what's
     in .env.local, update .env.local and restart Terminal 1)

Test card for purchases: 4242 4242 4242 4242 / 12/30 / 123 / any zip

═══════════════════════════════════════════════════════════════════
USER CONTEXT FOR CLAUDE CODE
═══════════════════════════════════════════════════════════════════

- Josh is a BEGINNER with code. Walk him through changes step-by-step.
- Explain WHAT each piece of code does and WHY before writing it.
- He uses VS Code on Windows. File paths use backslashes.
- He's mobile-screenshot-limited (~50 images per chat). Be efficient
  with screenshot requests when possible.
- Confirm before doing destructive operations (delete, force push, etc.)
- He prefers seeing examples and reasoning over just being told "do this."
- His wife (Kaleigh) will use the admin features, so anything Kaleigh-
  facing needs to be intuitive.

═══════════════════════════════════════════════════════════════════
WHERE WE LEFT OFF (EXACT STATE)
═══════════════════════════════════════════════════════════════════

- Dev server running on localhost:3000
- Stripe CLI listener running, forwarding to localhost:3000/api/webhooks/stripe
- One test product uploaded by a creator who has connected Stripe in sandbox
- Trying to test full purchase flow as a BUYER but hit Bug #1 (signup
  forces creator onboarding)
- Discussion paused, switching to Claude Code

═══════════════════════════════════════════════════════════════════
SUGGESTED FIRST PROMPT FOR CLAUDE CODE
═══════════════════════════════════════════════════════════════════

"Read MOTHERSIDE_MARKET_HANDOFF.md from the project root for full context.

I want to start by fixing Bug #1 — the signup flow forces every new user
into creator setup. I need new users to default to buyer-only role.
Buyers should be able to browse and buy without ever creating a creator
profile.

Once that's fixed, I want to:
1. Test a full purchase flow with a buyer account
2. Verify the order saves to Supabase and Stripe Connect routes the 10%
   platform fee correctly

Show me your plan before writing code. I'm a beginner — walk me through it."

═══════════════════════════════════════════════════════════════════
DON'T FORGET
═══════════════════════════════════════════════════════════════════

🔒 Never commit .env.local
🔒 Never expose Stripe secret keys in screenshots
🚨 The Stripe environment in .env.local is the SANDBOX — keep it that way
   until Vercel deployment (which will use a different .env)
🎯 ~ 4-6 hours of focused work away from soft-launch
🎯 ~ 8-12 hours away from public launch
