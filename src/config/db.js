require('dotenv').config();
const mysql = require('mysql2');


// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '07052004',
  database: 'db_webtruyen1'
});

console.log('DB_HOST:', 'localhost');
console.log('DB_USER:', 'root');
console.log('DB_PASSWORD:', '07052004');
console.log('DB_NAME:', 'db_webtruyen1');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

module.exports = connection;