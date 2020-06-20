const express = require('express');
const router = express.Router();
const sql = require("mssql/msnodesqlv8");

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
router.get('/boardState', (req, res) => {

    console.log("here")

    // config for your database
    var config = {
        driver: "msnodesqlv8",
        server: 'KEANUT',
        database: 'InfiniteCanvasDatabase',
        options: {
            trustedConnection: true,
            useUTC: true
        }
    };

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query(`select * from "T-1-1000-1-1000"`, function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);

        });
    });

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