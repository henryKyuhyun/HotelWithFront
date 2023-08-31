const mysql = require("mysql");

const db = mysql.createConnection({
  // .env로 바꿔주기
  host: "localhost", //Error: connect ECONNREFUSED ::1:3306
  // host: "127.0.0.1",
  user: "root",
  password: "zhtanf5246150!",
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
