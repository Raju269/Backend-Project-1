import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { ArrowLeft } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price ↑' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'name-asc', label: 'A–Z' },
]

export default function CategoryPage() {
  const { category } = useParams()
  const { products, loading } = useApp()
  const navigate = useNavigate()
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let list = products.filter(p => p.category === category)
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sort === 'rating-desc') list.sort((a, b) => b.rating - a.rating)
    else if (sort === 'name-asc') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [products, category, sort])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>

        <button onClick={() => navigate('/categories')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={18} /> All Categories
        </button>

        {/* Banner */}
        <div style={{
          borderRadius: 24, padding: '32px 36px', marginBottom: 28,
          background: 'linear-gradient(135deg, #16a34a 0%, #0d9488 60%, #0ea5e9 100%)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(22,163,74,0.2)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', textTransform: 'capitalize', marginBottom: 6, position: 'relative', zIndex: 1 }}>
            {category?.replace(/-/g, ' ')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, position: 'relative', zIndex: 1 }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Sort pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginRight: 4 }}>Sort:</span>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setSort(opt.value)}
              style={{
                padding: '7px 16px', borderRadius: 99,
                fontSize: 13, fontWeight: 700,
                background: sort === opt.value ? 'var(--accent)' : 'var(--card)',
                color: sort === opt.value ? '#fff' : 'var(--text2)',
                border: `1.5px solid ${sort === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.15s',
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 320 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>😕</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>No products in this category</p>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 6 }}>
              Only 30 products are loaded — try another category
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
