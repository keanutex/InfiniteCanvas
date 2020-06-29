const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db')
const { Int, VarChar } = require('mssql/msnodesqlv8');
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
router.post('/login', (req, res) => {

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
router.post('/createAccount', (req, res) => {

});


async function verifyAdmin(userId) {
    const sql = `SELECT types.name FROM users INNER JOIN types ON users."typeId" = types."typeId" WHERE "userId" = @userId`;
    const pool = await poolPromise;
    const result = await pool.request()
        .input('userId', Int, userId)
        .query(sql)
    if (result.recordset.length == 0) {
        return false
    }
    if (result.recordset[0].name == "Admin") {
        return true;
    } else {
        return false;
    }
}



/**
 * @swagger
 * /account/getAllUsers:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Get all users
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/getAllUsers', async (req, res) => {
    try {
        if (await verifyAdmin(req.body.userId)) {
            const sql = "SELECT * FROM users";
            const pool = await poolPromise;
            const result = await pool.request()
                .query(sql)
            res.send(result.recordset)
        } else {
            res.status(500)
            res.send({ "error": "User is not an admin" })
        }
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }

});


module.exports = router;