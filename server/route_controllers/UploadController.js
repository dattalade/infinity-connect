const User = require('../route_models/UserData')
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'db8wetftg',
  api_key: '335196485618619',
  api_secret: 'raAL8MhlgWUANoqLlbMt7mH1Xkw',
});

const storage = multer.diskStorage({});
const uploadMulter = multer({ storage }).single('image');

const upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: '/connect/user_pics' });
    const userDet = await User.findById(req.body.id);

    userDet.userAvatar.imageUrl = result.secure_url
    userDet.userAvatar.cloudinaryId = result.public_id
    userDet.userAvatar.name = req.body.name;

    await userDet.save();
    console.log("Success")
    return res.json({ status: true })
  }
  catch (e) {
    console.log("Failure")
    return res.json({ status: false })
  }
};

const deleteImageByUrl = async (req, res) => {
  try {
    const { id, public } = req.body;
    const userData = await User.findById(id)

    const result = await cloudinary.uploader.destroy(public);

    console.log(result)

    userData.userAvatar.imageUrl = ""
    userData.userAvatar.cloudinaryId = ""
    userData.userAvatar.name = ""
    userData.save();

    return res.json({ status: true })
  }
  catch (err) {
    return res.json({ status: false })
  }
}

const updateAvatar = async (req, res) => {
  try {
    const { id, public, name } = req.body;

    const userData = await User.findById(id)
    const output = await cloudinary.uploader.destroy(public);

    console.log(output)

    userData.userAvatar.imageUrl = ""
    userData.userAvatar.cloudinaryId = ""
    userData.userAvatar.name = ""
    userData.save();

    const result = await cloudinary.uploader.upload(req.file.path, { folder: '/connect/user_pics' });

    userData.userAvatar.imageUrl = result.secure_url
    userData.userAvatar.cloudinaryId = result.public_id
    userData.userAvatar.name = name;
    userData.save();

    console.log("Success")
    return res.json({ status: true })
  }
  catch (err) {
    return res.json({ status: false })
  }
}

module.exports = {
  upload,
  uploadMulter,
  deleteImageByUrl,
  updateAvatar
};