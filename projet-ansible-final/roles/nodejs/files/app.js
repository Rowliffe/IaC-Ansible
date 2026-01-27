const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.APP_PORT || 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'myuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'myapp',
  password: process.env.DB_PASSWORD || 'secret',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('API Backend is running!');
});

app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database Error');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

