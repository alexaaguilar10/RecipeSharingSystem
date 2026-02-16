const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use(cors());
app.use(express.json());

// SIGN UP
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  const sql =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], (err) => {
    if (err) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    res.json({ message: "Signup successful" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (results.length === 0) {
      return res.status(404).json({
        message: "Account not found. Please sign up."
      });
    }

    const user = results[0];

    if (user.password !== password) {
      return res.status(401).json({
        message: "Incorrect password."
      });
    }

    res.json({
      message: "Login successful",
      username: user.username,
      userId:user.id
    });
  });
});
// RECIPE
//query to join the recipes and user table
app.get("/recipes", (req, res) => {
  const sql = 
  ` SELECT r.*, u.username 
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC`
    ;
  //execute the query
  //check if there is an error in database
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    //send the recupe results to json
    res.json(results);
  });
});
//Create POST to add a new recipe
app.post("/recipes", (req, res) => {
  const { userId, title, ingredients, instructions } = req.body;
  if (!userId) 
  {
    return res.status(401).json({ 
    message: "You must be logged in to add recipes"  });
  }
  const sql = 
  ` INSERT INTO recipes (user_id, title, ingredients, instructions)
    VALUES (?, ?, ?, ?)`;

  db.query(sql, [userId, title, ingredients, instructions], (err) => {
    //check if there is an error that occurs
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create recipe" });
    }
    res.json({ message: "Recipe created" });
  });
})
//Update recipe by the ID
app.put("/recipes/:id", (req, res) => {
  //withdraw id and update info
  const { userId, title, ingredients, instructions } = req.body;
  //query to update the recipe but only if its from that user 
  const sql = 
  ` UPDATE recipes
    SET title=?, ingredients=?, instructions=?
    WHERE id=? AND user_id=?`;
  //execut querty and update 
  db.query(
    sql,
    [title, ingredients, instructions, req.params.id, userId],
    (err, result) => {
      //check if there is an error
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update recipe" });
      }

      if (result.affectedRows === 0) {
        return res.status(403).json({ error: "Not authorized" });
      }
      res.json({ message: "Recipe updated" });
    }
  );
});
//Delete recipe
//remove feature connected to the ID
app.delete("/recipes/:id", (req, res) => {
  const { userId } = req.body;

  const sql = 
  ` DELETE FROM recipes
    WHERE id = ? AND user_id = ?`;
  //check if there is an error
  db.query(sql, [req.params.id, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete recipe" });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "Not authorized" });
    }
    res.json({ message: "Recipe deleted" });
  });
});

// add favorited recipe
app.post("/favorites", (req, res) => {
  const { userId, recipeId } = req.body;

  const sql =
    "INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)";

  db.query(sql, [userId, recipeId], (err) => {
    if (err) {
      return res.status(400).json({ message: "Already favorited" });
    }
    res.json({ message: "Recipe favorited" });
  });
});


// remove favorite recipe:
app.delete("/favorites", (req, res) => {
  const { userId, recipeId } = req.body;

  const sql =
    "DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?";

  db.query(sql, [userId, recipeId], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error removing favorite" });
    }
    res.json({ message: "Favorite removed" });
  });
});

// alll of the favorited recipes from users
app.get("/favorites/:userId", (req, res) => {
  const sql = `
    SELECT r.*, u.username
    FROM favorites f
    JOIN recipes r ON f.recipe_id = r.id
    JOIN users u ON r.user_id = u.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;

  db.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

app.get("/favorites/check/:userId/:recipeId", (req, res) => {
  const { userId, recipeId } = req.params;

  const sql =
    "SELECT * FROM favorites WHERE user_id = ? AND recipe_id = ?";

  db.query(sql, [userId, recipeId], (err, results) => {
    if (results.length > 0) {
      res.json({ favorited: true });
    } else {
      res.json({ favorited: false });
    }
  });
});



const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


 