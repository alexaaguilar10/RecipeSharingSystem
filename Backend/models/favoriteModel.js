const db = require("../config/db");

exports.addFavorite = (data, callback) => {
  db.query(
    "INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?)",
    data,
    callback
  );
};

exports.removeFavorite = (data, callback) => {
  db.query(
    "DELETE FROM favorites WHERE user_id=? AND recipe_id=?",
    data,
    callback
  );
};

exports.getFavorites = (userId, callback) => {
  const sql = `
    SELECT r.*, u.username
    FROM favorites f
    JOIN recipes r ON f.recipe_id = r.id
    JOIN users u ON r.user_id = u.id
    WHERE f.user_id = ?
  `;
  db.query(sql, [userId], callback);
};

exports.checkFavorite = (data, callback) => {
  db.query(
    "SELECT * FROM favorites WHERE user_id=? AND recipe_id=?",
    data,
    callback
  );
};