const db = require("../db/db");

//add the favorite
exports.addFavorite = ({ userId, recipeId }, res) => {
  db.query(
    "INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)",
    [userId, recipeId],
    (err) => {
      if (err) return res.status(400).json({ message: "Already favorited" });
      res.json({ message: "Recipe favorited" });
    }
  );
};

//remove the favorite
exports.removeFavorite = ({ userId, recipeId }, res) => {
  db.query(
    "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?",
    [userId, recipeId],
    (err) => {
      if (err) return res.status(500).json({ error: "Remove failed" });
      res.json({ message: "Removed from favorites" });
    }
  );
};

//get the information the recipe has to go to the favorites
exports.getFavorites = (userId, res) => {
  const sql = `
    SELECT r.*
    FROM favorites f
    JOIN recipes r ON f.recipe_id = r.id
    WHERE f.user_id = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
};

//check the favorite
exports.checkFavorite = ({ userId, recipeId }, res) => {
  const sql = `
    SELECT * FROM favorites
    WHERE user_id = ? AND recipe_id = ?
  `;

  db.query(sql, [userId, recipeId], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({ favorited: results.length > 0 });
  });
};