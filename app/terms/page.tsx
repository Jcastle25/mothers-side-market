import Link from 'next/link'
import MarketLogo from '@/components/Logo'

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ fontSize: '14px', color: '#7A4A2E', marginBottom: '32px' }}>
          Last updated: May 11, 2026
        </p>

        <div style={{ display: 'grid', gap: '32px' }}>
          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              1. Overview
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Mother&apos;s Side Market (&quot;Platform&quot;) is a marketplace for homeschool resources, including digital products (downloadable files) and physical products (shipped items). By using this Platform, you agree to these Terms of Service.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              2. Buyer Responsibilities
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Pricing:</strong> All prices are displayed in USD. Buyers are responsible for applicable taxes in their jurisdiction.</p>
              <p style={{ marginTop: '12px' }}><strong>Digital Products:</strong> Digital products are delivered immediately upon successful payment. No refunds are issued for digital products once access has been granted.</p>
              <p style={{ marginTop: '12px' }}><strong>Physical Products:</strong> Buyers are responsible for shipping costs as set by the seller. Sellers bear responsibility for packaging, shipping, and delivery of physical items. Please allow 3–5 business days for processing before shipment.</p>
              <p style={{ marginTop: '12px' }}><strong>Shipping Address:</strong> Provide accurate shipping information. We are not responsible for delivery to incorrect addresses.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              3. Seller Responsibilities
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Creator Subscription:</strong> All sellers must maintain an active subscription at $9.99/month to list and sell products.</p>
              <p style={{ marginTop: '12px' }}><strong>Platform Fee:</strong> Mother&apos;s Side Market charges a 10% platform fee on all sales. This fee is deducted from seller earnings.</p>
              <p style={{ marginTop: '12px' }}><strong>Product Quality:</strong> Sellers are responsible for the quality, legality, and accuracy of their products. All products must comply with applicable laws.</p>
              <p style={{ marginTop: '12px' }}><strong>Physical Product Shipping:</strong> Sellers are responsible for all aspects of shipping physical products, including packaging, carrier selection, and tracking updates. Sellers must ship items within the timeframe they specify on their product listing.</p>
              <p style={{ marginTop: '12px' }}><strong>Digital Product Delivery:</strong> Sellers must provide functional, complete digital files. Files must be free of malware and viruses.</p>
              <p style={{ marginTop: '12px' }}><strong>No Misrepresentation:</strong> Sellers agree not to misrepresent product contents, seller information, or credentials.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              4. Payment and Billing
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Payment Processing:</strong> All payments are processed securely through Stripe. We do not store payment card information.</p>
              <p style={{ marginTop: '12px' }}><strong>Creator Subscription:</strong> The $9.99/month creator subscription renews automatically. Sellers can cancel anytime through their account settings.</p>
              <p style={{ marginTop: '12px' }}><strong>Platform Transaction Fee:</strong> Mother&apos;s Side Market charges a 10% platform fee on all transactions. This fee is deducted automatically from each sale and covers platform operations, payment processing, and support services.</p>
              <p style={{ marginTop: '12px' }}><strong>Earnings:</strong> Seller earnings are calculated as (Sale Price – 10% Platform Fee – Stripe Processing Fee). Payouts are issued monthly via Stripe Connect.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              5. Refund Policy
            </h2>
            <div style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              <p><strong>Digital Products:</strong> No refunds are issued for digital products. Buyers have access immediately upon purchase and can download their files at any time.</p>
              <p style={{ marginTop: '12px' }}><strong>Physical Products:</strong> Refunds for physical products are handled between buyer and seller. Mother&apos;s Side Market does not mediate physical product disputes unless fraud is suspected.</p>
              <p style={{ marginTop: '12px' }}><strong>Defective Items:</strong> If a physical item arrives damaged or defective, contact the seller directly within 14 days of receipt.</p>
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              6. Prohibited Activities
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Sellers and buyers agree not to:
            </p>
            <ul style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8, paddingLeft: '24px', marginTop: '12px' }}>
              <li>Sell illegal content or products that violate intellectual property rights</li>
              <li>Engage in fraudulent activity or misrepresentation</li>
              <li>Attempt to bypass the Platform&apos;s payment system</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Distribute malware, viruses, or harmful files</li>
              <li>Violate the privacy or security of the Platform</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              7. Limitation of Liability
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Mother&apos;s Side Market is provided &quot;as is&quot; without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the Platform, including loss of data or earnings.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              8. Termination
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              Mother&apos;s Side Market reserves the right to suspend or terminate accounts that violate these terms, engage in fraud, or pose a risk to the Platform&apos;s community.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 500, color: '#3D2314', marginBottom: '12px' }}>
              9. Changes to These Terms
            </h2>
            <p style={{ fontSize: '15px', color: '#7A4A2E', lineHeight: 1.8 }}>
              We may update these Terms of Service at any time. Your continued use of the Platform constitutes acceptance of updated terms.
            </p>
          </section>

          <section style={{ padding: '20px', borderRadius: '18px', background: 'rgba(61,35,20,0.06)' }}>
            <p style={{ fontSize: '14px', color: '#7A4A2E', margin: 0 }}>
              For questions about these terms, contact us at support@mothersidemarket.com
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
