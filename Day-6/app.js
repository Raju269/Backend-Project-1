import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authController from './controllers/auth.controller.js'
import orderController from './controllers/order.controller.js'
import adminController from './controllers/admin.controller.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost')) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use('/api/auth',   authController)
app.use('/api/orders', orderController)
app.use('/api/admin',  adminController)

app.get('/', (req, res) => res.send('ShopZen API running!'))

export default app
