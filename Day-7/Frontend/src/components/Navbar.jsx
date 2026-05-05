import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Sun, Moon, Search, User, Home, Grid, LogIn, Menu, X, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { dark, setDark, search, setSearch, cartCount, user, logout } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    navigate('/')
    setMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navItems = [
    { to: '/', icon: <Home size={15} />, label: 'Home' },
    { to: '/categories', icon: <Grid size={15} />, label: 'Categories' },
    { to: '/cart', icon: <ShoppingCart size={15} />, label: 'Cart', badge: cartCount },
    { to: '/profile', icon: <User size={15} />, label: 'Profile' },
    ...(!user ? [{ to: '/login', icon: <LogIn size={15} />, label: 'Login' }] : []),
  ]

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1.5px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '0 20px', height: 64,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <Link to="/" style={{
          fontSize: 21, fontWeight: 900, color: 'var(--accent)',
          letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: 7,
          whiteSpace: 'nowrap',
        }}>
          🛍️ ShopZen
        </Link>

        <form onSubmit={handleSearch} className="desktop-only" style={{
          flex: 1, maxWidth: 400,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg)', border: '1.5px solid var(--border)',
          borderRadius: 99, padding: '8px 16px',
        }}>
          <Search size={15} color="var(--muted)" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }}
          />
        </form>

        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} style={{
              position: 'relative',
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', borderRadius: 10,
              fontSize: 14, fontWeight: 600,
              color: pathname === item.to ? 'var(--accent)' : 'var(--text2)',
              background: pathname === item.to ? 'var(--accent-light)' : 'transparent',
              transition: 'all 0.15s',
            }}>
              {item.icon}{item.label}
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: -3, right: -3,
                  background: 'var(--accent)', color: '#fff',
                  fontSize: 10, fontWeight: 800,
                  width: 18, height: 18, borderRadius: 99,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{item.badge}</span>
              )}
            </Link>
          ))}
          <button onClick={() => setDark(!dark)} style={{
            width: 38, height: 38, borderRadius: 10, marginLeft: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-light)', color: 'var(--accent)',
          }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 6 }}>
              <span style={{
                fontSize: 13, fontWeight: 700, color: 'var(--accent)',
                background: 'var(--accent-light)', padding: '5px 12px', borderRadius: 99,
                border: '1px solid var(--border)',
              }}>
                👤 {user.username}
              </span>
              <button onClick={handleLogout} style={{
                width: 36, height: 36, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fee2e2', color: '#ef4444',
              }}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="mobile-only" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/cart" style={{ position: 'relative', color: 'var(--accent)', display: 'flex' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: 'var(--accent)', color: '#fff',
                fontSize: 10, fontWeight: 800,
                width: 18, height: 18, borderRadius: 99,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </Link>
          <button onClick={() => setDark(!dark)} style={{
            width: 36, height: 36, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent-light)', color: 'var(--accent)',
          }}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: 'var(--text)', display: 'flex', padding: 4 }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className="mobile-only" style={{ padding: '0 20px 12px' }}>
        <form onSubmit={handleSearch} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg)', border: '1.5px solid var(--border)',
          borderRadius: 99, padding: '8px 16px',
        }}>
          <Search size={15} color="var(--muted)" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }}
          />
        </form>
      </div>

      {menuOpen && (
        <div style={{
          background: 'var(--card)', borderTop: '1px solid var(--border)',
          padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {navItems.map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12,
              fontSize: 15, fontWeight: 600,
              color: pathname === item.to ? 'var(--accent)' : 'var(--text)',
              background: pathname === item.to ? 'var(--accent-light)' : 'transparent',
            }}>
              {item.icon}{item.label}
              {item.badge > 0 && (
                <span style={{
                  marginLeft: 'auto', background: 'var(--accent)', color: '#fff',
                  fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                }}>{item.badge}</span>
              )}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-only { display: flex !important; }
          .mobile-only  { display: none  !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none  !important; }
          .mobile-only  { display: flex  !important; }
        }
      `}</style>
    </nav>
  )
}
