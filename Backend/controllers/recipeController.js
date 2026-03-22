const recipeService = require("../services/recipeService");
//get recipes
exports.getRecipes = (req, res) => {
  recipeService.getRecipes(res);
};
//create new recipes
exports.createRecipe = (req, res) => {
  recipeService.createRecipe(req.body, res);
};
//allow updates
exports.updateRecipe = (req, res) => {
  recipeService.updateRecipe(req.params.id, req.body, res);
};
//delete the recipe
exports.deleteRecipe = (req, res) => {
  recipeService.deleteRecipe(req.params.id, req.body, res);
};