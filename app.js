//***************************** Configuraion for node application
const hostname = '127.0.0.1';

const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

//***************************** Configuraion for sql connection
var sql = require("mssql");
const config = {
    user: 'keanutex',
    password: '7WNkm8szwsdksMU',
    server: 'weblevelup.database.windows.net',
    database: 'InfiniteCanvasDatabase'
};

//***************************** Configuraion for encription
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    console.log(iv);
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    console.log(encryptedText);
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

//***************************** Configure endpoint
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.listen(port, hostname, () => {
    console.log('Listening on port', port)
});

//***************************** Lisent for sign in post requests

app.post('/users/register', function (req, res) {
    let reqBody = req.body;

    email = reqBody.email;
    let encryptData = encrypt(reqBody.password);
    console.log(encryptData);
    let iv = encryptData.iv;
    let password = encryptData.encryptedData;

    username = reqBody.username;

    var INSERT_USERS = `INSERT INTO USERS (EMAIL, PASSWORD, USERNAME, TYPEID, STATUSID, IV) VALUES ('${email}', '${password}', '${username}', 1, 1, '${iv}');`

    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // Insert user into database
        request.query(INSERT_USERS, function (err, recordset) {
            res.status(200).send();
            console.log('respose recieved and sent back');
        });
    });
})

app.post('/users/signin', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;


    var AUTH_USER = `SELECT PASSWORD, IV FROM USERS WHERE USERNAME = '${username}';`;
    sql.connect(config, function (err) {

        // create Request object
        var request = new sql.Request();
        var password_reps = '';
        // Insert user into database
        request.query(AUTH_USER, function (err, recordset) {
            if (recordset.recordset[0] != null) {
                password_reps = recordset.recordset[0].PASSWORD.toString();
                let iv = recordset.recordset[0].IV.toString();
                var decryptObj = {
                    iv: iv,
                    encryptedData: password_reps
                };

                console.log(decryptObj);
                password_reps = decrypt(decryptObj);


                console.log(password_reps);
            }
            if (password == password_reps) {
                res.status(200).send();
                console.log('respose recieved and sent back');
            }
            else {
                res.status(400).send();
                console.log('respose recieved and sent back');
            }
        });
    });
})
