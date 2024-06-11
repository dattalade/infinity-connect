const express = require('express');
const router = express.Router();
const RegisterController = require('../route_controllers/RegisterController');
const LoginController = require('../route_controllers/LoginController');
const UserInfoController = require('../route_controllers/UserInfoController');
const MessageController = require('../route_controllers/MessageController');
const ThemeController = require('../route_controllers/ThemeController');
const AllUsersController = require('../route_controllers/AllUsersController')
const UploadController = require('../route_controllers/UploadController');

router.get('/', UserInfoController.init)
router.post('/add-user', RegisterController.saveUser)
router.get('/verify', RegisterController.verifyUser)
router.post('/check-user', LoginController.checkUser)
router.post('/retrieve-userinfo', UserInfoController.userInfo)
router.post('/retrieve-usercontacts', UserInfoController.userContacts)
router.post('/send-message', MessageController.sendMessage)
router.post('/retrieve-msg', MessageController.allMessages)
router.post('/retrieve-themes', ThemeController.retrieveThemes)
router.post('/update-theme', ThemeController.updateTheme)
router.post('/search-users', AllUsersController.searchUsers)
router.post('/add-contact', AllUsersController.addContact)
router.post('/upload', UploadController.uploadMulter, UploadController.upload);
router.post('/update-avatar', UploadController.uploadMulter, UploadController.updateAvatar);
router.post('/delete-avatar', UploadController.deleteImageByUrl)

module.exports = router;
