const redis = require("async-redis");
const client = redis.createClient();
const { poolPromise } = require('../db');

async function loadDbIntoRedis() {
    let pixelstring = await client.get("pixelstring")
    //if (pixelstring == null || pixelstring == '') { add back in when deployed
    pixelstring = ''
    const pool = await poolPromise;
    const result = await pool.request()
        .query(`SELECT colour from "T-1-1000-1-1000"`)

    for (let i = 0; i < result.recordset.length; i++) {
        pixelstring += result.recordset[i].colour
    }
    await client.set("pixelstring", pixelstring)
    //}
    console.log("Database loaded into Redis")

}

module.exports = { loadDbIntoRedis }