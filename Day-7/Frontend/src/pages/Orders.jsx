import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'
import api from '../utils/api'
import { Package, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react'

const STATUS_CONFIG = {
  pending:   { color: '#f59e0b', bg: '#fef3c7', icon: <Clock size={14} />,        label: 'Pending' },
  confirmed: { color: '#16a34a', bg: '#dcfce7', icon: <CheckCircle size={14} />,  label: 'Confirmed' },
  cancelled: { color: '#ef4444', bg: '#fee2e2', icon: <XCircle size={14} />,      label: 'Cancelled' },
}

export default function Orders() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    api.get(`/orders/user/${user.id}`)
      .then(r => setOrders(r.data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <button onClick={() => navigate('/profile')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={17} /> Back to Profile
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 24 }}>
          📦 My Orders
        </h1>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Package size={64} color="var(--border)" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>No orders yet</p>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Start shopping to see your orders here</p>
            <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '10px 28px', fontSize: 14 }}>
              Shop Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
              return (
                <div key={order._id} style={{
                  background: 'var(--card)', border: '1.5px solid var(--border)',
                  borderRadius: 20, padding: 22, boxShadow: 'var(--shadow-sm)',
                }}>
                  {/* Order header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                        Order ID: <span style={{ fontWeight: 700, color: 'var(--text)' }}>#{order._id.slice(-8).toUpperCase()}</span>
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: cfg.bg, color: cfg.color, fontSize: 13, fontWeight: 700, padding: '5px 12px', borderRadius: 99 }}>
                      {cfg.icon} {cfg.label}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.thumbnail && <img src={item.thumbnail} alt={item.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="line-clamp-2" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Qty: {item.qty} × {toINR(item.price)}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>{toINR(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {order.address?.city && <span>📍 {order.address.city}, {order.address.state}</span>}
                      {order.coupon && <span style={{ marginLeft: 12, color: '#16a34a', fontWeight: 700 }}>🏷️ {order.coupon} applied</span>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 12, color: 'var(--muted)' }}>Grand Total</p>
                      <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)' }}>{toINR(order.grandTotal)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
