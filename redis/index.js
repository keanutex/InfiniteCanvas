const redis = require("async-redis");
const client = redis.createClient();
const { poolPromise } = require('../db');

async function loadDbIntoRedis() {
    let colourarray = await client.get('colourarray')

    colourarray = ''
    const pool = await poolPromise;
    const result = await pool.request()
        .query(`SELECT r, g, b from "T-1-1000-1-1000"`)

    for (let i = 0; i < result.recordset.length - 1; i++) {
        colourarray += result.recordset[i].r + ' ' + result.recordset[i].g + ' ' + result.recordset[i].b + ' '
    }
    colourarray += result.recordset[result.recordset.length - 1].r + ' ' + result.recordset[result.recordset.length - 1].g + ' ' + result.recordset[result.recordset.length - 1].b
    await client.set('colourarray', colourarray)

    console.log("Database loaded into Redis")
}

module.exports = { loadDbIntoRedis }