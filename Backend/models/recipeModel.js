const db = require("../config/db");

exports.getAllRecipes = (callback) => {
  const sql = `
    SELECT r.*, u.username
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;
  db.query(sql, callback);
};

exports.createRecipe = (data, callback) => {
  const sql = `
    INSERT INTO recipes (user_id, title, ingredients, instructions)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, data, callback);
};

exports.updateRecipe = (data, callback) => {
  const sql = `
    UPDATE recipes
    SET title=?, ingredients=?, instructions=?
    WHERE id=? AND user_id=?
  `;
  db.query(sql, data, callback);
};

exports.deleteRecipe = (data, callback) => {
  const sql = `
    DELETE FROM recipes
    WHERE id=? AND user_id=?
  `;
  db.query(sql, data, callback);
};