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
          {["Browse", "Creators", "Categories", "Free resources"].map(link => (
            <a key={link} href="#" style={{ fontSize: "12px", color: "#7A4A2E", textDecoration: "none" }}>{link}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: "9px" }}>
          <button style={{ padding: "8px 18px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", cursor: "pointer", fontSize: "12px" }}>Log in</button>
          <button style={{ padding: "8px 20px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", cursor: "pointer", fontSize: "12px" }}>Start selling</button>
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
          Lesson plans, printables, activity guides &amp; meal ideas — crafted by real homeschool parents and shared with families like yours.
        </p>
        <div style={{ display: "flex", gap: "12px", marginBottom: "54px" }}>
          <button style={{ padding: "13px 30px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "13px", cursor: "pointer" }}>Browse resources</button>
          <button style={{ padding: "13px 30px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", fontSize: "13px", cursor: "pointer" }}>Start selling →</button>
        </div>
        <div style={{ display: "flex", gap: "38px" }}>
          {[["2,400+", "Resources"], ["340", "Creators"], ["18k", "Families"]].map(([num, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "30px", fontWeight: 600, color: "#3D2314", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: "10px", letterSpacing: "0.09em", color: "#7A4A2E", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
            </div>
          ))}
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
          <a href="#" style={{ fontSize: "12px", color: "#7A4A2E", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
          {["Homeschool resources", "Lesson plans", "Toddler activities", "Parenting tips", "Printables", "Snack & meal ideas", "Organization"].map(cat => (
            <button key={cat} style={{ fontSize: "12px", padding: "8px 15px", border: "1px solid rgba(61,35,20,0.22)", borderRadius: "10px", background: "#FAF6F0", color: "#3D2314", cursor: "pointer" }}>{cat}</button>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ padding: "0 48px 56px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "22px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 500, color: "#3D2314" }}>Popular right now</h2>
          <a href="#" style={{ fontSize: "12px", color: "#7A4A2E", textDecoration: "none" }}>See all →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { id: '101', title: "Kindergarten math bundle", creator: "Sarah M.", price: "$4.99", cat: "Lesson plans", badge: "Bestseller" },
            { id: '102', title: "30 toddler snack ideas", creator: "The Hive Mom", price: "$2.50", cat: "Snack & meal ideas", badge: "" },
            { id: '103', title: "Weekly homeschool planner", creator: "Plan It Mama", price: "$6.00", cat: "Organization", badge: "New" },
            { id: '104', title: "Alphabet tracing printables", creator: "Bright Beginnings", price: "$3.99", cat: "Printables", badge: "" },
            { id: '105', title: "Read-aloud book list K–3", creator: "Sarah M.", price: "Free", cat: "Homeschool resources", badge: "Free" },
            { id: '106', title: "Chore chart + reward system", creator: "Rooted Family Co.", price: "$5.50", cat: "Parenting tips", badge: "" },
          ].map((product) => (
            <div key={product.id} style={{ background: "#FAF6F0", border: "1px solid rgba(61,35,20,0.12)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 12px rgba(61,35,20,0.06)", cursor: "pointer" }}>
              <div style={{ height: "138px", background: "rgba(61,35,20,0.04)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {product.badge && <span style={{ position: "absolute", top: "9px", left: "9px", fontSize: "9px", fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", padding: "3px 9px", borderRadius: "100px", background: "#3D2314", color: "#FAF6F0" }}>{product.badge}</span>}
                <span style={{ fontSize: "36px" }}>📄</span>
              </div>
              <div style={{ padding: "13px 14px 16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7A4A2E", marginBottom: "4px" }}>{product.cat}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: 500, color: "#3D2314", lineHeight: 1.25, marginBottom: "5px" }}>{product.title}</div>
                <div style={{ fontSize: "11px", color: "#7A4A2E", marginBottom: "11px" }}>by {product.creator}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "19px", fontWeight: 600, color: "#3D2314" }}>{product.price}</span>
                  <span style={{ color: "#C8965A" }}>★★★★★</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <a href={`/product/${product.id}`} style={{ flex: 1, padding: '10px 12px', borderRadius: '100px', border: '1px solid rgba(61,35,20,0.12)', background: 'transparent', color: '#3D2314', textDecoration: 'none', fontSize: '12px', textAlign: 'center' }}>
                    View
                  </a>
                  <a href={`/checkout?productId=${product.id}`} style={{ flex: 1, padding: '10px 12px', borderRadius: '100px', border: 'none', background: '#3D2314', color: '#FAF6F0', textDecoration: 'none', fontSize: '12px', textAlign: 'center' }}>
                    Buy now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section style={{ padding: "0 48px 56px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 500, color: "#3D2314", marginBottom: "22px" }}>Why families love us</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {[
            { icon: "⭐", title: "Made by real moms", desc: "Every resource is created by parents who actually use these materials with their own children." },
            { icon: "✅", title: "Fair for creators", desc: "Just $9.99/month and a 10% fee — far below Etsy's 22%+ and Teachers Pay Teachers' 45%." },
            { icon: "⬇️", title: "Instant downloads", desc: "Pay once, download immediately, print at home. No subscriptions for buyers, no waiting." },
          ].map(card => (
            <div key={card.title} style={{ background: "#FAF6F0", border: "1px solid rgba(61,35,20,0.12)", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 10px rgba(61,35,20,0.05)" }}>
              <div style={{ fontSize: "24px", marginBottom: "12px" }}>{card.icon}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 500, color: "#3D2314", marginBottom: "8px" }}>{card.title}</div>
              <div style={{ fontSize: "13px", color: "#7A4A2E", lineHeight: 1.7 }}>{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "0 48px 56px", background: "rgba(61,35,20,0.04)", border: "1px solid rgba(61,35,20,0.22)", borderRadius: "20px", padding: "52px 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "36px", fontWeight: 500, color: "#3D2314", marginBottom: "10px" }}>Ready to share your resources?</h2>
        <p style={{ fontSize: "14px", color: "#7A4A2E", marginBottom: "28px" }}>Join hundreds of homeschool creators already earning on Mother Side Market.</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "11px" }}>
          <button style={{ padding: "13px 30px", borderRadius: "100px", border: "none", background: "#3D2314", color: "#FAF6F0", fontSize: "13px", cursor: "pointer" }}>Create your storefront</button>
          <button style={{ padding: "13px 30px", borderRadius: "100px", border: "1px solid rgba(61,35,20,0.22)", background: "transparent", color: "#3D2314", fontSize: "13px", cursor: "pointer" }}>Browse first</button>
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
            { label: "About", href: "#" },
            { label: "Browse", href: "#" },
            { label: "Sell", href: "#" },
            { label: "Pricing", href: "#" },
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