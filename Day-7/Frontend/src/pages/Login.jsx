import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPass, setShowPass] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Card */}
        <div style={{
          background: 'var(--card)',
          border: '1.5px solid var(--border)',
          borderRadius: 24, padding: '40px 36px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #16a34a, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, margin: '0 auto 14px',
              boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
            }}>
              🛍️
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)' }}>
              {isLogin ? 'Sign in to your ShopZen account' : 'Join ShopZen today — it\'s free'}
            </p>
          </div>

          {/* Tab toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg)',
            borderRadius: 12, padding: 4, marginBottom: 28,
          }}>
            {['Login', 'Sign Up'].map((tab, i) => (
              <button key={tab} onClick={() => setIsLogin(i === 0)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  fontSize: 14, fontWeight: 700,
                  background: (isLogin ? i === 0 : i === 1) ? 'var(--accent)' : 'transparent',
                  color: (isLogin ? i === 0 : i === 1) ? '#fff' : 'var(--muted)',
                  transition: 'all 0.2s',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <Field icon={<User size={16} />} placeholder="Full name" type="text" />
            )}
            <Field icon={<Mail size={16} />} placeholder="Email address" type="email" />
            <div style={{ position: 'relative' }}>
              <Field icon={<Lock size={16} />} placeholder="Password" type={showPass ? 'text' : 'password'} />
              <button onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 14, top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--muted)',
                  display: 'flex',
                }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isLogin && (
              <div style={{ textAlign: 'right', marginTop: -6 }}>
                <button style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button style={{
              width: '100%', padding: '13px 0', marginTop: 4,
              borderRadius: 14, background: 'var(--accent)',
              color: '#fff', fontSize: 15, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'opacity 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={17} />
            </button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)}
              style={{ fontWeight: 700, color: 'var(--accent)' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Social hint */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', marginTop: 20 }}>
          By continuing, you agree to our Terms of Service &amp; Privacy Policy
        </p>
      </div>
    </div>
  )
}

function Field({ icon, placeholder, type }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'var(--bg)', border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12, padding: '11px 14px',
      transition: 'border-color 0.2s',
    }}>
      <span style={{ color: focused ? 'var(--accent)' : 'var(--muted)', display: 'flex', transition: 'color 0.2s' }}>
        {icon}
      </span>
      <input type={type} placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none',
          outline: 'none', fontSize: 14, color: 'var(--text)',
        }} />
    </div>
  )
}
