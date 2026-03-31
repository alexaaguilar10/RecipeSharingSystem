const recipeModel = require("../models/recipeModel");

exports.getRecipes = (req, res) => {
  recipeModel.getAllRecipes((err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
};

exports.createRecipe = (req, res) => {
  const { userId, title, ingredients, instructions } = req.body;

  recipeModel.createRecipe(
    [userId, title, ingredients, instructions],
    (err) => {
      if (err) return res.status(500).json({ error: "Create failed" });
      res.json({ message: "Recipe created" });
    }
  );
};

exports.updateRecipe = (req, res) => {
  const { userId, title, ingredients, instructions } = req.body;

  recipeModel.updateRecipe(
    [title, ingredients, instructions, req.params.id, userId],
    (err, result) => {
      if (result.affectedRows === 0)
        return res.status(403).json({ error: "Not authorized" });

      res.json({ message: "Updated" });
    }
  );
};

exports.deleteRecipe = (req, res) => {
  const { userId } = req.body;

  recipeModel.deleteRecipe(
    [req.params.id, userId],
    (err, result) => {
      if (result.affectedRows === 0)
        return res.status(403).json({ error: "Not authorized" });

      res.json({ message: "Deleted" });
    }
  );
};