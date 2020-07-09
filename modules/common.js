const { poolPromise } = require('../db');
const { Int } = require('mssql/msnodesqlv8');

async function isBlocked(userId) {
    const sql = `SELECT * FROM status INNER JOIN users ON status."statusId" = users."statusId" WHERE users."userId" = @userId`;
    try {
        const pool = await poolPromise;

        const response = await pool.request().input('userId', Int, userId).query(sql)
        if (response.recordset[0].name == "Blocked") {
            return true;
        } else {
            return false
        }
    } catch (err) {
        console.log(err)
    }
}

module.exports = { isBlocked };

