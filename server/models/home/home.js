const pool = require('../../connection/connection')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
async function getInfo(req, res) {
    const { user, token } = req;
    try {
        console.log(user);
        res.json('hello')

    } catch (error) {
        console.log(error)
    }
}

module.exports = { getInfo }