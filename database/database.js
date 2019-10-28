const { Pool } = require('pg');

require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING;


const pool = new Pool({
  connectionString: connectionString
});
// come back and check this. may need to convert to initializeDB function and run at server start.
module.exports = pool;