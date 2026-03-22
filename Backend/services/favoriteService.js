const favRepo = require("../repositories/favoriteRepository");
//add fav
exports.addFavorite = (data, res) => {
  favRepo.addFavorite(data, res);
};
//remove the favorite
exports.removeFavorite = (data, res) => {
  favRepo.removeFavorite(data, res);
};
//get favorites
exports.getFavorites = (userId, res) => {
  favRepo.getFavorites(userId, res);
};
//check favorites move tor repo
exports.checkFavorite = (params, res) => {
  favRepo.checkFavorite(params, res);
};