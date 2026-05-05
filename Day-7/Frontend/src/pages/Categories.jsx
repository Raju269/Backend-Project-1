import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = [
  { name: 'beauty', emoji: '💄', color: '#fce7f3' },
  { name: 'fragrances', emoji: '🌸', color: '#fdf4ff' },
  { name: 'furniture', emoji: '🛋️', color: '#fef3c7' },
  { name: 'groceries', emoji: '🛒', color: '#dcfce7' },
  { name: 'home-decoration', emoji: '🏠', color: '#e0f2fe' },
  { name: 'kitchen-accessories', emoji: '🍳', color: '#fff7ed' },
  { name: 'laptops', emoji: '💻', color: '#ede9fe' },
  { name: 'mens-shirts', emoji: '👔', color: '#dbeafe' },
  { name: 'mens-shoes', emoji: '👟', color: '#f0fdf4' },
  { name: 'mens-watches', emoji: '⌚', color: '#fef9c3' },
  { name: 'mobile-accessories', emoji: '📱', color: '#e0f2fe' },
  { name: 'motorcycle', emoji: '🏍️', color: '#fee2e2' },
  { name: 'skin-care', emoji: '🧴', color: '#fce7f3' },
  { name: 'smartphones', emoji: '📲', color: '#ede9fe' },
  { name: 'sports-accessories', emoji: '⚽', color: '#dcfce7' },
  { name: 'sunglasses', emoji: '🕶️', color: '#fef3c7' },
  { name: 'tablets', emoji: '📟', color: '#dbeafe' },
  { name: 'tops', emoji: '👕', color: '#f0fdf4' },
  { name: 'vehicle', emoji: '🚗', color: '#fee2e2' },
  { name: 'womens-bags', emoji: '👜', color: '#fdf4ff' },
  { name: 'womens-dresses', emoji: '👗', color: '#fce7f3' },
  { name: 'womens-jewellery', emoji: '💍', color: '#fef9c3' },
  { name: 'womens-shoes', emoji: '👠', color: '#fdf4ff' },
  { name: 'womens-watches', emoji: '⌚', color: '#fef3c7' },
]

export default function Categories() {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 20px 60px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>
            Browse Categories
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>
            {CATEGORIES.length} categories to explore
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="fade-up"
              style={{
                animationDelay: `${i * 0.03}s`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                padding: '24px 16px',
                borderRadius: 20,
                background: hovered === i ? cat.color : 'var(--card)',
                border: `1.5px solid ${hovered === i ? 'transparent' : 'var(--border)'}`,
                cursor: 'pointer',
                transform: hovered === i ? 'translateY(-5px) scale(1.03)' : 'translateY(0) scale(1)',
                transition: 'all 0.22s ease',
                boxShadow: hovered === i ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              }}>
              <span style={{ fontSize: 40, lineHeight: 1 }}>{cat.emoji}</span>
              <span style={{
                fontSize: 13, fontWeight: 700, textTransform: 'capitalize',
                color: 'var(--text)', textAlign: 'center', lineHeight: 1.3,
              }}>
                {cat.name.replace(/-/g, ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
