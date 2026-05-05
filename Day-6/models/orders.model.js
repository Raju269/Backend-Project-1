import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  productId:   { type: Number, required: true },
  title:       { type: String, required: true },
  thumbnail:   { type: String },
  price:       { type: Number, required: true },
  qty:         { type: Number, required: true },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:    { type: String },
  userEmail:   { type: String },
  items:       [orderItemSchema],
  subtotal:    { type: Number, required: true },
  gst:         { type: Number, required: true },
  coupon:      { type: String, default: '' },
  discount:    { type: Number, default: 0 },
  grandTotal:  { type: Number, required: true },
  address: {
    name:    String,
    phone:   String,
    line1:   String,
    city:    String,
    state:   String,
    pincode: String,
  },
  payMethod:   { type: String, default: 'card' },
  status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order
