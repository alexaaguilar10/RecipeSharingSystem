const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

router.post("/", favoriteController.addFavorite);
router.delete("/", favoriteController.removeFavorite);
router.get("/:userId", favoriteController.getFavorites);
router.get("/check/:userId/:recipeId", favoriteController.checkFavorite);

module.exports = router;