const pool = require('../../connection/connection')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const chardet = require('chardet');
const jschardet = require('jschardet');
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
    create table "${hash}" (id serial, userid int, text varchar(255), file_json JSONB, type varchar(255));
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
        const getMessage = await pool.query(`select id, userid, text, type from "${getTableName.rows[0].hash}" `);
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
        const type = 'text';
        const sendMessage = await pool.query(`insert into "${tableName}" (userid, text, type) values ($1, $2, $3) returning *`, [id, message, type]);
        res.json(sendMessage.rows);
        console.log(sendMessage.rows)
    } catch (error) {
        console.log(error)
    }
}
async function sendFile(req, res) {
    const { id } = req.user;
    try {
        const storage = multer.memoryStorage(); // Зберігаємо файл у пам'яті, а не на диску
        const upload = multer({ storage: storage });
        // Викликайте middleware upload.single('file') перед обробкою запиту
        upload.single('file')(req, res, async (err) => {
            const { idChat } = req.body;
            if (err) {
                console.error('Помилка при завантаженні файлу:', err);
                return res.status(400).send('Помилка при завантаженні файлу.');
            }

            const uploadedFile = req.file;
            const fileBuffer = req.file.buffer;
            const fileExtension = uploadedFile.originalname.split('.').pop();
            const encoding = jschardet.detect(fileBuffer).encoding || 'utf-8';
            //const encoding = chardet.detect(fileBuffer);
            const decodedFilename = Buffer.from(uploadedFile.originalname, 'binary').toString(encoding);
            //const decodedFilename = iconv.decode(uploadedFile.originalname, encoding);
            const lastDotIndex = decodedFilename.lastIndexOf('.');
            const valueBeforeLastDot = lastDotIndex !== -1 ? decodedFilename.substring(0, lastDotIndex) : decodedFilename;
            const jsonData = { name: valueBeforeLastDot, type: fileExtension, data: fileBuffer };

            if (!uploadedFile) {
                return res.status(400).send('Файл не було завантажено.');
            }
            const name = `chatlist${id}`;
            const getTableName = await pool.query(`select hash from ${name} where id=$1`, [idChat]);
            const tableName = getTableName.rows[0].hash;
            const type = "file";
            const sendFile = await pool.query(`insert into "${tableName}" (userid, text, file_json, type) values ($1, $2, $3, $4) returning *`, [id, decodedFilename, jsonData, type]);
            //res.json(sendFile.rows);
            res.json(fileBuffer)
        });
    } catch (error) {
        console.log(error)
    }
}
async function getFile(req, res) {
    const { id } = req.user;
    try {
        const { idM, idC } = req.query;
        const name = `chatlist${id}`;
        const getTableName = await pool.query(`select hash from ${name} where id=$1`, [idC]);
        const tableName = getTableName.rows[0].hash;
        const getFile = await pool.query(`select file_json from "${tableName}" where id=$1`, [idM]);
        res.json(getFile.rows[0])
    } catch (error) {
        console.log(error)
    }
}
module.exports = { getChatTable, addChat, getMessage, sendMessage, sendFile, getFile }