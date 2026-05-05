import { useState } from 'react'
import { ShoppingCart, Star, Heart, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, cart } = useApp()
  const navigate = useNavigate()
  const inCart = cart.find(i => i.id === product.id)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0
  const originalUSD = discount ? product.price / (1 - discount / 100) : null

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fade-up"
      style={{
        animationDelay: `${Math.min(index * 0.05, 0.8)}s`,
        background: 'var(--card)',
        border: `1.5px solid ${hovered ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-7px) scale(1.015)' : 'translateY(0) scale(1)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s',
      }}
    >
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: 'var(--bg2)' }}>
        <img
          src={product.thumbnail} alt={product.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.09)' : 'scale(1)',
            transition: 'transform 0.45s ease',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 55%)',
        }} />
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
            color: '#fff', fontSize: 11, fontWeight: 800,
            padding: '3px 10px', borderRadius: 99,
          }}>
            -{discount}%
          </div>
        )}
        {product.stock < 10 && (
          <div style={{
            position: 'absolute', top: discount > 0 ? 38 : 10, left: 10,
            background: '#ef4444', color: '#fff',
            fontSize: 11, fontWeight: 700,
            padding: '3px 10px', borderRadius: 99,
          }}>
            Low Stock
          </div>
        )}
        <button
          onClick={e => { e.stopPropagation(); setLiked(!liked) }}
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 34, height: 34, borderRadius: 99,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transform: liked ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.2s',
          }}
        >
          <Heart size={15} fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : '#666'} />
        </button>
        <div style={{
          position: 'absolute', bottom: 10, left: 10,
          background: 'rgba(0,0,0,0.58)', color: '#fff',
          fontSize: 11, fontWeight: 600,
          padding: '3px 10px', borderRadius: 99,
          textTransform: 'capitalize',
        }}>
          {product.category}
        </div>
        {inCart && (
          <div style={{
            position: 'absolute', bottom: 10, right: 10,
            background: 'var(--accent)', color: '#fff',
            fontSize: 11, fontWeight: 700,
            padding: '3px 10px', borderRadius: 99,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Check size={11} /> {inCart.qty}
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <p className="line-clamp-2" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
          {product.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12}
              fill={i <= Math.round(product.rating) ? 'var(--accent)' : 'none'}
              stroke="var(--accent)"
            />
          ))}
          <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 3 }}>{product.rating}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 'auto' }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>
            {toINR(product.price)}
          </span>
          {originalUSD && (
            <span style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through' }}>
              {toINR(originalUSD)}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary"
          style={{
            width: '100%', padding: '10px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 13,
            background: added
              ? 'linear-gradient(135deg, #16a34a, #15803d)'
              : 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          }}
        >
          {added ? <Check size={14} /> : <ShoppingCart size={14} />}
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
