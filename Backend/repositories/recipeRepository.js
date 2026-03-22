const db = require("../db/db");
//get the recipes
exports.getRecipes = (res) => {
  const sql = `
    SELECT r.*, u.username
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};
//create a recipe
exports.createRecipe = ({ userId, title, ingredients, instructions }, res) => {
  const sql = `
    INSERT INTO recipes (user_id, title, ingredients, instructions)
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [userId, title, ingredients, instructions], (err) => {
    if (err) return res.status(500).json({ error: "Create failed" });
    res.json({ message: "Recipe created" });
  });
};
//update a recipe
exports.updateRecipe = (id, data, res) => {
  const { userId, title, ingredients, instructions } = data;

  const sql = `
    UPDATE recipes
    SET title = ?, ingredients = ?, instructions = ?
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [title, ingredients, instructions, id, userId], (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });
    res.json({ message: "Recipe updated" });
  });
};
//delete a recipe
exports.deleteRecipe = (id, data, res) => {
  const { userId } = data;

  const sql = `
    DELETE FROM recipes
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [id, userId], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Recipe deleted" });
  });
};