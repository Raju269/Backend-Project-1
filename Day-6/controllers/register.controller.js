import asyncHandler from '../utils/asyncHandler.utils.js'
import User from '../models/users.model.js'
import bcrypt from 'bcryptjs'

const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' })

  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists)
    return res.status(400).json({ message: 'Email or username already exists' })

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await User.create({ username, email, password: hashedPassword })

  const user = newUser.toObject()
  delete user.password

  return res.status(201).json({ message: 'Account created successfully', user })
})

export default registerController
