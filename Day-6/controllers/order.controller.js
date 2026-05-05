import express from 'express'
import Order from '../models/orders.model.js'
import asyncHandler from '../utils/asyncHandler.utils.js'

const orderController = express.Router()

// POST /api/orders — create order (user)
orderController.post('/', asyncHandler(async (req, res) => {
  const { userId, userName, userEmail, items, subtotal, gst, coupon, discount, grandTotal, address, payMethod } = req.body
  if (!userId || !items?.length) return res.status(400).json({ message: 'Missing required fields' })

  const order = await Order.create({ userId, userName, userEmail, items, subtotal, gst, coupon, discount, grandTotal, address, payMethod })
  res.status(201).json({ message: 'Order placed', order })
}))

// GET /api/orders/user/:userId — user's own orders
orderController.get('/user/:userId', asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
  res.status(200).json({ orders })
}))

// GET /api/orders — all orders (admin)
orderController.get('/', asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.status(200).json({ orders })
}))

// PUT /api/orders/:id/status — update status (admin)
orderController.put('/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.status(200).json({ message: 'Status updated', order })
}))

// DELETE /api/orders/:id (admin)
orderController.delete('/:id', asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id)
  res.status(200).json({ message: 'Order deleted' })
}))

export default orderController
