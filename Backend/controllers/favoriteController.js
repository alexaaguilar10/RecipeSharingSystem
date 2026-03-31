const favoriteModel = require("../models/favoriteModel");

// Add favorite
exports.addFavorite = (req, res) => {
  const { userId, recipeId } = req.body;

  favoriteModel.addFavorite([userId, recipeId], (err) => {
    if (err) {
      return res.status(400).json({ message: "Already favorited" });
    }
    res.json({ message: "Recipe favorited" });
  });
};

// Remove favorite
exports.removeFavorite = (req, res) => {
  const { userId, recipeId } = req.body;

  favoriteModel.removeFavorite([userId, recipeId], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error removing favorite" });
    }
    res.json({ message: "Favorite removed" });
  });
};

// Get all favorites for a user
exports.getFavorites = (req, res) => {
  const userId = req.params.userId;

  favoriteModel.getFavorites(userId, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};

// Check if recipe is favorited
exports.checkFavorite = (req, res) => {
  const { userId, recipeId } = req.params;

  favoriteModel.checkFavorite([userId, recipeId], (err, results) => {
    if (results.length > 0) {
      res.json({ favorited: true });
    } else {
      res.json({ favorited: false });
    }
  });
};