const express = require('express')

// controller functions
const { loginUser, signupUser, changePasswordWithOTP, forgetPassword, changePassword, logout } = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

//forget password route
router.patch('/change-password-with-otp', changePasswordWithOTP)

//reset password route
router.patch('/forgetPassword', forgetPassword)

//change password route
router.patch('/change-password', changePassword)

//logout route
router.patch('/logout', logout)

module.exports = router