const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3002;
//database
const databasePath =
  process.env.DB_PATH || path.join(__dirname, "recipes.db");
const schemaFilePath = path.join(__dirname, "recipes.sql");

app.use(express.json());

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
//check if running 
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "recipe-service"
  });
});

//get recipe order by recent one 
app.get("/", (_req, res) => {
  const sql = "SELECT * FROM recipes ORDER BY created_at DESC";

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

//create a recipe add to db
app.post("/", (req, res) => {
  const { userId, title, ingredients, instructions } = req.body;

  if (!userId || !title || !ingredients || !instructions) 
  {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    INSERT INTO recipes (user_id, title, ingredients, instructions)
    VALUES (?, ?, ?, ?)`;

  db.run(sql, [userId, title, ingredients, instructions], function (err) {
    if (err) 
    {
      console.error(err);
      return res.status(500).json({ error: "Failed to create recipe" });
    }

    res.status(201).json({
      message: "Recipe created",
      recipeId: this.lastID
    });
  });
});

//upate the recipe only the user can update
app.put("/:id", (req, res) => {
  const { userId, title, ingredients, instructions } = req.body;

  if (!userId || !title || !ingredients || !instructions) 
  {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = `
    UPDATE recipes
    SET title = ?, ingredients = ?, instructions = ?
    WHERE id = ? AND user_id = ?`;

  db.run(
    sql,
    [title, ingredients, instructions, req.params.id, userId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Update failed" });
      }
      //only user
      if (this.changes === 0) {
        return res.status(403).json({ error: "Not authorized" });
      }

      res.json({ message: "Recipe updated" });
    }
  );
});

//delete recipe
app.delete("/:id", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  const sql = `
    DELETE FROM recipes
    WHERE id = ? AND user_id = ?`;

  db.run(sql, [req.params.id, userId], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Delete failed" });
    }

    if (this.changes === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.json({ message: "Recipe deleted" });
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Recipe service running on port ${PORT}`);
});
