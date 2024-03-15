const bcryptjs = require('bcryptjs')
const User = require('../route_models/UserData')

var json = null;

const performValidation = (name, username, email, password, repassword) => {
  if (name.length < 3) {
    return { type: "Name", message: "Name length must be greater than 3" }
  }

  for (let i = 0; i < name.length; i++) {
    let ch = name.charCodeAt(i);
    if (ch >= 48 && ch <= 57) {
      return ({ type: "Name", message: "Name must not contain numbers" });
    }
    if (!(ch >= 65 && ch <= 90) && !(ch >= 97 && ch <= 122) && !(ch >= 48 && ch <= 57) && !(ch == 32)) {
      return ({ type: "Name", message: "Name must not contain special characters" });
    }
  }

  if (username.charCodeAt(0) >= 48 && username.charCodeAt(0) <= 57)
    return ({ type: "Username", message: "Username must not start with numbers" })

  let ch = username.charCodeAt(0);

  if (!(ch >= 65 && ch <= 90) && !(ch >= 97 && ch <= 122) && !(ch >= 48 && ch <= 57))
    return ({ type: "Username", message: "Username must not start with special characters" })

  for (let i = 0; i < username.length; i++) {
    let ch = username.charCodeAt(i);
    if (ch == 32) {
      return ({ type: "Username", message: "Username must not contain whitespaces" });
    }
  }

  if (!email.includes('@gmail.com'))
    return ({ type: "Mail", message: "Mail must include '@gmail.com'" });

  if (password != repassword)
    return ({ type: "Password", message: "Entered Password and Re-Enter Password must be same" });

  if (password.length < 8)
    return ({ type: "Password", message: "Password must be greater than 8" });

  if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)))
    return ({ type: "Password", message: "Password must contain atleast one special character" });

  return null;
}

const saveUser = async (req, res) => {
  try {
    const { name, username, email, password, repassword } = req.body;

    json = performValidation(name, username, email, password, repassword);
    if (json != null)
      return res.json(json)

    await User.findOne({ username: username }).exec()
      .then((result) => {
        const foundData = result;
        if (foundData)
          json = { type: "Username", message: "Username not available" }
      })
      .catch((err) => {
        console.error(err);
      });

    if (json != null) {
      return res.json(json);
    }

    await User.findOne({ email: email }).exec()
      .then((result) => {
        const foundData = result;
        if (foundData)
          json = { type: "Email", message: "Email already exists" }
      })
      .catch((err) => {
        console.error(err);
      });

    if (json != null) {
      return res.json(json);
    }

    const newUser = new User
      ({
        name: name,
        username: username,
        email: email,
        password: await bcryptjs.hash(password, 10),
        whenRegistered: new Date()
      })
    newUser.save();
    //Email functionality
    return res.json({ status: "ok", message: "Verify email to continue" })
  }
  catch (e) {
    next(e);
  }
};

module.exports = {
  saveUser,
};