const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./server/routes/router')
app.use(cors());
app.use(express.json())
app.use(cookieParser('secret key'));
app.use(router);

module.exports = app



