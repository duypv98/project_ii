const express = require('express');
const verifyToken = require('../config/verifyToken');
const userControllers = require('../controllers/users');

const router = express.Router();

router.route('/register')
    .get(verifyToken, userControllers.getUser)
    .post(verifyToken, userControllers.create)

router.route('/login')
    .post(userControllers.login)

router.route('/logout')
    .get(userControllers.logout)

module.exports = router;