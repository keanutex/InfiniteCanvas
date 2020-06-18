const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /login:
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
 * /createAccount:
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




module.exports = router;