import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'
import { ShoppingCart, Star, ArrowLeft, Heart, Truck, Shield, RotateCcw, Plus, Minus, Check } from 'lucide-react'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, addToCart, increase, decrease, cart } = useApp()
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)
  const [liked, setLiked] = useState(false)

  const product = products.find(p => p.id === Number(id))
  const cartItem = cart.find(i => i.id === Number(id))

  if (!product) return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg)',
    }}>
      <div style={{ fontSize: 56 }}>😕</div>
      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Product not found</p>
      <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '10px 28px', fontSize: 14 }}>
        Go Home
      </button>
    </div>
  )

  const images = product.images?.length ? product.images : [product.thumbnail]
  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0
  const originalUSD = discount ? product.price / (1 - discount / 100) : null

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 1020, margin: '0 auto' }}>
        <button onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          borderRadius: 26, padding: '32px',
          display: 'flex', gap: 40, flexWrap: 'wrap',
          boxShadow: 'var(--shadow-md)',
        }}>
          {/* Images */}
          <div style={{ flex: '1 1 320px' }}>
            <div style={{
              borderRadius: 18, overflow: 'hidden',
              background: 'var(--bg2)', marginBottom: 12, height: 360,
              border: '1.5px solid var(--border)',
            }}>
              <img src={images[activeImg]} alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)}
                  style={{
                    width: 64, height: 64, borderRadius: 12, overflow: 'hidden',
                    cursor: 'pointer',
                    border: `2.5px solid ${activeImg === i ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.15s',
                  }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{
              display: 'inline-flex',
              background: 'var(--accent-light)', color: 'var(--accent)',
              fontSize: 12, fontWeight: 700, padding: '4px 14px',
              borderRadius: 99, textTransform: 'capitalize', width: 'fit-content',
              border: '1px solid var(--border)',
            }}>
              {product.category}
            </span>

            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--text)', lineHeight: 1.25 }}>
              {product.title}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75 }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={16}
                    fill={i <= Math.round(product.rating) ? 'var(--accent)' : 'none'}
                    stroke="var(--accent)" />
                ))}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>· {product.stock} in stock</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-1px' }}>
                {toINR(product.price)}
              </span>
              {originalUSD && (
                <span style={{ fontSize: 16, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  {toINR(originalUSD)}
                </span>
              )}
              {discount > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                  color: '#fff', fontSize: 12, fontWeight: 800,
                  padding: '4px 12px', borderRadius: 99,
                }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                { icon: <Truck size={13} />, label: 'Free Delivery' },
                { icon: <Shield size={13} />, label: 'Warranty' },
                { icon: <RotateCcw size={13} />, label: 'Easy Returns' },
              ].map(p => (
                <div key={p.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'var(--accent-light)', color: 'var(--accent)',
                  fontSize: 12, fontWeight: 700,
                  padding: '6px 12px', borderRadius: 10,
                  border: '1px solid var(--border)',
                }}>
                  {p.icon} {p.label}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {cartItem ? (
                <div style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  borderRadius: 14, overflow: 'hidden',
                  border: '2px solid var(--accent)',
                }}>
                  <button onClick={() => decrease(product.id)}
                    style={{
                      flex: 1, padding: '13px 0',
                      background: 'var(--accent-light)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Minus size={18} />
                  </button>
                  <span style={{
                    flex: 1, textAlign: 'center',
                    fontSize: 18, fontWeight: 900, color: 'var(--accent)',
                    background: 'var(--card)', padding: '13px 0',
                  }}>
                    {cartItem.qty}
                  </span>
                  <button onClick={() => increase(product.id)}
                    style={{
                      flex: 1, padding: '13px 0',
                      background: 'var(--accent)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Plus size={18} />
                  </button>
                </div>
              ) : (
                <button onClick={() => addToCart(product)} className="btn-primary"
                  style={{ flex: 1, padding: '13px 0', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              )}
              <button onClick={() => setLiked(!liked)}
                style={{
                  width: 50, height: 50, borderRadius: 14,
                  border: `1.5px solid ${liked ? '#fca5a5' : 'var(--border)'}`,
                  background: liked ? '#fee2e2' : 'var(--card)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                <Heart size={20} fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'var(--muted)'} />
              </button>
            </div>

            {cartItem && (
              <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Check size={14} /> {cartItem.qty} in cart · {toINR(product.price * cartItem.qty)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
