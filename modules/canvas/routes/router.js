const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db');
const { Int, VarChar } = require('mssql/msnodesqlv8');
const redis = require("async-redis");
const client = redis.createClient();

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
        let pixelstring = await client.get("pixelstring")
        res.json({ colour: pixelstring })
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
            .input('userId', Int, req.body.userId)
            .query(`UPDATE "T-1-1000-1-1000" SET colour = @colour, "userId" = @userId WHERE x = @x AND y = @y`)

        let pixelstring = await client.get("pixelstring")
        var offset = (req.body.x - 1) * 1000 + (req.body.y - 1) * 4
        pixelstring = pixelstring.substring(0, offset) + req.body.colour + pixelstring.substring(offset + 4, pixelstring.length);
        await client.set('pixelstring', pixelstring)

        res.json(result.recordset)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});

/**
 * @swagger
 * /canvas/getPixelInfo:
 *    post:
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
router.post('/getPixelInfo', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('x', Int, req.body.x)
            .input('y', Int, req.body.y)
            .query(`SELECT canvas.colour, canvas.userId, users.username FROM "T-1-1000-1-1000" as canvas JOIN users ON users."userId" = canvas."userId"  WHERE x = @x AND y = @y`)
        res.json(result.recordset[0])
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
});




module.exports = router;