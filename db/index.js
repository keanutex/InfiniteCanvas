const sql = require('mssql/msnodesqlv8')
// config for your database
const config = {
    driver: "msnodesqlv8",
    server: 'KEANUT',
    database: 'InfiniteCanvasDatabase',
    options: {
        trustedConnection: true,
        useUTC: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
    sql, poolPromise
}