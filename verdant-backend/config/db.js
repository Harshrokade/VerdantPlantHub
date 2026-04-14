const mongoose = require('mongoose');
const mysql = require('mysql2');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log(`✅ MongoDB Atlas Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  database: process.env.MYSQL_DATABASE || 'planthub',
  waitForConnections: true,
  connectionLimit: 10
});

// Test MySQL connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error(`❌ MySQL Connection Failed: ${err.message}`);
  } else {
    console.log(`✅ MySQL Workbench Connected`);
    connection.release();
  }
});

module.exports = { connectDB, mysqlPool: pool.promise() };