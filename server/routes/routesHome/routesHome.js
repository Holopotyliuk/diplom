const express = require('express')
const controller = require('../../controllers/controllers')
const router = express();
router.get('/', controller.getChatTable);
router.get('/message', controller.getMessage);
router.post('/addchat', controller.addChat);
router.post('/sendmessage', controller.sendMessage);
module.exports = router;