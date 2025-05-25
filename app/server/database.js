const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// console.log(process.env.DATABASE_URL);

client.connect()
  .then(() => console.log('Connected PostgreSQL (Supabase)!'))
  .catch(err => console.error('Connection error:', err));

const query = (text, params) => client.query(text, params);

module.exports = { query }; 