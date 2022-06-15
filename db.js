const Pool = require("pg").Pool;

const pool = new Pool({
  user: 'aesdgvps',
  host: 'abul.db.elephantsql.com',
  database: 'aesdgvps',
  password: 'fnioWYvfpK_ifUf7l_wv6uNn0PDEQwjR',
  port: 5432,
})

module.exports = pool;