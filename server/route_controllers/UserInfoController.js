const User = require('../route_models/UserData')
const Message = require('../route_models/MessageData')
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'connect-chat@9959750297'

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
        return send.getHours() + ":" + send.getMinutes();
      }
      else if (send.getDate() + 1 == new Date().getDate()) {
        return "Yesterday"
      }
    }
  }
  let str = ""
  if (send.getDate() <= 9)
    str = str + send.getMonth() + " 0" + send.getDate() + ", " + send.getFullYear();
  str = str + send.getMonth() + " " + send.getDate() + ", " + send.getFullYear();
  return str;
}

const findByElement = async (from, to) => {
  const allMessages = await Message.find({ from: { $in: [from, to] }, to: { $in: [from, to] } }).sort({ time: "asc" })
  if (allMessages.length > 0) {
    return allMessages[allMessages.length - 1].time;
  }
  return ""
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
          const allUsers = await User.find({ _id: { $in: userDetails.userContacts } })

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
            }
          })
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
  userContacts
};