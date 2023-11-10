const express = require('express')
const router = express();
const controller = require('../controllers/controllers')
router.use('/registration', controller.registration)
router.use('/authorization', controller.authorization)
module.exports = router;