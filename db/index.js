const sql = require('mssql/msnodesqlv8')
const secrets = require('../secrets')
// config for your database

const poolPromise = new sql.ConnectionPool(secrets)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sql, poolPromise
}