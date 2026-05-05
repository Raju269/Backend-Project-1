import { User, Mail, Phone, MapPin, Package, Heart, Settings, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'

export default function Profile() {
  const { cart, cartTotal } = useApp()

  const stats = [
    { icon: '🛒', label: 'Cart Items', value: cart.length },
    { icon: '💰', label: 'Cart Value', value: toINR(cartTotal) },
    { icon: '📦', label: 'Orders', value: 12 },
    { icon: '❤️', label: 'Wishlist', value: 5 },
  ]

  const details = [
    { icon: <User size={16} />, label: 'Full Name', value: 'John Doe' },
    { icon: <Mail size={16} />, label: 'Email', value: 'john.doe@example.com' },
    { icon: <Phone size={16} />, label: 'Phone', value: '+91 98765 43210' },
    { icon: <MapPin size={16} />, label: 'Address', value: '42, MG Road, Bengaluru, KA 560001' },
  ]

  const menuItems = [
    { icon: <Package size={16} />, label: 'My Orders' },
    { icon: <Heart size={16} />, label: 'Wishlist' },
    { icon: <Settings size={16} />, label: 'Settings' },
    { icon: <LogOut size={16} />, label: 'Sign Out', danger: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div style={{
          borderRadius: 24, padding: '32px',
          background: 'linear-gradient(135deg, #00c853 0%, #00897b 60%, #0288d1 100%)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,200,83,0.25)',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              border: '3px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, flexShrink: 0,
            }}>👤</div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>John Doe</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 10 }}>john.doe@example.com</p>
              <span style={{
                background: 'rgba(255,255,255,0.2)', color: '#fff',
                fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99,
                border: '1px solid rgba(255,255,255,0.3)',
              }}>⭐ Premium Member</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 18, padding: '20px 16px', textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 300px', background: 'var(--card)',
            border: '1.5px solid var(--border)', borderRadius: 20, padding: 24,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Account Details</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {details.map(d => (
                <div key={d.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: 'var(--bg)', borderRadius: 12, padding: '12px 14px',
                }}>
                  <span style={{ color: 'var(--accent)', display: 'flex', flexShrink: 0 }}>{d.icon}</span>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginBottom: 2 }}>{d.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            flex: '0 1 220px', background: 'var(--card)',
            border: '1.5px solid var(--border)', borderRadius: 20, padding: 24,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Quick Menu</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {menuItems.map(m => (
                <button key={m.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 12px', borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    color: m.danger ? '#ef4444' : 'var(--text)',
                    background: 'transparent', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = m.danger ? '#fee2e2' : 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ color: m.danger ? '#ef4444' : 'var(--accent)' }}>{m.icon}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
