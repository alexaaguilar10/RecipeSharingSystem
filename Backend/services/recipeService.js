const recipeRepo = require("../repositories/recipeRepository");
//get recipes
exports.getRecipes = (res) => {
  recipeRepo.getRecipes(res);
};
//can only create recipe if signed in
exports.createRecipe = (data, res) => {
  if (!data.userId) {
    return res.status(401).json({ message: "Login required" });
  }
  recipeRepo.createRecipe(data, res);
};
//update the recipe
exports.updateRecipe = (id, data, res) => {
  recipeRepo.updateRecipe(id, data, res);
};
//delete a recipe
exports.deleteRecipe = (id, data, res) => {
  recipeRepo.deleteRecipe(id, data, res);
};