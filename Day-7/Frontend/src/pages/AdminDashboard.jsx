import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts'
import { toINR } from '../utils/currency'
import api from '../utils/api'
import { ShieldCheck, LogOut, Users, ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle, IndianRupee, RefreshCw } from 'lucide-react'

const STATUS_CFG = {
  pending:   { color: '#f59e0b', bg: '#fef3c7', label: 'Pending' },
  confirmed: { color: '#16a34a', bg: '#dcfce7', label: 'Confirmed' },
  cancelled: { color: '#ef4444', bg: '#fee2e2', label: 'Cancelled' },
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [tab, setTab] = useState('overview')
  const [admin, setAdmin] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Read from sessionStorage inside useEffect to avoid SSR/timing issues
    const stored = sessionStorage.getItem('adminAuth')
    if (!stored) {
      navigate('/admin')
      return
    }
    const parsed = JSON.parse(stored)
    setAdmin(parsed)
    setAuthChecked(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/orders'),
      ])
      setStats(statsRes.data)
      setOrders(ordersRes.data.orders)
    } catch (e) {
      console.error('Failed to fetch admin data', e)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      // Update local state immediately for instant UI feedback
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
      // Refresh stats in background
      api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    } catch (e) {
      console.error('Status update failed', e)
    } finally {
      setUpdating(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    navigate('/admin')
  }

  // Don't render until auth is confirmed
  if (!authChecked) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #1e3a5f', borderTop: '3px solid #0ea5e9', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #1e3a5f', borderTop: '3px solid #0ea5e9', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  const statCards = stats ? [
    { icon: <ShoppingBag size={22} />, label: 'Total Orders', value: stats.totalOrders, color: '#0ea5e9', bg: '#0c2340' },
    { icon: <Users size={22} />, label: 'Total Users', value: stats.totalUsers, color: '#a78bfa', bg: '#1e1040' },
    { icon: <Clock size={22} />, label: 'Pending', value: stats.pendingOrders, color: '#f59e0b', bg: '#2a1a00' },
    { icon: <CheckCircle size={22} />, label: 'Confirmed', value: stats.confirmedOrders, color: '#16a34a', bg: '#0a2010' },
    { icon: <XCircle size={22} />, label: 'Cancelled', value: stats.cancelledOrders, color: '#ef4444', bg: '#2a0a0a' },
    { icon: <TrendingUp size={22} />, label: 'Gross Revenue', value: toINR(stats.grossRevenue), color: '#22d3ee', bg: '#0c2340' },
    { icon: <IndianRupee size={22} />, label: 'GST Collected', value: toINR(stats.totalGST), color: '#fb923c', bg: '#2a1000' },
    { icon: <IndianRupee size={22} />, label: 'Net Revenue', value: toINR(stats.netRevenue), color: '#4ade80', bg: '#0a2010' },
  ] : []

  const TABS = ['overview', 'orders', 'users']

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>

      {/* Top nav */}
      <div style={{ background: '#0f172a', borderBottom: '1px solid #1e3a5f', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={22} color="#0ea5e9" />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#e2e8f0' }}>ShopZen Admin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: '#1e3a5f', color: '#0ea5e9', fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <span style={{ fontSize: 13, color: '#64748b' }}>{admin?.email}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 8, background: '#2a0a0a', color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#0f172a', borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: 9, fontSize: 14, fontWeight: 700, textTransform: 'capitalize', background: tab === t ? '#0ea5e9' : 'transparent', color: tab === t ? '#fff' : '#64748b', transition: 'all 0.2s' }}>
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && stats && (
          <div>
            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
              {statCards.map(s => (
                <div key={s.label} style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 16, padding: '18px 20px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                      {s.icon}
                    </div>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              <div style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 18, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 16 }}>Revenue Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Gross Revenue', value: stats.grossRevenue, color: '#22d3ee' },
                    { label: 'GST Deducted (18%)', value: -stats.totalGST, color: '#fb923c' },
                    { label: 'Misc Expenses (5%)', value: -stats.miscExpenses, color: '#f87171' },
                    { label: 'Net Revenue', value: stats.netRevenue, color: '#4ade80', bold: true },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0a0f1e', borderRadius: 10 }}>
                      <span style={{ fontSize: 13, color: '#94a3b8' }}>{r.label}</span>
                      <span style={{ fontSize: r.bold ? 16 : 14, fontWeight: r.bold ? 900 : 700, color: r.color }}>
                        {r.value < 0 ? `−${toINR(Math.abs(r.value))}` : toINR(r.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 18, padding: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 16 }}>Order Status</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Pending', value: stats.pendingOrders, color: '#f59e0b', pct: stats.totalOrders ? Math.round(stats.pendingOrders / stats.totalOrders * 100) : 0 },
                    { label: 'Confirmed', value: stats.confirmedOrders, color: '#16a34a', pct: stats.totalOrders ? Math.round(stats.confirmedOrders / stats.totalOrders * 100) : 0 },
                    { label: 'Cancelled', value: stats.cancelledOrders, color: '#ef4444', pct: stats.totalOrders ? Math.round(stats.cancelledOrders / stats.totalOrders * 100) : 0 },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{s.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value} ({s.pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: '#1e293b', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 99, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly revenue chart */}
            <div style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 18, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#e2e8f0', marginBottom: 20 }}>Monthly Revenue (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.monthly} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 10, color: '#e2e8f0' }}
                    formatter={v => [toINR(v), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#e2e8f0', marginBottom: 20 }}>
              All Orders <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>({orders.length})</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {orders.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>No orders yet</p>}
              {orders.map(order => {
                const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending
                return (
                  <div key={order._id} style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 16, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>
                          {order.userName} · {order.userEmail}
                        </p>
                        <p style={{ fontSize: 12, color: '#64748b' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#22d3ee' }}>{toINR(order.grandTotal)}</span>
                        <span style={{ background: cfg.bg, color: cfg.color, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99 }}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Items preview */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                      {order.items.slice(0, 4).map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0a0f1e', borderRadius: 8, padding: '4px 10px' }}>
                          {item.thumbnail && <img src={item.thumbnail} alt="" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />}
                          <span style={{ fontSize: 12, color: '#94a3b8' }}>{item.title.slice(0, 20)}... ×{item.qty}</span>
                        </div>
                      ))}
                      {order.items.length > 4 && <span style={{ fontSize: 12, color: '#64748b', padding: '4px 10px' }}>+{order.items.length - 4} more</span>}
                    </div>

                    {/* Status actions */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['pending', 'confirmed', 'cancelled'].map(s => (
                        <button key={s} onClick={() => updateStatus(order._id, s)}
                          disabled={order.status === s || updating === order._id}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                            background: order.status === s ? STATUS_CFG[s].bg : '#1e293b',
                            color: order.status === s ? STATUS_CFG[s].color : '#64748b',
                            border: `1px solid ${order.status === s ? STATUS_CFG[s].color : '#334155'}`,
                            cursor: order.status === s ? 'default' : 'pointer',
                            opacity: updating === order._id ? 0.6 : 1,
                            textTransform: 'capitalize',
                          }}>
                          {updating === order._id && order.status !== s ? '...' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && stats && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#e2e8f0', marginBottom: 20 }}>
              Registered Users <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>({stats.totalUsers})</span>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {stats.users.map(u => (
                <div key={u._id} style={{ background: '#0f172a', border: '1px solid #1e3a5f', borderRadius: 16, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {u.avatar ? <img src={u.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20 }}>👤</span>}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{u.username}</p>
                      <p style={{ fontSize: 12, color: '#64748b' }}>{u.email}</p>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#475569' }}>
                    Joined: {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
