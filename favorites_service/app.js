const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3003;
const databasePath =
  process.env.DB_PATH || path.join(__dirname, "favorites.db");
const schemaFilePath = path.join(__dirname, "favorites.sql");

app.use(express.json());

// Ensure DB folder exists
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const db = new sqlite3.Database(databasePath);
db.serialize(() => {
  const schemaSql = fs.readFileSync(schemaFilePath, "utf8");
  db.exec(schemaSql, (err) => {
    if (err) {
      console.error("Schema error:", err.message);
    } else {
      console.log("Schema loaded successfully");
    }
  });
});

/**
 * Health check
 */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "favorites-service"
  });
});

/**
 * Add favorite
 * POST /favorites
 */
app.post("/", (req, res) => {
  const { userId, recipeId } = req.body;

  // Validate input
  if (!userId || !recipeId) {
    return res.status(400).json({ message: "userId and recipeId required" });
  }

  const sql = `
    INSERT INTO favorites (user_id, recipe_id)
    VALUES (?, ?)
  `;

  db.run(sql, [userId, recipeId], function (err) {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: "Already favorited or error occurred" });
    }

    res.status(201).json({
      message: "Recipe favorited",
      favoriteId: this.lastID
    });
  });
});
/**
 * Remove favorite
 * DELETE /favorites
 */
app.delete("/", (req, res) => {
  const { userId, recipeId } = req.body;

  if (!userId || !recipeId) {
    return res.status(400).json({ message: "userId and recipeId required" });
  }

  const sql = `
    DELETE FROM favorites
    WHERE user_id = ? AND recipe_id = ?
  `;

  db.run(sql, [userId, recipeId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to remove favorite" });
    }

    res.json({ message: "Favorite removed" });
  });
});

/**
 * Check if favorited
 * GET /favorites/check?userId=1&recipeId=2
 */
app.get("/", (_req, res) => {
  const sql = "SELECT * FROM favorites ORDER BY created_at DESC";

  db.all(sql, [], (err, rows) => {
    if (err) 
    {
      console.error("DB ERROR:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    console.log("RECIPES SENT:", rows.length);
    res.json(rows);
  });
});

app.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT recipe_id
    FROM favorites
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch favorites" });
    }

    res.json(rows);
  });
});


app.listen(PORT, () => {
  console.log(`Favorites service running on http://localhost:${PORT}`);
});