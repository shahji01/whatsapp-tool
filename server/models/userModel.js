const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  otpCode: {
    type: String,
    required: false
  },
  token: {
    type: String,
    required: false
  },
  type: {
    type: String,
    enum: {
      values: ['Masteradmin', 'Admin', 'Company'],
      message: '{VALUE} is not supported'
    },
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company"
  }
})

userSchema.statics.login = async function(email, password){

  if (!email || !password) {
    throw Error ('All fields must be filled')
  }

  const user = await this.findOne({ email })
  if (!user) {
    throw Error ('Invalid Email')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error ('Invalid Password')
  }
  return user
}

userSchema.statics.signup = async function(email, password, type, companyId){

  if (!email || !password) {
    throw Error ('All fields must be filled')
  }

  if (!validator.isEmail(email)) {    
    throw Error ('Email is invalid')
  }

  if (!validator.isStrongPassword(password)) {    
    throw Error ('Password not strong enough')
  }

  const exists = await  this.findOne({ email })
  if (exists) {
    throw Error ('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  

  const user = await this.create({ email, password: hash, type, companyId, otpCode:'',token:''})
  return user
}

module.exports = mongoose.model('user', userSchema)