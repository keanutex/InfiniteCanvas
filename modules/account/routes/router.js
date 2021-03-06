const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db');
const { Int, VarChar } = require('mssql/msnodesqlv8');
const common = require('../../common');

/**
 * @swagger
 * /account/signin:
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
router.post('/signin', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', VarChar, req.body.email)
            .query(`SELECT "userId", "typeId", "statusId" FROM users WHERE email = @email`)

        if (result != null && result.recordset[0] != null && !(await common.isBlocked(result.recordset[0].userId))) {
            res.status(200).send({ "userId": result.recordset[0].userId, "typeId": result.recordset[0].typeId, "statusId": result.recordset[0].statusId });
            console.log('Logged in...');
        }
        else {
            res.status(500).send();
            console.log(result);
            console.log('Error occourred, be better...');
        }
    }
    catch (ex) {
        console.log(ex);
        res.status(500).send();
        return;
    }

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

router.post('/users', async (req, res) => {
    try {
        let available = await verifyUsername(req.body.username);
        if (available) {
            res.status(200);
            res.send();
        }
        else {
            res.status(204);
            res.send({ msg: 'User Taken' });
        }
    }
    catch (error) {
        res.status(500);
    }
})

router.post('/register', async (req, res) => {
    let reqBody = req.body;
    let username = reqBody.username;
    let email = reqBody.email;

    try {
        let INSERT_USERS = `INSERT INTO USERS (EMAIL, USERNAME, TYPEID, STATUSID) VALUES (@email, @username, 1, 1);`;
        const pool = await poolPromise;

        const result = await pool.request()
            .input('email', VarChar, email)
            .input('username', VarChar, username)
            .query(INSERT_USERS)

        console.log(result);

        if (result.rowsAffected.length === 1) {
            const result = await pool.request()
                .input('username', VarChar, username)
                .query(`SELECT userId FROM users WHERE username = @username`)

            res.status(200)
            res.send({ "userId": result.recordset[0].userId, "typeId": 1, "statusId": 1 })
        }
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
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

async function verifyUsername(username) {
    console.log("\n", username, '\n');
    const sql = `SELECT * FROM users WHERE USERNAME = @username`;
    const pool = await poolPromise;
    const result = await pool.request()
        .input('username', VarChar, username)
        .query(sql)
    if (result.recordset.length == 0) {
        console.log("\n", "yah boy", '\n');

        return true;
    }
    else {
        console.log("\n", "nah boy", '\n');

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
            const pool = await poolPromise;
            const result = await pool.request()
                .execute('getUserProc');

            if (result.recordset.length > 0) {
                res.send(result.recordset);
            }
        } else {
            res.status(500);
            res.send({ "error": "User is not an admin" });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

});


/**
 * @swagger
 * /account/setUserAdmin:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Set a user as an admin
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/setUserAdmin', async (req, res) => {
    try {
        if (await verifyAdmin(req.body.adminId)) {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', Int, req.body.userId)
                .execute('setAdminProc');

            if (result.rowsAffected[0] === 1)
                res.send({ "success": "User is now an admin" });
        } else {
            res.status(500);
            res.send({ "error": "User is not an admin" });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

});

/**
 * @swagger
 * /account/removeUserAdmin:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Revoke admin from a user
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/removeUserAdmin', async (req, res) => {
    try {
        if (await verifyAdmin(req.body.adminId)) {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', Int, req.body.userId)
                .execute('demoteAdminProc');

            if (result.rowsAffected[0] === 1)
                res.send({ "success": "User has been demoted" });
        } else {
            res.status(500)
            res.send({ "error": "User is not an admin" })
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

});

/**
 * @swagger
 * /account/banUser:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Ban a user from the server
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/banUser', async (req, res) => {
    try {
        if (await verifyAdmin(req.body.adminId)) {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', Int, req.body.userId)
                .execute('banUserProc');

            if (result.rowsAffected[0] === 1)
                res.send({ "success": "User has been banned" });
        } else {
            res.status(500);
            res.send({ "error": "User is not an admin" });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

});

/**
 * @swagger
 * /account/unbanUser:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Account
 *      summary: Allow a user to the server
 *      responses:
 *        200:
 *          description: Success
 */
router.post('/unbanUser', async (req, res) => {
    try {
        if (await verifyAdmin(req.body.adminId)) {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('userId', Int, req.body.userId)
                .execute('unbanUserProc');

            if (result.rowsAffected[0] === 1)
                res.send({ "success": "User has been unbanned" });
        } else {
            res.status(500);
            res.send({ "error": "User is not an admin" });
        }
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }

});

module.exports = router;
