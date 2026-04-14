const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3002;
const databasePath = process.env.DB_PATH || path.join(__dirname, "recipes.db");
const schemaFilePath = path.join(__dirname, "recipes.sql");

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
    service: "recipe-service",
    database: databasePath,
    implemented: false
  });
});

app.use((_req, res) => {
  res.status(501).json({
    message: "Recipe service template"
  });
});

app.listen(PORT, () => {
  console.log(`Recipe service template running on http://localhost:${PORT}`);
});
