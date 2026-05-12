import Link from 'next/link'
import MarketLogo from '@/components/Logo'

export default function PrivacyPage() {
  return (
    <main style={{ fontFamily: "'Jost', sans-serif", background: '#FAF6F0', minHeight: '100vh', color: '#3D2314' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: '66px',
        background: 'rgba(250,246,240,0.94)',
        borderBottom: '1px solid rgba(61,35,20,0.12)',
      }}>
        <Link href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#3D2314', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MarketLogo size={32} />
            Mother Side Market
          </div>
        </Link>
        <Link href="/" style={{ color: '#3D2314', fontSize: '13px' }}>
          Back to home
        </Link>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 48px' }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', fontWeight: 500, color: '#3D2314', marginBottom: '8px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '32px' }}>
          Last updated: May 11, 2026
        </p>

        <div style={{ display: 'grid', gap: '32px' }}>
          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              1. Introduction
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Mother&apos;s Side Market (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              2. Information We Collect
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Account Information:</strong> Email address, name, password (encrypted), and optional profile picture.</p>
              <p style={{ marginTop: '12px' }}><strong>Payment Information:</strong> Payment details are processed by Stripe. We do not store full credit card numbers; Stripe provides us with tokenized payment identifiers only.</p>
              <p style={{ marginTop: '12px' }}><strong>Creator Information:</strong> For sellers, we collect store name, bio, profile image, Stripe Connect account ID, and subscription status.</p>
              <p style={{ marginTop: '12px' }}><strong>Product Information:</strong> For sellers, we collect product titles, descriptions, prices, file uploads (for digital products), preview images, and shipping details (for physical products).</p>
              <p style={{ marginTop: '12px' }}><strong>Purchase History:</strong> We store records of products bought, order dates, amounts paid, and download access logs.</p>
              <p style={{ marginTop: '12px' }}><strong>Shipping Information:</strong> For physical product purchases, we collect and store buyer shipping addresses temporarily to facilitate delivery.</p>
              <p style={{ marginTop: '12px' }}><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent, and search terms (via analytics).</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              3. How We Use Your Information
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>To Operate the Platform:</strong> Manage accounts, process payments, fulfill orders, and deliver digital products.</p>
              <p style={{ marginTop: '12px' }}><strong>Billing & Payments:</strong> Process subscription fees ($9.99/month for creators), charge the 10% platform transaction fee on all sales (deducted automatically), and calculate seller earnings. Payment information is processed by Stripe and is not stored on our servers.</p>
              <p style={{ marginTop: '12px' }}><strong>Communication:</strong> Send transactional emails (order confirmations, receipts, password resets) and optional marketing emails (with your consent).</p>
              <p style={{ marginTop: '12px' }}><strong>Analytics:</strong> Understand user behavior, improve the Platform, and optimize features.</p>
              <p style={{ marginTop: '12px' }}><strong>Fraud Prevention:</strong> Detect and prevent fraudulent transactions and account abuse.</p>
              <p style={{ marginTop: '12px' }}><strong>Legal Compliance:</strong> Comply with laws, regulations, and valid legal requests.</p>
              <p style={{ marginTop: '12px' }}><strong>Support:</strong> Respond to customer inquiries and provide technical support.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              4. Sharing of Information
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>With Service Providers:</strong> Stripe (payments), Supabase (database hosting), and other vendors necessary to operate the Platform. These vendors are contractually bound to protect your data.</p>
              <p style={{ marginTop: '12px' }}><strong>With Sellers:</strong> Buyers&apos; shipping addresses are shared with sellers only to fulfill physical product orders.</p>
              <p style={{ marginTop: '12px' }}><strong>With Buyers:</strong> Seller names and public profiles are visible on product listings.</p>
              <p style={{ marginTop: '12px' }}><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our legal rights.</p>
              <p style={{ marginTop: '12px' }}><strong>Business Transfers:</strong> If Mother&apos;s Side Market is acquired or merged, your information may be transferred to the acquiring entity.</p>
              <p style={{ marginTop: '12px' }}><strong>With Your Consent:</strong> We do not sell personal information. We will not share information beyond what is necessary unless you explicitly consent.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              5. Data Security
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Password encryption and hashing</li>
                <li>Secure servers with restricted access</li>
                <li>Regular security audits</li>
              </ul>
              <p style={{ marginTop: '12px' }}>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              6. Your Data Rights
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Access:</strong> You can access your account information anytime by logging into your account.</p>
              <p style={{ marginTop: '12px' }}><strong>Correction:</strong> You can update your profile information directly in your account settings.</p>
              <p style={{ marginTop: '12px' }}><strong>Deletion:</strong> You can request deletion of your account and associated personal data by contacting us. Some data may be retained for legal or operational purposes.</p>
              <p style={{ marginTop: '12px' }}><strong>Opt-Out:</strong> You can unsubscribe from marketing emails at any time using the link in our emails.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              7. Cookies and Tracking
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              We use cookies and similar tracking technologies to enhance your experience, remember preferences, and analyze usage. You can control cookie settings in your browser, though some features may not function properly if cookies are disabled.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              8. Digital Product Downloads
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              We track download access to digital products to confirm purchase authorization. Downloaded files are served from secure, private storage. We maintain logs of who has accessed each digital product for buyer support and fraud prevention.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              9. Children&apos;s Privacy
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Mother&apos;s Side Market is not intended for children under 13. We do not knowingly collect information from children under 13. If we learn that we have collected information from a child under 13, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              10. Third-Party Links
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Our Platform may contain links to third-party websites. We are not responsible for the privacy practices of external sites. We encourage you to review their privacy policies before providing any information.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              11. Changes to This Privacy Policy
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              We may update this Privacy Policy periodically. Material changes will be announced via email or a prominent notice on the Platform. Your continued use of the Platform constitutes acceptance of updated policies.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              12. Contact Us
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8, marginTop: '12px' }}>
              <strong>Email:</strong> support@mothersidemarket.com
            </p>
          </section>

          <section style={{ padding: '20px', borderRadius: '18px', background: 'rgba(61,35,20,0.06)' }}>
            <p style={{ fontSize: '14px', color: '#7A4A2E', margin: 0 }}>
              Your privacy is important to us. We are committed to transparency and data protection.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
