const eventBus = require("../eventBus");
const db = require("../db");

// Add favorite
eventBus.on("FAVORITE_ADD_REQUESTED", ({ userId, recipeId, res }) => {
  const sql = "INSERT INTO favorites (user_id,recipe_id) VALUES (?,?)";
  db.query(sql, [userId, recipeId], err => {
    if (err) return res.status(400).json({ message: "Already favorited" });
    eventBus.emit("RECIPE_FAVORITED", { userId, recipeId });
    res.json({ message: "Favorited" });
  });
});

// Remove favorite
eventBus.on("FAVORITE_REMOVE_REQUESTED", ({ userId, recipeId, res }) => {
  const sql = "DELETE FROM favorites WHERE user_id=? AND recipe_id=?";
  db.query(sql, [userId, recipeId], err => {
    if (err) return res.status(500).json({ message: "Failed to remove favorite" });
    res.json({ message: "Favorite removed" });
  });
});

// Check if recipe is favorited
eventBus.on("FAVORITE_CHECK_REQUESTED", ({ userId, recipeId, res }) => {
  const sql = "SELECT * FROM favorites WHERE user_id=? AND recipe_id=?";
  db.query(sql, [userId, recipeId], (err, results) => {
    if (err) return res.status(500).json({ favorited: false });
    res.json({ favorited: results.length > 0 });
  });
});

// Fetch all favorites for a user (return full recipe info)
// Return all recipes favorited by a user
eventBus.on("FAVORITE_FETCH_REQUESTED", ({ userId, res }) => {
  const sql = `
    SELECT r.*
    FROM favorites f
    JOIN recipes r ON f.recipe_id = r.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch favorites" });
    res.json(results);
  });
});