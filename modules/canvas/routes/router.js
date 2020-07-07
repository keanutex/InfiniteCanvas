const express = require('express');
const router = express.Router();
const { poolPromise } = require('../../../db');
const { Int, TinyInt } = require('mssql/msnodesqlv8');
const redis = require("async-redis");
const client = redis.createClient();

/**
 * @swagger
 * /canvas/boardState:
 *    get:
 *      tags:
 *          - Canvas
 *      summary: Gets the board state
 *      responses:
 *        200:
 *          description: Success
 */
router.get('/boardState', async (req, res) => {
    try {
        let colourarray = await client.get("colourarray")
        res.json({ colour: colourarray })
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
            .input('r', TinyInt, req.body.r)
            .input('g', TinyInt, req.body.g)
            .input('b', TinyInt, req.body.b)
            .input('userId', Int, req.body.userId)
            .query(`UPDATE "T-1-1000-1-1000" SET r = @r,g = @g,b = @b, "userId" = @userId WHERE x = @x AND y = @y`)

        let colourarray = await client.get("colourarray");
        var offset = (req.body.x - 1) * 1000 + (req.body.y - 1) * 4;

        colourarray[offset] = req.body.r;
        colourarray[offset + 1] = req.body.g;
        colourarray[offset + 2] = req.body.b;
        await client.set('pixelstring', colourarray)

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
 *      summary: Get info about a pixel
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