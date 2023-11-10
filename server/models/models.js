const pool = require('../connection/connection')
async function read(req, res) {
    const info = await pool.query('select * from test');
    res.json(info.rows)
}
module.exports = { read }