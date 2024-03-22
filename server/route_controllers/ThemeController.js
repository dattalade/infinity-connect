const Theme = require('../route_models/Theme');
const User = require('../route_models/UserData');

const retrieveThemes = async (req, res) => {
  try {
    const allThemes = await Theme.find({})
    return res.json(allThemes)
  }
  catch (e) {
    console.log(e)
  }
};

const updateTheme = async (req, res) => {
  try {
    const { themeId, from, to } = req.body;
    const themeLink = await Theme.findById(themeId)
    const fromUser = await User.findById(from);
    (fromUser.userContacts.find((element) => JSON.stringify(element.contactId) == JSON.stringify(to))).contactTheme = themeLink.themeUrl
    await fromUser.save();
    return res.json({ status: true, link: themeLink.themeUrl })
  }
  catch (err) {
    return res.json({ status: false })
  }
}

module.exports = {
  retrieveThemes,
  updateTheme
};