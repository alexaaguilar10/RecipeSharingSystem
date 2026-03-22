const favoriteService = require("../services/favoriteService");
//add recipe to favorites
exports.addFavorite = (req, res) => {
  favoriteService.addFavorite(req.body, res);
};
//remove
exports.removeFavorite = (req, res) => {
  favoriteService.removeFavorite(req.body, res);
};
//users favorites
exports.getFavorites = (req, res) => {
  favoriteService.getFavorites(req.params.userId, res);
};
//check if the recipe was a favorite
exports.checkFavorite = (req, res) => {
  favoriteService.checkFavorite(req.params, res);
};