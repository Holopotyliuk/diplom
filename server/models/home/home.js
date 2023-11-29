const pool = require('../../connection/connection')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
//const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 } });
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
    const { id, name, login } = req.user;
    try {
        const userCheck = await pool.query('select * from users where login=$1', [req.body.login]);
        if (userCheck.rows.length == 0) {
            res.json('Користувача не існує')
        } else {
            if (Number.isInteger(req.user.id)) {
                const spliceLogin = login + userCheck.rows[0].login;
                const hashName = bcrypt.hashSync(spliceLogin, 7);
                const tableName = `chatlist${id}`;
                const createQuery = `
                insert into ${tableName} (name, login, hash) values ('${userCheck.rows[0].name}', '${userCheck.rows[0].login}', '${hashName}');
              `;
                const newChat = async (query) => {
                    await pool.query(query);
                }
                //Додавання чату в таблицю першого користувача
                newChat(createQuery);
                //Додавання чату в таблицю другого користувача
                newChat(formingQueryForAddData(userCheck.rows[0].id, name, login, hashName));
                //Створення таблиці для збереження надісланих даних
                newChat(formingQueryForCreateTable(hashName));
                res.json(newChat.rows);
            } else {
                console.log('false')
            }

        }
    } catch (error) {
        console.log(error)
    }
}
function formingQueryForAddData(id, name, login, hash) {
    const tableName = `chatlist${id}`;
    const createQuery = `
    insert into ${tableName} (name, login, hash) values ('${name}', '${login}', '${hash}');
  `;
    return createQuery;
}
function formingQueryForCreateTable(hash) {
    const createQuery = `
    create table "${hash}" (id serial, userid int, text varchar(255), file_data BYTEA);
  `;
    return createQuery;
}
async function getMessage(req, res) {
    const idUser = req.user.id;
    try {
        const id = req.query.id;
        // if (Number.isInteger(id)) {
        const name = `chatlist${idUser}`;
        const getTableName = await pool.query(`select hash from ${name} where id=$1`, [id])
        const getMessage = await pool.query(`select * from "${getTableName.rows[0].hash}" `);
        console.log(getMessage.rows)
        res.json({
            id: idUser,
            data: getMessage.rows
        })
        // } else {
        //     res.json('Помилка')
        //  }

    } catch (error) {
        // console.log(error)
    }
}
async function sendMessage(req, res) {
    const { id, name, login } = req.user;
    const { message, idChat } = req.body;
    try {
        const name = `chatlist${id}`;
        const getTableName = await pool.query(`select hash from ${name} where id=$1`, [idChat]);
        const tableName = getTableName.rows[0].hash;
        const sendMessage = await pool.query(`insert into "${tableName}" (userid, text) values ($1, $2) returning *`, [id, message]);
        res.json(sendMessage.rows);
        console.log(sendMessage.rows)
    } catch (error) {
        console.log(error)
    }
}
async function sendFile(req, res) {
    try {
        const storage = multer.memoryStorage(); // Зберігаємо файл у пам'яті, а не на диску
        const upload = multer({ storage: storage });
        // Викликайте middleware upload.single('file') перед обробкою запиту
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error('Помилка при завантаженні файлу:', err);
                return res.status(400).send('Помилка при завантаженні файлу.');
            }

            const uploadedFile = req.file;
            const fileBuffer = req.file.buffer;
            const filePath = 'D:/Нова папка (2)/text.txt';
            fs.writeFileSync(filePath, fileBuffer);
            if (!uploadedFile) {
                return res.status(400).send('Файл не було завантажено.');
            }

            res.status(200).send('Файл успішно завантажено.');
        });

    } catch (error) {
        console.log(error)
    }
}
module.exports = { getChatTable, addChat, getMessage, sendMessage, sendFile }