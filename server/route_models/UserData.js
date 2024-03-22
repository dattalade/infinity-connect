const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const contactSchema = new mongoose.Schema({
  contactId: ObjectId,
  contactTheme: String,
})

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  userContacts: [contactSchema],
  userAvatar: { type: String, default: "", },
  isPhoto: { type: Boolean, default: false, },
  whenRegistered: Date,
  isVerified: { type: Boolean, default: false, }
})

module.exports = mongoose.model('User', userSchema);