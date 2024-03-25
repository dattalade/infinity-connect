const User = require('../route_models/UserData')
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({});
const uploadMulter = multer({ storage }).single('image');

const upload = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, { folder: '/connect/user_pics' });
    const userDet = await User.findById(req.id);

    userDet.userAvatar.imageUrl = result.secure_url
    userDet.userAvatar.cloudinaryId = result.public_id
    userDet.userAvatar.name = req.body.name;

    await userDet.save();

    return res.json({ status: true })
  }
  catch (e) {
    return res.json({ status: false })
  }
};

module.exports = {
  upload,
  uploadMulter
};