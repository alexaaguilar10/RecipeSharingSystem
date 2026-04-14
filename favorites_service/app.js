const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3003;
const databasePath = process.env.DB_PATH || path.join(__dirname, "favorites.db");
const schemaFilePath = path.join(__dirname, "favorites.sql");

app.use(express.json());

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new sqlite3.Database(databasePath);
db.serialize(() => {
  const schemaSql = fs.readFileSync(schemaFilePath, "utf8");
  db.exec(schemaSql);
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "favorites-service",
    database: databasePath,
    implemented: false
  });
});

app.use((_req, res) => {
  res.status(501).json({
    message: "Favorites service template"
  });
});

app.listen(PORT, () => {
  console.log(`Favorites service template running on http://localhost:${PORT}`);
});
