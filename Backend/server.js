const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("Frontend"));

app.use("/", authRoutes);
app.use("/recipes", recipeRoutes);
app.use("/favorites", favoriteRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

 