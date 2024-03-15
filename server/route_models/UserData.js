const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  userContacts: [ObjectId],
  userAvatar: { type: String, default: "", },
  isPhoto: { type: Boolean, default: false, },
  whenRegistered: Date,
  isVerified: { type: Boolean, default: false, }
})

module.exports = mongoose.model('User', userSchema);