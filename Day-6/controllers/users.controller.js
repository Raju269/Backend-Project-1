import User from '../models/users.model.js'
import bcrypt from 'bcryptjs'
import asyncHandler from '../utils/asyncHandler.utils.js'
import { uploadOnCloudinary } from '../utils/cloudinary.utils.js'

// GET /api/auth/me  — get logged-in user profile
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.status(200).json({ user })
})

// PUT /api/auth/update/:id  — update profile fields
export const updateUser = asyncHandler(async (req, res) => {
  const { username, email, phone, bio, dob } = req.body
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (username) user.username = username
  if (email)    user.email    = email
  if (phone !== undefined) user.phone = phone
  if (bio   !== undefined) user.bio   = bio
  if (dob   !== undefined) user.dob   = dob

  // avatar upload via multer + cloudinary
  if (req.file) {
    const result = await uploadOnCloudinary(req.file.path)
    if (result) user.avatar = result.secure_url
  }

  await user.save()
  const updated = user.toObject()
  delete updated.password
  res.status(200).json({ message: 'Profile updated', user: updated })
})

// DELETE /api/auth/delete/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  await user.deleteOne()
  res.status(200).json({ message: 'User deleted successfully' })
})

// GET /api/auth/users  — all users (admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password')
  res.status(200).json(users)
})
