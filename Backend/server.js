const express = require("express");
const cors = require("cors");
const eventBus = require("./eventBus");

require("./services/userService");
require("./services/recipeService");
require("./services/favoriteService");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/signup", (req, res) => {
  eventBus.emit("USER_SIGNUP_REQUESTED", {
    data: req.body,
    res
  });
});

app.post("/login", (req, res) => {
  eventBus.emit("USER_LOGIN_REQUESTED", {
    data: req.body,
    res
  });
});

app.post("/recipes", (req, res) => {
  eventBus.emit("RECIPE_CREATE_REQUESTED", {
    data: req.body,
    res
  });
});

app.put("/recipes/:id", (req, res) => {
  eventBus.emit("RECIPE_UPDATE_REQUESTED", {
    id: req.params.id,
    data: req.body,
    res
  });
});

// Fetch all recipes for homepage
app.get("/recipes", (req, res) => {
  // Forward the request to your EventBus
  eventBus.emit("RECIPES_FETCH_REQUESTED", { res });
});

app.delete("/recipes/:id", (req, res) => {
  eventBus.emit("RECIPE_DELETE_REQUESTED", {
    id: req.params.id,
    data: req.body,
    res
  });
});

app.post("/favorites", (req, res) => {
  eventBus.emit("FAVORITE_ADD_REQUESTED", {
    ...req.body,
    res
  });
});

app.delete("/favorites", (req, res) => {
  eventBus.emit("FAVORITE_REMOVE_REQUESTED", {
    ...req.body,
    res
  });
});

// Get all favorites for a user
// Get all favorite recipes for a user
app.get("/favorites/:userId", (req, res) => {
  eventBus.emit("FAVORITE_FETCH_REQUESTED", {
    userId: req.params.userId,
    res
  });
});

// Check if a recipe is favorited by a user
app.get("/favorites/check/:userId/:recipeId", (req, res) => {
  eventBus.emit("FAVORITE_CHECK_REQUESTED", {
    userId: req.params.userId,
    recipeId: req.params.recipeId,
    res
  });
});

// Event gateway for frontend
app.post("/events", (req, res) => {
  const { type, payload } = req.body;

  // Emit the event on the server EventBus
  eventBus.emit(type, {
    data: payload,
    res
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});