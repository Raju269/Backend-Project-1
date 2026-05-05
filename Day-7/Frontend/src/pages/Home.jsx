import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import FilterSidebar from '../components/FilterSidebar'

export default function Home() {
  const { products, loading, search } = useApp()
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [priceRange, setPriceRange] = useState(2000)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    if (category !== 'All') list = list.filter(p => p.category === category)
    list = list.filter(p => p.price <= priceRange)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating-desc') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'name-asc') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, search, category, sort, priceRange])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #00c853 0%, #00897b 50%, #0288d1 100%)',
        padding: '60px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.15)',
            padding: '6px 16px', borderRadius: 99,
            fontSize: 13, fontWeight: 600, color: '#fff',
            marginBottom: 16,
          }}>
            ✨ 30 Fresh Products Available
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.15, marginBottom: 14,
            letterSpacing: '-1px',
          }}>
            Discover Amazing<br />Products Today
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            Shop the best deals across all categories. Great prices, fast delivery.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px 60px', display: 'flex', gap: 24 }}>
        <FilterSidebar
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
          priceRange={priceRange} setPriceRange={setPriceRange}
          open={sidebarOpen} setOpen={setSidebarOpen}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
              {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 320 }} />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>No products found</p>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>Try adjusting your filters</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
