const mongoose = require('mongoose')

const themeSchema = new mongoose.Schema({
  themeUrl: String
})

module.exports = mongoose.model('Theme', themeSchema);