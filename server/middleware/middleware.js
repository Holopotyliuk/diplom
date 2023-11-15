const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');
module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        console.log(req.headers)
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'Користувач не авторизований' })
        }
        const decoderData = jwt.verify(token, secret);
      //  console.log(token)
       // console.log(decoderData)
        req.user = decoderData;
        next();
    } catch (e) {
        return res.status(403).json({ message: 'Користувач не авторизований' })
    }
};