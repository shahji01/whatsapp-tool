const User = require('../models/userModel')
const {sendResetPasswordMail} = require('../helpers/commonFunction.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

// login a user
const loginUser = async (req, res) => { 
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)

    let userDetail = await User.findOneAndUpdate(
      { email: email },
      { $set: { token: token } },
    );
    userDetail['token'] = token;
    return res.status(200).json({'status':200,'data':userDetail})

  } catch (err) {
    return res.status(400).json({'status':400,msg: err.message})
  }
}

// signup a user
const signupUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.signup(email, password)
    const token = createToken(user._id)
  
    return res.status(200).json({email, token})

  } catch (err) {
    return res.status(400).json({error: err.message})
  }
}

const changePasswordWithOTP = async (req, res) => {
  const { email, password, otpCode } = req.body
  if(!otpCode){
    return res.status(400).json({
      status: 400,
      error: "Something went wrong! OTP Code is Empty"
    }) 
  }else{
    const user = await User.findOne({ otpCode }).lean()
    if (!user) {
      return res.status(400).json({
        status: 400,
        error: "Something went wrong! Invalid OTP Code"
      })
    }
    const hashpassword = await bcrypt.hash(password, 10)
    
    try {
      await User.findOneAndUpdate(
        { email: email },
        { $set: { password: hashpassword, otpCode: '' } }
      )
      return res.json({
        status: 200,
        message: "your password has been changed",
      })
    } catch (error) {
      return res.status(400).json({
        status: 400,
        error: error.message
      })
    }
  }
}

const forgetPassword = async (req, res) => {
  let { email } = req.body;
  if(email) {
    email = email
  }
  const user = await User.findOne({ email }).lean()
  if (!user) {
    return res.status(400).json({
      status: 400,
      error: "invalid Email"
    })
  }
  const randomNumber = Math.floor(100000 + Math.random() * 900000)
  sendResetPasswordMail(randomNumber, user.email, async (error, response) => {
    if (error) { return res.status(400).json({ message: error.message }) }
    const userDetail = await User.findOneAndUpdate(
      { email: email },
      { $set: { otpCode: randomNumber } },
    )
    return res.json({
      status: 200,
      message: {
        email: user.email,
        code: randomNumber
      }
    })
  })
}

const changePassword = async (req, res) => {
  const { email, password } = req.body
  const hashpassword = await bcrypt.hash(password, 10)
  try {
    await User.updateOne(
      { email: email },
      { $set: { password: hashpassword } }
    )
    return res.json({
      status: 200,
      message: "your password has been changed",
    });
  } catch (error) {
    return res.status(400).json({
      status: 400,
      error: error.message
    })
  }
}

const logout = async (req, res) => {
  const { token } = req.body
  if (token == undefined) {
    return res.json({
      status: 400,
      error: error.message
    });
  }
  await User.updateOne(
    { token: token },
    { $set: { token: "" } }
  )
  return res.json({
    status: 200,
    message: 'Logged out successfully'
  });
}


module.exports = { signupUser, loginUser, changePasswordWithOTP, forgetPassword, changePassword, logout }