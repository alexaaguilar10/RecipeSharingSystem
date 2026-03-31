const express = require("express");
const router = express.Router();
const fav = require("../controllers/favoriteController");

router.post("/", fav.addFavorite);
router.delete("/", fav.removeFavorite);
router.get("/:userId", fav.getFavorites);
router.get("/check/:userId/:recipeId", fav.checkFavorite);

module.exports = router;