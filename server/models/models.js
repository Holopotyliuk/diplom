const { check } = require('express-validator');
const pool = require('../connection/connection')
const bcrypt = require('bcryptjs');
async function registration(req, res) {
    try {
        const check = checkRequest(req);
        if (check.status) {
            const { name, login, password } = req.body;
            const hashPassword = bcrypt.hashSync(password, 7);
            const userCheck = await pool.query('select * from users where login=$1', [login])
            if (userCheck.rows.length == 0) {
                const user = await pool.query('insert into users (name, login, password) values ($1, $2, $3) returning *',
                    [name, login, hashPassword]);
                res.json(user.rows)
            } else {
                res.status(400).json({ message: `Користувач вже існує` })
            }
        } else {
            console.log(check.message)
        }
    } catch (error) {
        console.log(error)
    }

}
async function authorization(req, res) {
    try {
        const { login, password } = req.body;
        const userCheck = await pool.query('select * from users where login=$1', [login])
        if (userCheck.rows.length !== 0) {
            const validPassword = bcrypt.compareSync(password, userCheck.rows[0].password);
            if (validPassword) {
                res.json('true')
            } else {
                res.status(400).json({ message: `Не правильний пароль` })
            }
        } else {
            res.status(400).json({ message: `Користувача не існує` })
        }
    } catch (error) {
        console.log(error)
    }

}
function checkRequest(req) {
    const { name, login, password } = req.body;
    const check = {
        status: 0,
        message: ''
    };
    
    if (name) {
        check.status = true
    } else {
        check.status = false
        check.message = 'Введіть ім`я';
        return check;
    }
    const cleanedLogin = login.replace(/\s/g, '');
    const isValid = /^\d{12}$/.test(cleanedLogin) && cleanedLogin.startsWith('380');
    if (isValid) {
        check.status = true
    } else {
        check.status = false
        check.message = 'Не коректний номер';
        return check;
    }
    const digitCount = password.toString().replace(/\D/g, '').length;
    const lenghtPassword = digitCount >= 8 && digitCount <= 20;
    if (lenghtPassword) {
        check.status = true
    } else {
        check.status = false
        check.message = 'Не коректний пароль';
        return check;
    }
    return check;
}
module.exports = { registration, authorization }