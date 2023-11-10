const express = require('express')
const router = express();
const controller = require('../controllers/controllers')
router.use('/info', controller.read)

module.exports = router;