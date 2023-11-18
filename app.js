const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./server/routes/router')
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    next();
});
app.use(cors());
app.use(express.json())
app.use(cookieParser('secret key'));
app.use(router);

module.exports = app



