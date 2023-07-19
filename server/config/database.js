const mysql = require("mysql");

const db = mysql.createConnection({
  // .env로 바꿔주기
  host: "localhost",
  user: "root",
  password: "1234",
  port: 3306,
  database: "hotelmembers",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL Connected!");
});

module.exports = db;
