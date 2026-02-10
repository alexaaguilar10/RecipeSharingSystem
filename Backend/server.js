const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// SIGN UP
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  const sql =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], (err) => {
    if (err) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    res.json({ message: "Signup successful" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (results.length === 0) {
      return res.status(404).json({
        message: "Account not found. Please sign up."
      });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect password."
      });
    }

    res.json({
      message: "Login successful",
      username: user.username
    });
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


