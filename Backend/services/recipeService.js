const eventBus = require("../eventBus");
const db = require("../db");

// Create recipe
eventBus.on("RECIPE_CREATE_REQUESTED", ({ data, res }) => {
  const { userId, title, ingredients, instructions } = data;

  const sql = `
    INSERT INTO recipes (user_id,title,ingredients,instructions)
    VALUES (?,?,?,?)
  `;

  db.query(sql, [userId, title, ingredients, instructions], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed" });

    // Get the inserted recipe ID
    const newRecipe = {
      id: result.insertId,
      user_id: userId,
      title,
      ingredients,
      instructions
    };

    eventBus.emit("RECIPE_CREATED", newRecipe);

    res.json({ message: "Recipe created", recipe: newRecipe });
  });
});

// Update recipe
eventBus.on("RECIPE_UPDATE_REQUESTED", ({ id, userId, title, ingredients, instructions, res }) => {
  const sql = `
    UPDATE recipes
    SET title=?, ingredients=?, instructions=?
    WHERE id=? AND user_id=?
  `;
  db.query(sql, [title, ingredients, instructions, id, userId], err => {
    if (err) return res.status(500).json({ error: "Failed to update recipe" });
    res.json({ message: "Recipe updated" });
  });
});

// Delete recipe
eventBus.on("RECIPE_DELETE_REQUESTED", ({ id, data, res }) => {
  const sql = "DELETE FROM recipes WHERE id=? AND user_id=?";
  db.query(sql, [id, data.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to delete recipe" });
    res.json({ message: "Recipe deleted" });
  });
});

eventBus.on("RECIPES_FETCH_REQUESTED", ({ res }) => {
  const sql = `
    SELECT r.*, u.username
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch recipes" });
    res.json(results);
  });
});