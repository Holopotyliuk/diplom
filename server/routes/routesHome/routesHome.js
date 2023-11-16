const express = require('express')
const controller = require('../../controllers/controllers')
const router = express();
router.get('/', controller.getChatTable);
router.post('/addchat', controller.addChat);
module.exports = router;