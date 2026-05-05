import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=30')
      .then(r => r.json())
      .then(d => { setProducts(d.products); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const increase = (id) => setCart(prev =>
    prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)
  )

  const decrease = (id) => setCart(prev => {
    const item = prev.find(i => i.id === id)
    if (!item) return prev
    if (item.qty <= 1) return prev.filter(i => i.id !== id)
    return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
  })

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id))

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <AppContext.Provider value={{
      dark, setDark,
      cart, addToCart, increase, decrease, removeFromCart, clearCart,
      cartCount, cartTotal,
      products, loading,
      search, setSearch,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
