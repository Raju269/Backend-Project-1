import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'
import {
  MapPin, CreditCard, User, Mail, Phone, Home,
  CheckCircle, ArrowLeft, Lock, Smartphone,
} from 'lucide-react'

const STEPS = ['Address', 'Payment', 'Confirm']

const INPUT_STYLE = (focused) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  background: 'var(--bg)',
  border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
  borderRadius: 12, padding: '11px 14px',
  transition: 'border-color 0.2s',
})

function Field({ icon, label, value, onChange, placeholder, type = 'text', half }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: half ? '1 1 45%' : '1 1 100%', minWidth: 0 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={INPUT_STYLE(focused)}>
        <span style={{ color: focused ? 'var(--accent)' : 'var(--muted)', display: 'flex', flexShrink: 0, transition: 'color 0.2s' }}>
          {icon}
        </span>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }}
        />
      </div>
    </div>
  )
}

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [payMethod, setPayMethod] = useState('card')

  // Address form
  const [addr, setAddr] = useState({
    name: '', email: '', phone: '',
    line1: '', city: '', state: '', pincode: '',
  })

  // Payment form
  const [pay, setPay] = useState({
    cardNumber: '', expiry: '', cvv: '', cardName: '',
    upi: '',
  })

  const gst = cartTotal * 0.18
  const grandTotal = cartTotal + gst

  // Redirect to cart if empty
  if (cart.length === 0 && !success) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Your cart is empty</p>
        <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
          Go Shopping
        </button>
      </div>
    )
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        background: 'var(--card)', border: '1.5px solid var(--border)',
        borderRadius: 28, padding: '52px 40px',
        maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Animated checkmark */}
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 8px 32px var(--accent-glow)',
          animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}>
          <CheckCircle size={48} color="#fff" strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>
          Your order has been placed successfully.
        </p>
        <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 24 }}>
          {toINR(grandTotal)}
        </p>

        <div style={{
          background: 'var(--accent-light)', borderRadius: 14,
          padding: '14px 20px', marginBottom: 28,
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>
            Order ID: #SZ{Date.now().toString().slice(-8)}
          </p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Confirmation sent to {addr.email || 'your email'}
          </p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Redirecting to home in {countdown}s...
        </p>

        <button onClick={() => { clearCart(); navigate('/') }} className="btn-primary"
          style={{ width: '100%', padding: '14px 0', fontSize: 15 }}>
          Back to Home
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )

  // ── Processing overlay ──────────────────────────────────────────────────────
  if (processing) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        background: 'var(--card)', border: '1.5px solid var(--border)',
        borderRadius: 28, padding: '52px 40px',
        maxWidth: 420, width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Spinner */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          border: '5px solid var(--border)',
          borderTop: '5px solid var(--accent)',
          margin: '0 auto 28px',
          animation: 'spin 0.9s linear infinite',
        }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>
          Processing Payment...
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
          Please do not close this window
        </p>
        <div style={{
          background: 'var(--bg)', borderRadius: 99, height: 8, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            animation: 'progress 5s linear forwards',
            borderRadius: 99,
          }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginTop: 12 }}>
          {countdown}s remaining
        </p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes progress { from { width: 0%; } to { width: 100%; } }
        `}</style>
      </div>
    </div>
  )

  // ── Address valid check ─────────────────────────────────────────────────────
  const addrValid = addr.name && addr.email && addr.phone && addr.line1 && addr.city && addr.state && addr.pincode

  // ── Payment valid check ─────────────────────────────────────────────────────
  const payValid = payMethod === 'upi'
    ? pay.upi.length > 5
    : pay.cardNumber.length >= 16 && pay.expiry && pay.cvv && pay.cardName

  // ── Handle payment submit ───────────────────────────────────────────────────
  const handlePayment = () => {
    setProcessing(true)
    let c = 5
    setCountdown(c)
    const interval = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c <= 0) {
        clearInterval(interval)
        setProcessing(false)
        setSuccess(true)
        // Auto redirect after 5 more seconds
        let r = 5
        setCountdown(r)
        const redirect = setInterval(() => {
          r -= 1
          setCountdown(r)
          if (r <= 0) {
            clearInterval(redirect)
            clearCart()
            navigate('/')
          }
        }, 1000)
      }
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Back */}
        <button onClick={() => step === 0 ? navigate('/cart') : setStep(s => s - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={17} /> {step === 0 ? 'Back to Cart' : 'Back'}
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 28 }}>
          Checkout
        </h1>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: i <= step ? 'var(--accent)' : 'var(--bg2)',
                  color: i <= step ? '#fff' : 'var(--muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800,
                  border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`,
                  transition: 'all 0.3s',
                }}>
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i <= step ? 'var(--accent)' : 'var(--muted)' }}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex: 1, height: 2, marginBottom: 22,
                  background: i < step ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

          {/* Left — form area */}
          <div style={{ flex: '1 1 500px' }}>

            {/* ── STEP 0: Address ── */}
            {step === 0 && (
              <div style={{
                background: 'var(--card)', border: '1.5px solid var(--border)',
                borderRadius: 22, padding: 28, boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={20} color="var(--accent)" /> Delivery Address
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <Field icon={<User size={15} />} label="Full Name *" value={addr.name}
                    onChange={v => setAddr(a => ({ ...a, name: v }))} placeholder="John Doe" />
                  <Field icon={<Mail size={15} />} label="Email Address *" value={addr.email}
                    onChange={v => setAddr(a => ({ ...a, email: v }))} placeholder="john@example.com" type="email" />
                  <Field icon={<Phone size={15} />} label="Phone Number *" value={addr.phone}
                    onChange={v => setAddr(a => ({ ...a, phone: v }))} placeholder="+91 98765 43210" half />
                  <Field icon={<Home size={15} />} label="Address Line *" value={addr.line1}
                    onChange={v => setAddr(a => ({ ...a, line1: v }))} placeholder="House no, Street, Area" />
                  <Field icon={<MapPin size={15} />} label="City *" value={addr.city}
                    onChange={v => setAddr(a => ({ ...a, city: v }))} placeholder="Bengaluru" half />
                  <Field icon={<MapPin size={15} />} label="State *" value={addr.state}
                    onChange={v => setAddr(a => ({ ...a, state: v }))} placeholder="Karnataka" half />
                  <Field icon={<MapPin size={15} />} label="Pincode *" value={addr.pincode}
                    onChange={v => setAddr(a => ({ ...a, pincode: v }))} placeholder="560001" half />
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!addrValid}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '14px 0', fontSize: 15, marginTop: 24,
                    opacity: addrValid ? 1 : 0.45, cursor: addrValid ? 'pointer' : 'not-allowed',
                  }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* ── STEP 1: Payment ── */}
            {step === 1 && (
              <div style={{
                background: 'var(--card)', border: '1.5px solid var(--border)',
                borderRadius: 22, padding: 28, boxShadow: 'var(--shadow-sm)',
              }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={20} color="var(--accent)" /> Payment Details
                </h2>

                {/* Payment method tabs */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  {[
                    { id: 'card', icon: <CreditCard size={16} />, label: 'Card' },
                    { id: 'upi', icon: <Smartphone size={16} />, label: 'UPI' },
                  ].map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 12,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        fontSize: 14, fontWeight: 700,
                        background: payMethod === m.id ? 'var(--accent)' : 'var(--bg)',
                        color: payMethod === m.id ? '#fff' : 'var(--text2)',
                        border: `1.5px solid ${payMethod === m.id ? 'var(--accent)' : 'var(--border)'}`,
                        transition: 'all 0.2s',
                      }}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {payMethod === 'card' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    <Field icon={<User size={15} />} label="Cardholder Name *" value={pay.cardName}
                      onChange={v => setPay(p => ({ ...p, cardName: v }))} placeholder="Name on card" />
                    <Field icon={<CreditCard size={15} />} label="Card Number *" value={pay.cardNumber}
                      onChange={v => setPay(p => ({ ...p, cardNumber: v.replace(/\D/g, '').slice(0, 16) }))}
                      placeholder="1234 5678 9012 3456" />
                    <Field icon={<Lock size={15} />} label="Expiry Date *" value={pay.expiry}
                      onChange={v => setPay(p => ({ ...p, expiry: v }))} placeholder="MM/YY" half />
                    <Field icon={<Lock size={15} />} label="CVV *" value={pay.cvv}
                      onChange={v => setPay(p => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 3) }))}
                      placeholder="123" type="password" half />
                  </div>
                )}

                {/* UPI field */}
                {payMethod === 'upi' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    <Field icon={<Smartphone size={15} />} label="UPI ID *" value={pay.upi}
                      onChange={v => setPay(p => ({ ...p, upi: v }))} placeholder="yourname@upi" />
                    <div style={{
                      width: '100%', padding: '14px 16px', borderRadius: 12,
                      background: 'var(--accent-light)', border: '1px solid var(--border)',
                      fontSize: 13, color: 'var(--accent)', fontWeight: 600,
                    }}>
                      💡 Enter your UPI ID (e.g. name@okaxis, name@paytm)
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!payValid}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '14px 0', fontSize: 15, marginTop: 24,
                    opacity: payValid ? 1 : 0.45, cursor: payValid ? 'pointer' : 'not-allowed',
                  }}>
                  Review Order →
                </button>
              </div>
            )}

            {/* ── STEP 2: Confirm ── */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Address summary */}
                <div style={{
                  background: 'var(--card)', border: '1.5px solid var(--border)',
                  borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <MapPin size={16} color="var(--accent)" /> Delivery Address
                    </h3>
                    <button onClick={() => setStep(0)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Edit</button>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{addr.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{addr.line1}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)' }}>{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{addr.phone} · {addr.email}</p>
                </div>

                {/* Payment summary */}
                <div style={{
                  background: 'var(--card)', border: '1.5px solid var(--border)',
                  borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <CreditCard size={16} color="var(--accent)" /> Payment Method
                    </h3>
                    <button onClick={() => setStep(1)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Edit</button>
                  </div>
                  {payMethod === 'card' ? (
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                      💳 Card ending in ****{pay.cardNumber.slice(-4)} · {pay.cardName}
                    </p>
                  ) : (
                    <p style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>
                      📱 UPI: {pay.upi}
                    </p>
                  )}
                </div>

                {/* Items summary */}
                <div style={{
                  background: 'var(--card)', border: '1.5px solid var(--border)',
                  borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)',
                }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
                    Order Items ({cart.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={item.thumbnail} alt={item.title}
                          style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="line-clamp-2" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Qty: {item.qty}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>
                          {toINR(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePayment}
                  className="btn-primary"
                  style={{
                    width: '100%', padding: '16px 0', fontSize: 17,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    borderRadius: 16,
                  }}>
                  <Lock size={18} />
                  Pay {toINR(grandTotal)} Securely
                </button>

                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
                  🔒 256-bit SSL encrypted · Your data is safe
                </p>
              </div>
            )}
          </div>

          {/* Right — order summary (sticky) */}
          <div style={{ flex: '0 0 280px' }}>
            <div style={{
              background: 'var(--card)', border: '1.5px solid var(--border)',
              borderRadius: 22, padding: 24,
              position: 'sticky', top: 80,
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{
                height: 4, borderRadius: 99, marginBottom: 18,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
              }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
                Order Summary
              </h3>

              {/* Mini item list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={item.thumbnail} alt={item.title}
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="line-clamp-2" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{item.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>x{item.qty}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                      {toINR(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <MiniRow label="Subtotal" value={toINR(cartTotal)} />
                <MiniRow label="Shipping" value="FREE" valueColor="var(--accent)" />
                <MiniRow label="GST (18%)" value={toINR(gst)} />
                <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 12, marginTop: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{toINR(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor || 'var(--text)' }}>{value}</span>
    </div>
  )
}
