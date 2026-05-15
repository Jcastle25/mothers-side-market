import type { Metadata } from "next";
import MarketLogo from '@/components/Logo'

export const metadata: Metadata = {
  title: "Mother Side Market",
  description: "Resources made by moms who get it",
};

export default function Home() {
  return (
    <main style={{
      fontFamily: "'Jost', sans-serif",
      background: "#FAF6F0",
      minHeight: "100vh",
      color: "#3D2314"
    }}>

      {/* NAV */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "66px",
        background: "rgba(250,246,240,0.94)",
        borderBottom: "1px solid rgba(61,35,20,0.12)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MarketLogo size={32} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {[{label: "Browse", href: "/browse"}, {label: "Categories", href: "/browse"}].map(link => (
            <a key={link.label} href={link.href} style={{ fontSize: "12px", color: "#7A4A2E", textDecoration: "none" }}>{link.label}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "9px" }}>
          <a href="/login" style={{ padding: "8px 18px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", fontSize: "12px", textDecoration: "none", display: "inline-block" }}>Log in</a>
          <a href="/dashboard" style={{ padding: "8px 20px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "12px", textDecoration: "none", display: "inline-block" }}>Start selling</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "92px 48px 76px", background: "#FAF6F0" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#C8965A", marginBottom: "20px" }}>
          ● The marketplace for homeschool families
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "62px", fontWeight: 500, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#3D2314", marginBottom: "20px", maxWidth: "640px" }}>
          Resources made by<br /><em style={{ color: "#5C3420" }}>moms who get it</em>
        </h1>
        <p style={{ fontSize: "15px", fontWeight: 300, lineHeight: 1.75, color: "#7A4A2E", maxWidth: "460px", marginBottom: "36px" }}>
          Printables, lesson plans, activity guides &amp; more — created by stay-at-home and homeschool moms who turned their skills into income, and shared with families who need them.
        </p>
        <div style={{ display: "flex", gap: "12px", marginBottom: "54px" }}>
          <a href="/browse" style={{ padding: "13px 30px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "13px", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Browse resources</a>
          <a href="/dashboard" style={{ padding: "13px 30px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", fontSize: "13px", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Start selling →</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px", border: "1px solid rgba(61,35,20,0.18)", borderRadius: "100px", background: "rgba(200,150,90,0.08)", maxWidth: "fit-content" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C8965A", flexShrink: 0 }}></span>
          <span style={{ fontSize: "12px", letterSpacing: "0.06em", color: "#3D2314", textTransform: "uppercase", fontWeight: 500 }}>Founding Creators Wanted</span>
          <span style={{ fontSize: "12px", color: "#7A4A2E" }}>— first 50 get permanent badge</span>
        </div>
      </section>

      {/* SEARCH */}
      <div style={{ margin: "0 48px 52px", background: "#FAF6F0", border: "1px solid rgba(61,35,20,0.22)", borderRadius: "16px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", boxShadow: "0 2px 20px rgba(61,35,20,0.07)" }}>
        <div style={{ flex: 1, minWidth: "180px", display: "flex", alignItems: "center", gap: "9px", background: "rgba(61,35,20,0.04)", border: "1px solid rgba(61,35,20,0.12)", borderRadius: "100px", padding: "9px 16px" }}>
          <span style={{ color: "#7A4A2E" }}>🔍</span>
          <input placeholder="Search worksheets, planners, meal ideas..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: "13px", color: "#3D2314", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
          {["All ages", "Toddler", "K–5", "Middle school", "Free only"].map(pill => (
            <button key={pill} style={{ fontSize: "11px", padding: "5px 13px", border: "1px solid rgba(61,35,20,0.12)", borderRadius: "100px", background: "transparent", color: "#7A4A2E", cursor: "pointer" }}>{pill}</button>
          ))}
        </div>
        <button style={{ padding: "9px 22px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "12px", cursor: "pointer" }}>Search</button>
      </div>

      {/* CATEGORIES */}
      <section style={{ padding: "0 48px 56px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "22px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 500, color: "#3D2314" }}>Browse by category</h2>
          <a href="/browse" style={{ fontSize: "12px", color: "#7A4A2E", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
          {["Homeschool resources", "Lesson plans", "Toddler activities", "Parenting tips", "Printables", "Snack & meal ideas", "Organization"].map(cat => (
            <button key={cat} style={{ fontSize: "12px", padding: "8px 15px", border: "1px solid rgba(61,35,20,0.22)", borderRadius: "10px", background: "#FAF6F0", color: "#3D2314", cursor: "pointer" }}>{cat}</button>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 48px 56px", background: "rgba(61,35,20,0.04)", border: "1px solid rgba(61,35,20,0.22)", borderRadius: "20px", padding: "52px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: 500, color: "#3D2314", marginBottom: "10px" }}>Ready to share your resources?</h2>
        <p style={{ fontSize: "14px", color: "#7A4A2E", marginBottom: "28px" }}>Be one of our founding creators. Low fees, direct payouts, and a community that gets it.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "11px" }}>
          <a href="/dashboard" style={{ padding: "13px 30px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "13px", textDecoration: "none", display: "inline-block" }}>Create your storefront</a>
          <a href="/browse" style={{ padding: "13px 30px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", fontSize: "13px", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>Browse first</a>
        </div>
        <p style={{ fontSize: "11px", color: "#7A4A2E", marginTop: "14px" }}>$9.99/month · 10% per sale · Cancel anytime</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(61,35,20,0.12)", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAF6F0" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MarketLogo size={24} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', fontWeight: 600, color: '#3D2314' }}>
            Mother Side Market
          </span>
        </div>
        <div style={{ display: "flex", gap: "22px" }}>
          {[
            
            { label: "Browse", href: "/browse" },
            { label: "Sell", href: "/dashboard" },
            { label: "Pricing", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" }
          ].map(link => (
            <a key={link.label} href={link.href} style={{ fontSize: "11px", color: "#7A4A2E", textDecoration: "none" }}>{link.label}</a>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "#7A4A2E", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MarketLogo size={24} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#3D2314', fontWeight: 600 }}>
            © 2025 Mother Side Market
          </span>
        </div>
      </footer>

    </main>
  );
}