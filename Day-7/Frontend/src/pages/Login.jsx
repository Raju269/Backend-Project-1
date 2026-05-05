import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useApp } from '../context/AppContext'

// Valid coupon codes
const VALID_COUPONS = { SAVE60: 60, SHOPZEN: 20, WELCOME10: 10 }

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })

  const { login } = useApp()
  const navigate = useNavigate()

  const set = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  // Email must end with @gmail.com
  const isValidEmail = (email) => /^[^\s@]+@gmail\.com$/i.test(email.trim())

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!form.email || !form.password) return setError('Email and password are required')
    if (!isValidEmail(form.email)) return setError('Email must be a valid @gmail.com address')

    if (!isLogin) {
      if (!form.username) return setError('Username is required')
      if (form.password.length < 6) return setError('Password must be at least 6 characters')
      if (form.password !== form.confirm) return setError('Passwords do not match')
    }

    setLoading(true)
    try {
      if (isLogin) {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
        localStorage.setItem('token', data.token)
        login(data.user)
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => navigate('/'), 900)
      } else {
        await api.post('/auth/register', { username: form.username, email: form.email, password: form.password })
        setSuccess('Account created! Please sign in.')
        setForm({ username: '', email: '', password: '', confirm: '' })
        setTimeout(() => setIsLogin(true), 1400)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (toLogin) => {
    setIsLogin(toLogin)
    setError('')
    setSuccess('')
    setForm({ username: '', email: '', password: '', confirm: '' })
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{
          background: 'var(--card)', border: '1.5px solid var(--border)',
          borderRadius: 24, padding: '40px 36px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #00c853, #0288d1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(0,200,83,0.3)',
            }}>🛍️</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginBottom: 4 }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {isLogin ? 'Sign in to your ShopZen account' : "Join ShopZen today — it's free"}
            </p>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {['Login', 'Sign Up'].map((tab, i) => (
              <button key={tab} onClick={() => switchTab(i === 0)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  fontSize: 14, fontWeight: 700,
                  background: (isLogin ? i === 0 : i === 1) ? 'var(--accent)' : 'transparent',
                  color: (isLogin ? i === 0 : i === 1) ? '#fff' : 'var(--muted)',
                  transition: 'all 0.2s',
                }}>{tab}</button>
            ))}
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fee2e2', border: '1px solid #fca5a5',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: '#dc2626', fontWeight: 600,
            }}>
              <AlertCircle size={15} />{error}
            </div>
          )}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--accent-light)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: 'var(--accent)', fontWeight: 600,
            }}>
              <CheckCircle size={15} />{success}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!isLogin && (
              <Field icon={<User size={16} />} placeholder="Username" type="text"
                value={form.username} onChange={set('username')} />
            )}

            {/* Email with live @gmail.com hint */}
            <div>
              <Field icon={<Mail size={16} />} placeholder="Email (must be @gmail.com)" type="email"
                value={form.email} onChange={set('email')} onEnter={handleSubmit} />
              {form.email && !isValidEmail(form.email) && (
                <p style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginTop: 4, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertCircle size={12} /> Must end with @gmail.com
                </p>
              )}
              {form.email && isValidEmail(form.email) && (
                <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, marginTop: 4, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircle size={12} /> Valid email
                </p>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <Field icon={<Lock size={16} />} placeholder="Password (min 6 characters)"
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={set('password')} onEnter={handleSubmit} />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <Field icon={<Lock size={16} />} placeholder="Confirm Password"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm} onChange={set('confirm')} onEnter={handleSubmit} />
                <button onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {form.confirm && (
                  <div style={{
                    fontSize: 12, fontWeight: 600, marginTop: 4, marginLeft: 4,
                    color: form.password === form.confirm ? 'var(--accent)' : '#ef4444',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    {form.password === form.confirm
                      ? <><CheckCircle size={12} /> Passwords match</>
                      : <><AlertCircle size={12} /> Passwords do not match</>}
                  </div>
                )}
              </div>
            )}

            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: -4 }}>
                <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              style={{
                width: '100%', padding: '13px 0', marginTop: 4,
                borderRadius: 14,
                background: loading ? 'var(--muted)' : 'var(--accent)',
                color: '#fff', fontSize: 15, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading
                ? <><Spinner />{isLogin ? 'Signing in...' : 'Creating account...'}</>
                : <>{isLogin ? 'Sign In' : 'Create Account'}<ArrowRight size={17} /></>}
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 22 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => switchTab(!isLogin)} style={{ fontWeight: 700, color: 'var(--accent)' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 16 }}>
          By continuing, you agree to our Terms of Service &amp; Privacy Policy
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function Field({ icon, placeholder, type, value, onChange, onEnter }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'var(--bg)',
      border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12, padding: '11px 14px',
      transition: 'border-color 0.2s',
    }}>
      <span style={{ color: focused ? 'var(--accent)' : 'var(--muted)', display: 'flex', transition: 'color 0.2s' }}>
        {icon}
      </span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={e => e.key === 'Enter' && onEnter?.()}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }} />
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTop: '2px solid #fff',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  )
}
