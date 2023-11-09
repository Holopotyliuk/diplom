const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    password: 'holopotyliuk',
    host: 'localhost',
    port: 5432,
    database: 'mydatabase'
});
module.exports = pool;