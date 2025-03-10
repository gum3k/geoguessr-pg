const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'GeoGuessrDatabase',
  password: '1928',
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
