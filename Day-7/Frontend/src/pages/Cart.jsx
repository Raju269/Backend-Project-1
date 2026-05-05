import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, X, ShoppingCart } from 'lucide-react'

export default function Cart() {
  const { cart, increase, decrease, removeFromCart, clearCart, cartTotal } = useApp()
  const navigate = useNavigate()

  if (cart.length === 0) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
    }}>
      <div style={{
        width: 110, height: 110, borderRadius: '50%',
        background: 'var(--accent-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 16px var(--bg2)',
      }}>
        <ShoppingBag size={48} color="var(--accent)" />
      </div>
      <p style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>Cart is empty</p>
      <p style={{ fontSize: 14, color: 'var(--muted)' }}>Add some products to get started</p>
      <button onClick={() => navigate('/')} className="btn-primary"
        style={{ padding: '12px 32px', fontSize: 15, marginTop: 8 }}>
        Start Shopping
      </button>
    </div>
  )

  const gst = cartTotal * 0.18
  const grandTotal = cartTotal + gst

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 980, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <button onClick={() => navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
              <ArrowLeft size={17} /> Continue Shopping
            </button>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--text)' }}>
              🛒 Your Cart
              <span style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 500, marginLeft: 10 }}>
                ({cart.length} item{cart.length !== 1 ? 's' : ''})
              </span>
            </h1>
          </div>
          <button onClick={clearCart}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10,
              background: '#fee2e2', color: '#ef4444',
              fontSize: 13, fontWeight: 700,
            }}>
            <X size={15} /> Clear All
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Cart items */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: 'var(--card)',
                border: '1.5px solid var(--border)',
                borderRadius: 18, padding: '14px 16px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <img src={item.thumbnail} alt={item.title}
                  onClick={() => navigate(`/product/${item.id}`)}
                  style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="line-clamp-2" style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 19, fontWeight: 900, color: 'var(--accent)' }}>
                    {toINR(item.price)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    Subtotal: {toINR(item.price * item.qty)}
                  </p>
                </div>

                {/* Qty controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => decrease(item.id)}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: '1.5px solid var(--border)',
                      background: 'var(--bg)', color: 'var(--text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', minWidth: 28, textAlign: 'center' }}>
                    {item.qty}
                  </span>
                  <button onClick={() => increase(item.id)}
                    style={{
                      width: 32, height: 32, borderRadius: 8,
                      border: '1.5px solid var(--border)',
                      background: 'var(--bg)', color: 'var(--text)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Plus size={14} />
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id)}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: '#fee2e2', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ flex: '0 0 290px' }}>
            <div style={{
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
              borderRadius: 22, padding: 26,
              position: 'sticky', top: 80,
              boxShadow: 'var(--shadow-md)',
            }}>
              {/* Green top bar */}
              <div style={{
                height: 4, borderRadius: 99, marginBottom: 20,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
              }} />

              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)', marginBottom: 20 }}>
                Order Summary
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                <SummaryRow label={`Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} items)`} value={toINR(cartTotal)} />
                <SummaryRow label="Shipping" value="FREE 🎉" valueColor="var(--accent)" />
                <SummaryRow label="GST (18%)" value={toINR(gst)} />
              </div>

              <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Grand Total</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>
                    {toINR(grandTotal)}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Inclusive of all taxes</p>
              </div>

              {/* Coupon */}
              <div style={{
                display: 'flex', gap: 8, marginBottom: 20,
                background: 'var(--bg)', borderRadius: 12, padding: '9px 14px',
                border: '1.5px solid var(--border)',
              }}>
                <Tag size={15} color="var(--muted)" style={{ flexShrink: 0 }} />
                <input placeholder="Enter coupon code"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)' }} />
                <button style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)' }}>Apply</button>
              </div>

              {/* Checkout button */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary"
                style={{
                  width: '100%', padding: '15px 0', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  borderRadius: 14,
                }}>
                <ShoppingCart size={18} />
                Proceed to Checkout
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
                🔒 Secure · UPI · Cards · NetBanking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: valueColor || 'var(--text)' }}>{value}</span>
    </div>
  )
}
