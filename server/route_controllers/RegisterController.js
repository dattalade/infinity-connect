const bcryptjs = require('bcryptjs')
const nodemailer = require('nodemailer')
const User = require('../route_models/UserData')
const jwt = require('jsonwebtoken');

var json = null;
const SECRET_KEY = 'infinitydattalade123456789@@@@@@@@@'

const transporter = nodemailer.createTransport
  ({
    service: 'gmail',
    auth: {
      user: '2100031692cseh@gmail.com',
      pass: 'snkriyvximcvsuqa',
    },
  });

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

    //Email functionality
    const tokens = jwt.sign({ email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });
    const verificationLink = `https://infinity-connect.onrender.com/verify?token=${tokens}`;
    const mailOptions =
    {
      from: '2100031692cseh@gmail.com',
      to: newUser.email,
      subject: 'Verify Connect Account',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error.message);
      }
      else {
        console.log('Message sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    });

    await newUser.save();
    return res.json({ status: "ok", message: "Verify email to continue" })
  }
  catch (error) {
    console.error(error);
    return res.json({ type: "Internal Error :", message: 'Refresh and try again' });
  }
};

module.exports = {
  saveUser,
};