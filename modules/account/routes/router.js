const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db');
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

            if(result.rowsAffected[0] === 1)
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

            if(result.rowsAffected[0] === 1)
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
            
            if(result.rowsAffected[0] === 1)
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

            if(result.rowsAffected[0] === 1)
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