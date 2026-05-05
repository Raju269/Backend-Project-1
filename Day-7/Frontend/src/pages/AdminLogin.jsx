import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react'
import api from '../utils/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) return setError('Enter email and password')
    setLoading(true)
    try {
      const { data } = await api.post('/admin/login', { email, password })
      sessionStorage.setItem('adminAuth', JSON.stringify(data.admin))
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 24, padding: '40px 36px', boxShadow: 'var(--shadow-lg)' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(14,165,233,0.3)' }}>
              <ShieldCheck size={30} color="#fff" />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>Admin Portal</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>ShopZen Admin Dashboard</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
              <AlertCircle size={15} />{error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InputField icon={<Mail size={15} />} placeholder="Admin email" type="email" value={email} onChange={setEmail} onEnter={handleLogin} />
            <div style={{ position: 'relative' }}>
              <InputField icon={<Lock size={15} />} placeholder="Password" type={showPass ? 'text' : 'password'} value={password} onChange={setPassword} onEnter={handleLogin} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button onClick={handleLogin} disabled={loading}
              style={{ width: '100%', padding: '13px 0', marginTop: 4, borderRadius: 14, background: loading ? 'var(--muted)' : '#1e3a5f', color: '#fff', fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <Spinner /> : <ShieldCheck size={17} />}
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
            Hint: admin@gmail.com / admin123
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function InputField({ icon, placeholder, type, value, onChange, onEnter }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: `1.5px solid ${focused ? '#0ea5e9' : 'var(--border)'}`, borderRadius: 12, padding: '11px 14px', transition: 'border-color 0.2s' }}>
      <span style={{ color: focused ? '#0ea5e9' : 'var(--muted)', display: 'flex' }}>{icon}</span>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }} />
    </div>
  )
}

function Spinner() {
  return <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
}
