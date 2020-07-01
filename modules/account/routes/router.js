const express = require('express');
const router = express.Router();

//***************************** Configuraion for sql connection
var sql = require("mssql");
const config = {
//enter config
};


//***************************** Configuraion for encription


const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

/**
 * @swagger
 * /account/login:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema: {}
 *      tags:
 *          - Account
 *      summary: Login request for a user
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/signin', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let AUTH_USER = `SELECT PASSWORD FROM USERS WHERE USERNAME = '${username}';`;

    sql.connect(config, function (err) {
        let request = new sql.Request();
        let passwordReps = '';

        request.query(AUTH_USER, function (err, recordset) {
            if (recordset != null && recordset.recordset[0] != null) {
                passwordReps = recordset.recordset[0].PASSWORD.toString();
                try {
                    console.log(passwordReps);
                    passwordReps = cryptr.decrypt(passwordReps);
                    console.log(passwordReps);
                }
                catch (ex) {
                    console.log(ex);
                    res.status(500).send();
                    return;
                }
                if (password == passwordReps) {
                    res.status(200).send();
                    console.log('Logged in...');
                }
            }

            else {
                console.log(err);
                res.status(500).send();
                console.log(recordset);
                console.log('Error occourred, be better...');
            }
        });
    });

});

/**
 * @swagger
 * /account/createAccount:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Create an account
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/register', (req, res) => {
    let reqBody = req.body;
    let password = cryptr.encrypt(reqBody.password);
    let username = reqBody.username;
    let email = reqBody.email;

    let INSERT_USERS = `INSERT INTO USERS (EMAIL, PASSWORD, USERNAME, TYPEID, STATUSID) VALUES ('${email}', '${password}', '${username}', 1, 1);`;
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // Insert user into database
        request.query(INSERT_USERS, function (err, recordset) {
            if (err) {
                console.log(err)
            }
            else {
                res.status(200).send();
                console.log('Registered successfully');
            }
        });
    });

});




module.exports = router;