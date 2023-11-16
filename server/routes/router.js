const express = require('express')
const router = express();
const controller = require('../controllers/controllers')
const middleware = require('../middleware/middleware');
const routesHome = require('./routesHome/routesHome');
router.use('/registration', controller.registration)
router.use('/authorization', controller.authorization)
router.use('/home', middleware, routesHome);
//router.use('/home', middleware, controller.getChatTable)
//router.use('/home/addchat', middleware, routesHome)
module.exports = router;