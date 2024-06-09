const User = require('../route_models/UserData')
const Message = require('../route_models/MessageData')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

const SECRET_KEY = 'connect-chat@9959750297'
const months = { 1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December" }

const userInfo = async (req, res) => {
  try {
    const { jwtToken } = req.body;
    if (jwtToken == null)
      return res.json({ user: "none" })
    else {
      jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:');
          return res.json({ user: "none" })
        }
        else {
          const userDetails = await User.findById(decoded.userId)
          return res.json(userDetails)
        }
      })
    }
  }
  catch (e) {
    console.log(e)
  }
};

const makeChange = (timestamp) => {
  if (timestamp == "")
    return ""
  const send = new Date(timestamp)
  if (send.getFullYear() == new Date().getFullYear()) {
    if (send.getMonth() == new Date().getMonth()) {
      if (send.getDate() == new Date().getDate()) {
        return send.getHours() + ":" + (send.getMinutes() <= 9 ? "0" + send.getMinutes() : send.getMinutes());
      }
      else if (send.getDate() + 1 == new Date().getDate()) {
        return "Yesterday"
      }
    }
  }
  let str = ""
  if (send.getDate() <= 9)
    str = str + months[send.getMonth() + 1] + " 0" + send.getDate() + ", " + send.getFullYear();
  else
    str = str + months[send.getMonth() + 1] + " " + send.getDate() + ", " + send.getFullYear();
  return str;
}

const findByElement = async (from, to) => {
  const allMessages = await Message.find({ from: { $in: [from, to] }, to: { $in: [from, to] } }).sort({ time: "asc" })
  if (allMessages.length > 0) {
    return allMessages[allMessages.length - 1].time;
  }
  return ""
}

const init = async (req, res) => {
  return res.json({ "Hello": "success" })
}

const userContacts = async (req, res) => {
  try {
    const { jwtToken } = req.body;
    if (jwtToken == null)
      return res.json(undefined)
    else {
      jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
        if (err) {
          console.error('JWT verification failed:');
          return res.json(undefined)
        }
        else {
          const userDetails = await User.findById(decoded.userId)
          const contactIds = userDetails.userContacts.map((contact) => new mongoose.Types.ObjectId(contact.contactId))
          const allUsers = await User.find({ _id: { $in: contactIds } })
          // console.log(await User.find({ username: { $regex: "datta", $options: 'i' } }))
          const projectedData = allUsers.map(async (element, index) => {
            const latestMessage = await findByElement(decoded.userId, element._id)
            return {
              _id: element._id,
              name: element.name,
              username: element.username,
              email: element.email,
              userAvatar: element.userAvatar,
              isPhoto: element.isPhoto,
              latestMessage: latestMessage,
              theme: userDetails.userContacts.find((item) => JSON.stringify(item.contactId) === JSON.stringify(element._id)).contactTheme
            }
          })

          var sendData = await Promise.all(projectedData)

          sendData.sort((a, b) => {
            if (a.latestMessage == "" && b.latestMessage == "")
              return 0;
            else if (a.latestMessage == "")
              return 1;
            else if (b.latestMessage == "")
              return -1;
            else if (a.latestMessage > b.latestMessage)
              return -1;
            else if (a.latestMessage < b.latestMessage)
              return 1;
            else
              return 0;
          })

          sendData = sendData.map((element, index) => {
            const latestMessage = makeChange(element.latestMessage)
            return {
              _id: element._id,
              name: element.name,
              username: element.username,
              email: element.email,
              userAvatar: element.userAvatar,
              isPhoto: element.isPhoto,
              latestMessage: latestMessage,
              theme: element.theme
            }
          })

          console.log(sendData)

          return res.json(sendData)
        }
      })
    }
  }
  catch (e) {
    console.log(e)
  }
};

module.exports = {
  userInfo,
  userContacts,
  init
};