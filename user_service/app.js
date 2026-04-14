const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3001;
const databasePath = process.env.DB_PATH || path.join(__dirname, "users.db");
const schemaFilePath = path.join(__dirname, "users.sql");

app.use(express.json());

function createDatabaseFolder() {
  const folderPath = path.dirname(databasePath);
  fs.mkdirSync(folderPath, { recursive: true });
}

function connectToDatabase() {
  return new sqlite3.Database(databasePath, (error) => {
    if (error) {
      console.error("Failed to connect to the user database:", error.message);
    }
  });
}

function runSchema(database) {
  const schemaSql = fs.readFileSync(schemaFilePath, "utf8");

  database.exec(schemaSql, (error) => {
    if (error) {
      console.error("Failed to initialize user schema:", error.message);
    }
  });
}

function createUser(username, email, password, callback) {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.run(sql, [username, email, password], callback);
}

function findUserByEmail(email, callback) {
  const sql = "SELECT id, username, password FROM users WHERE email = ?";
  db.get(sql, [email], callback);
}

createDatabaseFolder();

const db = connectToDatabase();

db.serialize(() => {
  runSchema(db);
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "user-service",
    database: databasePath
  });
});

app.post("/signup", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  createUser(username, email, password, function onUserCreated(error) {
    if (error) {
      if (error.message.includes("UNIQUE")) {
        res.status(400).json({ message: "Email already exists." });
        return;
      }

      res.status(500).json({ message: "Unable to create account." });
      return;
    }

    res.status(201).json({
      message: "Signup successful",
      userId: this.lastID
    });
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  findUserByEmail(email, (error, user) => {
    if (error) {
      res.status(500).json({ message: "Unable to log in." });
      return;
    }

    if (!user) {
      res.status(404).json({ message: "Account not found. Please sign up." });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ message: "Incorrect password." });
      return;
    }

    res.json({
      message: "Login successful",
      userId: user.id,
      username: user.username
    });
  });
});

app.listen(PORT, () => {
  console.log(`User service running on http://localhost:${PORT}`);
});
