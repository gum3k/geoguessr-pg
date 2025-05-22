const { Client } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const client = new Client({
  connectionString: 'postgresql://postgres:Dziwka556@ornqngpjocvyudkwhnxb.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

console.log(process.env.DATABASE_URL);

client.connect()
  .then(() => console.log('Połączono z bazą danych Render!'))
  .catch(err => console.error('Błąd połączenia:', err));

const query = (text, params) => client.query(text, params);

module.exports = { query };