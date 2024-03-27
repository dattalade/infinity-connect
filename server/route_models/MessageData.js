const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const messageSchema = new mongoose.Schema({
  from: ObjectId,
  to: ObjectId,
  message: String,
  type: String,
  time: Date
})

module.exports = mongoose.model('Message', messageSchema);