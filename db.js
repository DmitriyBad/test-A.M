const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.USER_DB,//'aesdgvps',
  host: process.env.HOST_DB,//'abul.db.elephantsql.com',
  database: process.env.DATABASE,//'aesdgvps',
  password: process.env.PASSWORD_DB,//'fnioWYvfpK_ifUf7l_wv6uNn0PDEQwjR',
  port: process.env.PORT_DB//5432,
})

module.exports = pool;