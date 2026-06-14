const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function reseed() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || parseInt(process.env.DB_PORT) || 3306,
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'shanti_pickles',
    multipleStatements: true,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    // Read files as UTF-8
    const schemaSql = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
    const seedSql = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');

    console.log('Executing schema.sql...');
    await connection.query(schemaSql);
    
    console.log('Executing seed.sql...');
    await connection.query(seedSql);

    console.log('Database successfully re-seeded with UTF-8 encoding!');
  } catch (error) {
    console.error('Error during re-seed:', error);
  } finally {
    await connection.end();
  }
}

reseed();
