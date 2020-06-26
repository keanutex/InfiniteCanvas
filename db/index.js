const sql = require('mssql/msnodesqlv8')
const secrets = require('../secrets')
// config for your database
var dbConfig = {
    server: 'weblevelup.database.windows.net',
    database: 'InfiniteCanvasDatabase',
    user: 'keanutex',
    password: '7WNkm8szwsdksMU'
};
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sql, poolPromise
}