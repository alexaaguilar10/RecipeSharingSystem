const express = require("express");
const cors = require("cors");
//import files
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoriteRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});