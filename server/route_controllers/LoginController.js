const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../route_models/UserData')

const SECRET_KEY = 'connect-chat@9959750297'

const checkUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username })
    if (!user.isVerified) {
      await User.deleteOne({ _id: user._id })
      return res.json({ type: "Username", message: "Username doesn't exist" })
    }
    if (!user)
      return res.json({ type: "Username", message: "Username doesn't exist" })
    // check verify 
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch)
      return res.json({ type: "Password", message: "Password is incorrect" });
    const token = jwt.sign({ userId: user._id }, SECRET_KEY)
    return res.json({ status: "ok", message: "Login successfull", token: token })
  }
  catch (e) {
    next(e);
  }
};

module.exports = {
  checkUser,
};