const User = require('../route_models/UserData')
const { default: mongoose } = require('mongoose')


const findIsContact = async (elementId, userData) => {
  const data = userData.userContacts;
  return (data.find(item => JSON.stringify(elementId) == JSON.stringify(item.contactId)) != undefined)
}

const searchUsers = async (req, res) => {
  try {
    const { searchValue, userId } = req.body;
    const userData = await User.findById(userId)
    const searchData = await User.find({ username: { $regex: searchValue, $options: 'i' } })
    const search = searchData.filter(element => JSON.stringify(element._id) != JSON.stringify(userData._id))

    const sendData = search.map(async (element, index) => {
      const isContact = await findIsContact(element._id, userData)
      return {
        _id: element._id,
        username: element.username,
        name: element.name,
        userAvatar: element.userAvatar,
        isPhoto: element.userAvatar != '',
        alreadyContact: isContact
      }
    })

    var projectedData = await Promise.all(sendData)
    if (projectedData.length > 0)
      return res.json(projectedData)
    else
      return res.json(undefined)
  }
  catch (e) {
    console.log(e)
    return res.json(undefined)
  }
};

const addContact = async (req, res) => {
  try {
    const { userInfo, contact } = req.body;
    const userData = await User.findById(userInfo._id)
    userData.userContacts.push({ contactId: contact._id, contactTheme: "" })
    userData.save();
    return res.json({ status: true })
  }
  catch (err) {
    return res.json({ status: false })
  }
}

module.exports = {
  searchUsers,
  addContact
};