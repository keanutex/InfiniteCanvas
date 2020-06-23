const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db');
const { Int, VarChar } = require('mssql/msnodesqlv8');


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
            .query(`SELECT colour from "T-1-1000-1-1000"`)

        var pixelstring = "";
        for (i = 0; i < result.recordset.length-1; i++) {
            pixelstring += result.recordset[i].colour + ' '
        }
        pixelstring += result.recordset[result.recordset.length-1].colour

        res.json(pixelstring)
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
router.put('/drawPixel', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('x', Int, req.body.x)
            .input('y', Int, req.body.y)
            .input('colour', VarChar, req.body.colour)
            .query(`UPDATE "T-1-1000-1-1000" SET colour = @colour WHERE x = @x AND @y = y`)

        res.json(result.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }

});


module.exports = router;