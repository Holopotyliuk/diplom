const pool = require('../connection/connection')
const bcrypt = require('bcryptjs');
async function registration(req, res) {
    try {
        const { login, password } = req.body;
        const hashPassword = bcrypt.hashSync(password, 7);
        console.log(login)
        const userCheck = await pool.query('select * from users where login=$1', [login])
        console.log(userCheck.rows)
        if (userCheck.rows.length == 0) {
            const user = await pool.query('insert into users (login, password) values ($1, $2) returning *',
                [login, hashPassword]);
            res.json(user.rows)
        } else {
            res.status(400).json({ message: `Користувач вже існує` })

            // res.json('user.rows')
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
module.exports = { registration, authorization }