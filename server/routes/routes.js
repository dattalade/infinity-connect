const express = require('express');
const router = express.Router();
const RegisterController = require('../route_controllers/RegisterController');
const LoginController = require('../route_controllers/LoginController');
const UserInfoController = require('../route_controllers/UserInfoController');
const MessageController = require('../route_controllers/MessageController');
const ThemeController = require('../route_controllers/ThemeController')

router.post('/add-user', RegisterController.saveUser)
router.post('/check-user', LoginController.checkUser)
router.post('/retrieve-userinfo', UserInfoController.userInfo)
router.post('/retrieve-usercontacts', UserInfoController.userContacts)
router.post('/send-message', MessageController.sendMessage)
router.post('/retrieve-msg', MessageController.allMessages)
router.post('/retrieve-themes', ThemeController.retrieveThemes)
router.post('/update-theme', ThemeController.updateTheme)
module.exports = router;
