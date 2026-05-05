import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'

const CATEGORIES = [
  'All','beauty','fragrances','furniture','groceries','home-decoration',
  'kitchen-accessories','laptops','mens-shirts','mens-shoes','mens-watches',
  'mobile-accessories','motorcycle','skin-care','smartphones','sports-accessories',
  'sunglasses','tablets','tops','vehicle','womens-bags','womens-dresses',
  'womens-jewellery','womens-shoes','womens-watches',
]

const SORT_OPTIONS = [
  { value: 'default', label: '✦ Default' },
  { value: 'price-asc', label: '↑ Price: Low to High' },
  { value: 'price-desc', label: '↓ Price: High to Low' },
  { value: 'rating-desc', label: '★ Top Rated' },
  { value: 'name-asc', label: 'A–Z Name' },
]

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: open ? 12 : 0, background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 700, color: 'var(--muted)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  )
}

export default function FilterSidebar({ category, setCategory, sort, setSort, priceRange, setPriceRange, open, setOpen }) {
  const content = (
    <div style={{ padding: '20px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
          <SlidersHorizontal size={17} color="var(--accent)" /> Filters
        </span>
        <button onClick={() => setOpen(false)}
          style={{ color: 'var(--muted)', display: 'flex', padding: 4 }}
          className="close-btn">
          <X size={18} />
        </button>
      </div>

      <Section title="Sort By">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => setSort(opt.value)}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: 600,
                background: sort === opt.value ? 'var(--accent)' : 'transparent',
                color: sort === opt.value ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s',
              }}>
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Max Price">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>$0</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>${priceRange}</span>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>$2000</span>
          </div>
          <input type="range" min={10} max={2000} value={priceRange}
            onChange={e => setPriceRange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
        </div>
      </Section>

      <Section title="Category">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 280, overflowY: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setOpen(false) }}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: 600, textTransform: 'capitalize',
                background: category === cat ? 'var(--accent)' : 'transparent',
                color: category === cat ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s',
              }}>
              {cat === 'All' ? '🏠 All Products' : cat.replace(/-/g, ' ')}
            </button>
          ))}
        </div>
      </Section>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(true)}
        style={{
          display: 'none', alignItems: 'center', gap: 7,
          padding: '9px 16px', borderRadius: 12,
          border: '1.5px solid var(--border)',
          background: 'var(--card)', color: 'var(--accent)',
          fontSize: 14, fontWeight: 700, marginBottom: 16,
        }}
        className="filter-toggle">
        <SlidersHorizontal size={16} /> Filters &amp; Sort
      </button>

      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.5)',
          }}
          className="mobile-overlay" />
      )}

      {/* Mobile drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50,
        width: 280, overflowY: 'auto',
        background: 'var(--card)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
        className="mobile-drawer">
        {content}
      </div>

      {/* Desktop sidebar */}
      <aside style={{
        width: 220, flexShrink: 0,
        background: 'var(--card)',
        border: '1.5px solid var(--border)',
        borderRadius: 20,
        alignSelf: 'flex-start',
        position: 'sticky', top: 80,
        boxShadow: 'var(--shadow-sm)',
      }}
        className="desktop-sidebar">
        {content}
      </aside>

      <style>{`
        @media (max-width: 900px) {
          .desktop-sidebar { display: none !important; }
          .filter-toggle { display: flex !important; }
          .close-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-overlay { display: none !important; }
          .mobile-drawer { display: none !important; }
          .close-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
