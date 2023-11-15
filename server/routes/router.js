const express = require('express')
const router = express();
const controller = require('../controllers/controllers')
const middleware = require('../middleware/middleware');
router.use('/registration', controller.registration)
router.use('/authorization', controller.authorization)
router.use('/home', middleware, controller.getInfo)
module.exports = router;