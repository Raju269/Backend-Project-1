import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toINR } from '../utils/currency'
import { MapPin, CreditCard, User, Phone, Home, CheckCircle, ArrowLeft, Lock, Smartphone } from 'lucide-react'
import api from '../utils/api'

const STEPS = ['Address', 'Payment', 'Confirm']

function Field({ icon, label, value, onChange, placeholder, type = 'text', half }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ flex: half ? '1 1 45%' : '1 1 100%', minWidth: 0 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, padding: '11px 14px', transition: 'border-color 0.2s' }}>
        <span style={{ color: focused ? 'var(--accent)' : 'var(--muted)', display: 'flex', flexShrink: 0 }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: 'var(--text)' }} />
      </div>
    </div>
  )
}

export default function Checkout() {
  const { cart, cartTotal, clearCart, user } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const coupon = location.state?.coupon || null

  const [step, setStep] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [payMethod, setPayMethod] = useState('card')

  const [addr, setAddr] = useState({ name: user?.username || '', phone: '', line1: '', city: '', state: '', pincode: '' })
  const [pay, setPay] = useState({ cardNumber: '', expiry: '', cvv: '', cardName: '', upi: '' })

  // ── Auth guard — redirect to login if not logged in ──
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
    }
  }, [user])

  if (!user) return null

  const gst = cartTotal * 0.18
  const couponDiscount = coupon ? (cartTotal * coupon.discount) / 100 : 0
  const grandTotal = cartTotal + gst - couponDiscount

  if (cart.length === 0 && !success && !processing) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Your cart is empty</p>
      <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>Go Shopping</button>
    </div>
  )

  // ── Success ──
  if (success) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 28, padding: '52px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 32px var(--accent-glow)', animation: 'popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)' }}>
          <CheckCircle size={48} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>Payment Successful!</h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 8 }}>Your order has been placed successfully.</p>
        <p style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)', marginBottom: 24 }}>{toINR(grandTotal)}</p>
        <div style={{ background: 'var(--accent-light)', borderRadius: 14, padding: '14px 20px', marginBottom: 28, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>Order ID: #SZ{Date.now().toString().slice(-8)}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Confirmation sent to {user?.email || 'your email'}</p>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Redirecting to home in {countdown}s...</p>
        <button onClick={() => { clearCart(); navigate('/') }} className="btn-primary" style={{ width: '100%', padding: '14px 0', fontSize: 15 }}>Back to Home</button>
      </div>
      <style>{`@keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  )

  // ── Processing ──
  if (processing) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 28, padding: '52px 40px', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', border: '5px solid var(--border)', borderTop: '5px solid var(--accent)', margin: '0 auto 28px', animation: 'spin 0.9s linear infinite' }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text)', marginBottom: 10 }}>Processing Payment...</h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>Please do not close this window</p>
        <div style={{ background: 'var(--bg)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))', animation: 'progress 5s linear forwards', borderRadius: 99 }} />
        </div>
        <p style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700, marginTop: 12 }}>{countdown}s remaining</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes progress { from { width: 0%; } to { width: 100%; } }`}</style>
      </div>
    </div>
  )

  const addrValid = addr.name && addr.phone && addr.line1 && addr.city && addr.state && addr.pincode
  const payValid = payMethod === 'upi' ? pay.upi.length > 5 : pay.cardNumber.length >= 16 && pay.expiry && pay.cvv && pay.cardName

  const handlePayment = () => {
    setProcessing(true)
    let c = 5; setCountdown(c)
    const iv = setInterval(async () => {
      c -= 1; setCountdown(c)
      if (c <= 0) {
        clearInterval(iv)
        // Save order to DB
        try {
          await api.post('/orders', {
            userId:     user.id,
            userName:   user.username,
            userEmail:  user.email,
            items:      cart.map(i => ({ productId: i.id, title: i.title, thumbnail: i.thumbnail, price: i.price, qty: i.qty })),
            subtotal:   cartTotal,
            gst,
            coupon:     coupon?.code || '',
            discount:   couponDiscount,
            grandTotal,
            address:    addr,
            payMethod,
          })
        } catch (e) { console.error('Order save failed', e) }
        setProcessing(false)
        setSuccess(true)
        let r = 5; setCountdown(r)
        const rv = setInterval(() => {
          r -= 1; setCountdown(r)
          if (r <= 0) { clearInterval(rv); clearCart(); navigate('/') }
        }, 1000)
      }
    }, 1000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => step === 0 ? navigate('/cart') : setStep(s => s - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
          <ArrowLeft size={17} /> {step === 0 ? 'Back to Cart' : 'Back'}
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 28 }}>Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= step ? 'var(--accent)' : 'var(--bg2)', color: i <= step ? '#fff' : 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, border: `2px solid ${i <= step ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.3s' }}>
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: i <= step ? 'var(--accent)' : 'var(--muted)' }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, marginBottom: 22, background: i < step ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 500px' }}>

            {/* Step 0: Address */}
            {step === 0 && (
              <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={20} color="var(--accent)" /> Delivery Address
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <Field icon={<User size={15} />} label="Full Name *" value={addr.name} onChange={v => setAddr(a => ({ ...a, name: v }))} placeholder="Full name" />
                  <Field icon={<Phone size={15} />} label="Phone *" value={addr.phone} onChange={v => setAddr(a => ({ ...a, phone: v }))} placeholder="+91 98765 43210" half />
                  <Field icon={<Home size={15} />} label="Address *" value={addr.line1} onChange={v => setAddr(a => ({ ...a, line1: v }))} placeholder="House no, Street, Area" />
                  <Field icon={<MapPin size={15} />} label="City *" value={addr.city} onChange={v => setAddr(a => ({ ...a, city: v }))} placeholder="City" half />
                  <Field icon={<MapPin size={15} />} label="State *" value={addr.state} onChange={v => setAddr(a => ({ ...a, state: v }))} placeholder="State" half />
                  <Field icon={<MapPin size={15} />} label="Pincode *" value={addr.pincode} onChange={v => setAddr(a => ({ ...a, pincode: v }))} placeholder="560001" half />
                </div>
                <button onClick={() => setStep(1)} disabled={!addrValid} className="btn-primary"
                  style={{ width: '100%', padding: '14px 0', fontSize: 15, marginTop: 24, opacity: addrValid ? 1 : 0.45, cursor: addrValid ? 'pointer' : 'not-allowed' }}>
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 28, boxShadow: 'var(--shadow-sm)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={20} color="var(--accent)" /> Payment Details
                </h2>
                <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                  {[{ id: 'card', icon: <CreditCard size={16} />, label: 'Card' }, { id: 'upi', icon: <Smartphone size={16} />, label: 'UPI' }].map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 14, fontWeight: 700, background: payMethod === m.id ? 'var(--accent)' : 'var(--bg)', color: payMethod === m.id ? '#fff' : 'var(--text2)', border: `1.5px solid ${payMethod === m.id ? 'var(--accent)' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
                {payMethod === 'card' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    <Field icon={<User size={15} />} label="Cardholder Name *" value={pay.cardName} onChange={v => setPay(p => ({ ...p, cardName: v }))} placeholder="Name on card" />
                    <Field icon={<CreditCard size={15} />} label="Card Number *" value={pay.cardNumber} onChange={v => setPay(p => ({ ...p, cardNumber: v.replace(/\D/g, '').slice(0, 16) }))} placeholder="1234 5678 9012 3456" />
                    <Field icon={<Lock size={15} />} label="Expiry *" value={pay.expiry} onChange={v => setPay(p => ({ ...p, expiry: v }))} placeholder="MM/YY" half />
                    <Field icon={<Lock size={15} />} label="CVV *" value={pay.cvv} onChange={v => setPay(p => ({ ...p, cvv: v.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" type="password" half />
                  </div>
                )}
                {payMethod === 'upi' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    <Field icon={<Smartphone size={15} />} label="UPI ID *" value={pay.upi} onChange={v => setPay(p => ({ ...p, upi: v }))} placeholder="yourname@upi" />
                    <div style={{ width: '100%', padding: '14px 16px', borderRadius: 12, background: 'var(--accent-light)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
                      Enter your UPI ID (e.g. name@okaxis, name@paytm)
                    </div>
                  </div>
                )}
                <button onClick={() => setStep(2)} disabled={!payValid} className="btn-primary"
                  style={{ width: '100%', padding: '14px 0', fontSize: 15, marginTop: 24, opacity: payValid ? 1 : 0.45, cursor: payValid ? 'pointer' : 'not-allowed' }}>
                  Review Order →
                </button>
              </div>
            )}

            {/* Step 2: Confirm — READ ONLY, no editable inputs */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Address — display only */}
                <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <MapPin size={16} color="var(--accent)" /> Delivery Address
                    </h3>
                    <button onClick={() => setStep(0)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Edit</button>
                  </div>
                  <InfoRow label="Name" value={addr.name} />
                  <InfoRow label="Address" value={addr.line1} />
                  <InfoRow label="City / State" value={`${addr.city}, ${addr.state} — ${addr.pincode}`} />
                  <InfoRow label="Phone" value={addr.phone} />
                  <InfoRow label="Email" value={user?.email || '—'} />
                </div>

                {/* Payment — display only */}
                <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 7 }}>
                      <CreditCard size={16} color="var(--accent)" /> Payment Method
                    </h3>
                    <button onClick={() => setStep(1)} style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Edit</button>
                  </div>
                  {payMethod === 'card'
                    ? <InfoRow label="Card" value={`****${pay.cardNumber.slice(-4)} · ${pay.cardName}`} />
                    : <InfoRow label="UPI" value={pay.upi} />}
                </div>

                {/* Items — display only */}
                <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>Order Items ({cart.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={item.thumbnail} alt={item.title} style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="line-clamp-2" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Qty: {item.qty}</p>
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>{toINR(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={handlePayment} className="btn-primary"
                  style={{ width: '100%', padding: '16px 0', fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 16 }}>
                  <Lock size={18} /> Pay {toINR(grandTotal)} Securely
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>🔒 256-bit SSL encrypted · Your data is safe</p>
              </div>
            )}
          </div>

          {/* Right summary */}
          <div style={{ flex: '0 0 280px' }}>
            <div style={{ background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 22, padding: 24, position: 'sticky', top: 80, boxShadow: 'var(--shadow-md)' }}>
              <div style={{ height: 4, borderRadius: 99, marginBottom: 18, background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))' }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={item.thumbnail} alt={item.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="line-clamp-2" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{item.title}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)' }}>x{item.qty}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>{toINR(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <MiniRow label="Subtotal" value={toINR(cartTotal)} />
                <MiniRow label="Shipping" value="FREE" vc="var(--accent)" />
                <MiniRow label="GST (18%)" value={toINR(gst)} />
                {coupon && <MiniRow label={`Coupon (${coupon.code})`} value={`−${toINR(couponDiscount)}`} vc="#16a34a" />}
                <div style={{ borderTop: '1.5px solid var(--border)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)' }}>{toINR(grandTotal)}</span>
                  </div>
                  {coupon && <p style={{ fontSize: 11, color: '#16a34a', fontWeight: 700, marginTop: 4 }}>Saving {toINR(couponDiscount)} with {coupon.code}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, minWidth: 80, flexShrink: 0 }}>{label}:</span>
      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function MiniRow({ label, value, vc }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: vc || 'var(--text)' }}>{value}</span>
    </div>
  )
}
