import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload
      const existing = state.items.find(i => i.id === product.id)
      if (existing) {
        existing.qty += 1
      } else {
        state.items.push({ ...product, qty: 1 })
      }
    },
    increase: (state, action) => {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.qty += 1
    },
    decrease: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload)
      if (index !== -1) {
        if (state.items[index].qty <= 1) {
          state.items.splice(index, 1)
        } else {
          state.items[index].qty -= 1
        }
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, increase, decrease, removeFromCart, clearCart } = cartSlice.actions

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) => state.cart.items.reduce((s, i) => s + i.qty, 0)
export const selectCartTotal = (state) => state.cart.items.reduce((s, i) => s + i.price * i.qty, 0)

export default cartSlice.reducer
