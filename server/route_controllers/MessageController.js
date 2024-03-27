const Message = require('../route_models/MessageData')
const User = require('../route_models/UserData')

const sendMessage = async (req, res) => {
  try {
    const { from, to, message, time, type } = req.body;
    const isAvailable = await User.findById(to);
    const bool = await isAvailable.userContacts.find((item) => JSON.stringify(item.contactId) == JSON.stringify(from));
    if (bool == undefined) {
      isAvailable.userContacts.push({ contactId: from, contactTheme: "" });
      await isAvailable.save();
    }

    const newMessage = new Message({
      from: from,
      to: to,
      message: message,
      type: type,
      time: time
    })
    await newMessage.save();

    const allMessages = await Message.find({ from: { $in: [from, to] }, to: { $in: [from, to] } })
    return res.json({ status: true, store: allMessages, socketNeed: !bool })
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