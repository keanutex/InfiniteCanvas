const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db')

/**
 * @swagger
 * /canvas/boardState:
 *    get:
 *      tags:
 *          - Canvas
 *      summary: Gets the board state around the given co-ordinate
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/boardState', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`SELECT * from "T-1-1000-1-1000" WHERE x = 2`)

        res.json(result.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

/**
 * @swagger
 * /canvas/drawPixel:
 *    put:
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *              schema: {}
 *      tags:
 *          - Canvas
 *      summary: Updates a co-ordinate with a colour
 *      responses:
 *        200:
 *          description: Success
 */
router.put('/drawPixel', (req, res) => {

});


module.exports = router;