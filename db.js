const Pool = require('pg').Pool

const pool = new Pool({
    user:'postgres',
    password:'root',
    database:'restapi',
    port:process.env.POSTGRE_PORT
})
module.exports = pool