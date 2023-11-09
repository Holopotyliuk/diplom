const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./server/connection/connection')
app.use(cors());
app.use(express.json())
app.use('/info',getInfo);
async function getInfo(req, res) {
    const test = await pool.query('select * from test');
    res.json(test.rows)
}
module.exports=app



