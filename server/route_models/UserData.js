const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const contactSchema = new mongoose.Schema({
  contactId: ObjectId,
  contactTheme: String,
})

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  cloudinaryId: {
    type: String,
    default: "",
  }
});

const defaultAvatar = {
  name: "",
  imageUrl: "",
  cloudinaryId: "",
};

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  userContacts: [contactSchema],
  userAvatar: { type: imageSchema, default: defaultAvatar },
  isPhoto: { type: Boolean, default: false, },
  whenRegistered: Date,
  isVerified: { type: Boolean, default: false, }
})

module.exports = mongoose.model('User', userSchema);