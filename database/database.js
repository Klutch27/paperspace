const { Pool } = require('pg');

require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING;


const pool = new Pool({
  connectionString: connectionString
});

module.exports = pool;