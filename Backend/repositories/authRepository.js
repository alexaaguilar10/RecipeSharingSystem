const db = require("../db/db");
//add user to database
exports.signup = ({ username, email, password }, res) => {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err) => {
    if (err) return res.status(400).json({ message: "Email exists" });
    res.json({ message: "Signup successful" });
  });
};
//user login
exports.login = ({ email, password }, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (results.length === 0)
      return res.status(404).json({ message: "Account not found" });

    const user = results[0];
    //check the password
    if (user.password !== password)
      return res.status(401).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      username: user.username,
      userId: user.id,
    });
  });
};