import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Save, X, LogOut, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import api from '../utils/api'
import { toINR } from '../utils/currency'

export default function Profile() {
  const { user, login, logout, cart, cartTotal } = useApp()
  const navigate = useNavigate()
  const fileRef = useRef()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const [form, setForm] = useState({ username: '', phone: '', bio: '', dob: '' })

  // redirect if not logged in
  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/auth/me/${user.id}`)
      setProfile(data.user)
      setForm({
        username: data.user.username || '',
        phone:    data.user.phone    || '',
        bio:      data.user.bio      || '',
        dob:      data.user.dob      || '',
      })
    } catch {
      setMsg({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMsg({ type: '', text: '' })
    try {
      const formData = new FormData()
      formData.append('username', form.username)
      formData.append('phone', form.phone)
      formData.append('bio', form.bio)
      formData.append('dob', form.dob)

      const { data } = await api.put(`/auth/update/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile(data.user)
      login({ ...user, username: data.user.username })
      setEditing(false)
      setMsg({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMsg({ type: '', text: '' }), 3000)
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarUploading(true)
    setMsg({ type: '', text: '' })
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { data } = await api.put(`/auth/update/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setProfile(data.user)
      setMsg({ type: 'success', text: 'Profile photo updated!' })
      setTimeout(() => setMsg({ type: '', text: '' }), 3000)
    } catch {
      setMsg({ type: 'error', text: 'Failed to upload photo' })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  if (!user) return null

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTop: '3px solid var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const stats = [
    { icon: '🛒', label: 'Cart Items', value: cart.length },
    { icon: '💰', label: 'Cart Value', value: toINR(cartTotal) },
    { icon: '📦', label: 'Orders', value: 0 },
    { icon: '❤️', label: 'Wishlist', value: 0 },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Alert */}
        {msg.text && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: msg.type === 'success' ? 'var(--accent-light)' : '#fee2e2',
            border: `1px solid ${msg.type === 'success' ? 'var(--border)' : '#fca5a5'}`,
            borderRadius: 12, padding: '12px 16px',
            fontSize: 14, fontWeight: 600,
            color: msg.type === 'success' ? 'var(--accent)' : '#dc2626',
          }}>
            {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {msg.text}
          </div>
        )}

        {/* Header card */}
        <div style={{
          borderRadius: 24, padding: '32px',
          background: 'linear-gradient(135deg, #00c853 0%, #00897b 60%, #0288d1 100%)',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,200,83,0.25)',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 90, height: 90, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.5)',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {profile?.avatar ? (
                  <img src={profile.avatar} alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 36 }}>👤</span>
                )}
              </div>
              {/* Camera button */}
              <button onClick={() => fileRef.current.click()}
                disabled={avatarUploading}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#fff', color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  cursor: avatarUploading ? 'not-allowed' : 'pointer',
                }}>
                {avatarUploading
                  ? <span style={{ width: 12, height: 12, borderRadius: '50%', border: '2px solid var(--border)', borderTop: '2px solid var(--accent)', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  : <Camera size={14} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 4 }}>
                {profile?.username}
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 10 }}>
                {profile?.email}
              </p>
              {profile?.bio && (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontStyle: 'italic' }}>
                  "{profile.bio}"
                </p>
              )}
              <span style={{
                background: 'rgba(255,255,255,0.2)', color: '#fff',
                fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99,
                border: '1px solid rgba(255,255,255,0.3)',
              }}>⭐ Premium Member</span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => setEditing(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)', color: '#fff',
                  fontSize: 13, fontWeight: 700,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}>
                <Edit3 size={14} /> Edit
              </button>
              <button onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 12,
                  background: 'rgba(239,68,68,0.25)', color: '#fff',
                  fontSize: 13, fontWeight: 700,
                  border: '1px solid rgba(239,68,68,0.4)',
                }}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
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

        {/* Account details */}
        <div style={{
          background: 'var(--card)', border: '1.5px solid var(--border)',
          borderRadius: 20, padding: 24, boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Account Details</h2>
            <button onClick={() => navigate('/orders')}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: 'var(--accent-light)', color: 'var(--accent)', fontSize: 13, fontWeight: 700, border: '1px solid var(--border)' }}>
              <Package size={14} /> My Orders
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: <User size={16} />, label: 'Username', value: profile?.username },
              { icon: <Mail size={16} />, label: 'Email', value: profile?.email },
              { icon: <Phone size={16} />, label: 'Phone', value: profile?.phone || 'Not set' },
              { icon: <Calendar size={16} />, label: 'Date of Birth', value: profile?.dob || 'Not set' },
              { icon: <Edit3 size={16} />, label: 'Bio', value: profile?.bio || 'Not set' },
              { icon: <MapPin size={16} />, label: 'Member Since', value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '' },
            ].map(d => (
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
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}>
          <div style={{
            background: 'var(--card)', border: '1.5px solid var(--border)',
            borderRadius: 24, padding: 32, width: '100%', maxWidth: 480,
            boxShadow: 'var(--shadow-lg)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>Edit Profile</h2>
              <button onClick={() => setEditing(false)} style={{ color: 'var(--muted)', display: 'flex' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <EditField label="Username" icon={<User size={15} />} value={form.username}
                onChange={v => setForm(f => ({ ...f, username: v }))} placeholder="Your username" />
              <EditField label="Phone" icon={<Phone size={15} />} value={form.phone}
                onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 98765 43210" />
              <EditField label="Date of Birth" icon={<Calendar size={15} />} value={form.dob}
                onChange={v => setForm(f => ({ ...f, dob: v }))} placeholder="DD/MM/YYYY" type="date" />
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  style={{
                    width: '100%', background: 'var(--bg)',
                    border: '1.5px solid var(--border)', borderRadius: 12,
                    padding: '11px 14px', fontSize: 14, color: 'var(--text)',
                    outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setEditing(false)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12,
                  background: 'var(--bg)', color: 'var(--text)',
                  fontSize: 14, fontWeight: 700,
                  border: '1.5px solid var(--border)',
                }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary"
                style={{
                  flex: 2, padding: '12px 0', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: saving ? 0.7 : 1,
                }}>
                {saving
                  ? <><Spinner /> Saving...</>
                  : <><Save size={15} /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function EditField({ label, icon, value, onChange, placeholder, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--bg)',
        border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 12, padding: '11px 14px',
        transition: 'border-color 0.2s',
      }}>
        <span style={{ color: focused ? 'var(--accent)' : 'var(--muted)', display: 'flex', flexShrink: 0 }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }} />
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      width: 14, height: 14, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #fff',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  )
}
