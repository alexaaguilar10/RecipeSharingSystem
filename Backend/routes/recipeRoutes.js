const express = require("express");
const router = express.Router();
const recipe = require("../controllers/recipeController");

router.get("/", recipe.getRecipes);
router.post("/", recipe.createRecipe);
router.put("/:id", recipe.updateRecipe);
router.delete("/:id", recipe.deleteRecipe);

module.exports = router;