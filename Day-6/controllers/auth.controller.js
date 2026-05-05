import express from 'express'
import registerController from './register.controller.js'
import loginController from './login.controller.js'
import * as usersController from './users.controller.js'
import upload from '../Config/multer.config.js'
import { loginLimiter, registerLimiter, updateLimiter, getAllUsersLimiter } from '../Config/rate.limiter.config.js'

const authController = express.Router()

authController.post('/register', registerController)
authController.post('/login', loginController)
authController.get('/me/:id', usersController.getMe)
authController.put('/update/:id', updateLimiter, upload.single('avatar'), usersController.updateUser)
authController.delete('/delete/:id', usersController.deleteUser)
authController.get('/users', getAllUsersLimiter, usersController.getAllUsers)

export default authController
