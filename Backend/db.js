const mysql = require("mysql2");

// change password if needed
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Joss_rose123",
  database: "recipe_sharing"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
