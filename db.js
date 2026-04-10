const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, '');

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function initTables() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS timescaledb`)
  // Create kittens table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kittens (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // Create weights table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS weights (
      time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      kitten_id INTEGER NOT NULL REFERENCES kittens(id),
      weight DECIMAL(5,2) NOT NULL
    )
  `);

  // Convert to hypertable (TimescaleDB)
  await pool.query(`
    SELECT create_hypertable('weights', 'time', if_not_exists => TRUE)
  `);
}

async function createKitten(name) {
  const result = await pool.query(
    'INSERT INTO kittens (name) VALUES ($1) RETURNING id',
    [name]
  );
  return result.rows[0].id;
}

async function addWeight(kittenId, weight) {
  await pool.query(
    'INSERT INTO weights (kitten_id, weight) VALUES ($1, $2)',
    [kittenId, weight]
  );
}

async function getKittensWithCurrentWeight() {
  const result = await pool.query(`
    SELECT k.id, k.name, w.weight, w.time as updated_at
    FROM kittens k
    LEFT JOIN LATERAL (
      SELECT weight, time
      FROM weights
      WHERE kitten_id = k.id
      ORDER BY time DESC
      LIMIT 1
    ) w ON true
    ORDER BY k.name
  `);
  return result.rows;
}

module.exports = {
  initTables,
  createKitten,
  addWeight,
  getKittensWithCurrentWeight,
};
