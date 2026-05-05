import express from 'express'
import asyncHandler from '../utils/asyncHandler.utils.js'
import Order from '../models/orders.model.js'
import User from '../models/users.model.js'

const adminController = express.Router()

// Admin credentials (hardcoded — no DB needed)
const ADMIN_EMAIL    = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

// POST /api/admin/login
adminController.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid admin credentials' })
  }
  res.status(200).json({ message: 'Admin login successful', admin: { email: ADMIN_EMAIL, name: 'Admin' } })
}))

// GET /api/admin/stats — dashboard numbers
adminController.get('/stats', asyncHandler(async (req, res) => {
  const [orders, users] = await Promise.all([
    Order.find(),
    User.find().select('-password'),
  ])

  const totalOrders    = orders.length
  const totalUsers     = users.length
  const pendingOrders  = orders.filter(o => o.status === 'pending').length
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length

  const grossRevenue   = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.grandTotal, 0)
  const totalGST       = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.gst, 0)
  const miscExpenses   = grossRevenue * 0.05   // 5% misc
  const netRevenue     = grossRevenue - totalGST - miscExpenses

  // Monthly revenue for chart (last 6 months)
  const now = new Date()
  const monthly = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    const revenue = orders
      .filter(o => o.status === 'confirmed' && new Date(o.createdAt).getMonth() === d.getMonth() && new Date(o.createdAt).getFullYear() === d.getFullYear())
      .reduce((s, o) => s + o.grandTotal, 0)
    monthly.push({ label, revenue })
  }

  res.status(200).json({
    totalOrders, totalUsers, pendingOrders, confirmedOrders, cancelledOrders,
    grossRevenue, totalGST, miscExpenses, netRevenue,
    monthly,
    recentOrders: orders.slice(0, 10),
    users: users.slice(0, 10),
  })
}))

export default adminController
