const pool = require('../../connection/connection')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
async function getChatTable(req, res) {
    const { user, token } = req;
    try {
        if (Number.isInteger(user.id)) {
            const tableName = `chatlist${user.id}`;
            const getChatTable = `
            select * from ${tableName}
          `;
            const chatTable = await pool.query(getChatTable);
            // console.log(chatTable.rows);
            res.json(chatTable.rows)
        } else { console.log('false') }

    } catch (error) {
        console.log(error)
    }
}
async function addChat(req, res) {
    //const { login } = req.body;
    const { id, name, login } = req.user;
    try {
        const userCheck = await pool.query('select * from users where login=$1', [req.body.login]);
        if (userCheck.rows.length == 0) {
            res.json('Користувача не існує')
        } else {
            if (Number.isInteger(req.user.id)) {
                console.log(req.user.id)
                const tableName = `chatlist${id}`;
                const hashs = 'sdgsdfg';
                console.log(userCheck.rows[0].name)
                const createQuery = `
                insert into ${tableName} (name, login, hash) values ('${userCheck.rows[0].name}', '${userCheck.rows[0].login}', '${hashs}');
              `;
                const newChat = async (query) => {
                    await pool.query(query);
                }
                newChat(createQuery);
                // const newChat = await pool.query(createQuery);
                console.log(userCheck.rows[0].id);
                //const newChatFor = await pool.query(createQuery);
                newChat(formingQuery(userCheck.rows[0].id, name, login, hashs));
                res.json(newChat.rows);
            } else {
                console.log('false')
            }

        }
    } catch (error) {
        console.log(error)
    }
}
function formingQuery(id, name, login, hash) {
    const tableName = `chatlist${id}`;
    const createQuery = `
    insert into ${tableName} (name, login, hash) values ('${name}', '${login}', '${hash}');
  `;
    return createQuery;
}
module.exports = { getChatTable, addChat }