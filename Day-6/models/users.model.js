import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  avatar:   { type: String, default: '' },          // Cloudinary URL
  phone:    { type: String, default: '' },
  bio:      { type: String, default: '' },
  dob:      { type: String, default: '' },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User
