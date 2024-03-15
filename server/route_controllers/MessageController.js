const Message = require('../route_models/MessageData')
const User = require('../route_models/UserData')

const sendMessage = async (req, res) => {
  try {
    const { from, to, message, time } = req.body;
    const isAvailable = await User.findById(to);
    const bool = isAvailable.userContacts.includes(from);
    if (!bool) {
      isAvailable.userContacts.push(from);
      await isAvailable.save();
    }

    const newMessage = new Message({
      from: from,
      to: to,
      message: message,
      time: time
    })
    await newMessage.save();

    const allMessages = await Message.find({ from: { $in: [from, to] }, to: { $in: [from, to] } })
    return res.json({ status: true, store: allMessages })
  }
  catch (e) {
    return res.json({ status: false })
  }
};

const allMessages = async (req, res) => {
  try {
    const { from, to } = req.body;
    const allMessages = await Message.find({ from: { $in: [from, to] }, to: { $in: [from, to] } }).sort({ time: "asc" })
    return res.json({ messages: allMessages })
  }
  catch (e) {
    return res.json({ messages: [] })
  }
};

module.exports = {
  sendMessage,
  allMessages
};