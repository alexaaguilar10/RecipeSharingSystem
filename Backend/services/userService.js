const eventBus = require("../eventBus");
const db = require("../db");

// Signup
eventBus.on("USER_SIGNUP_REQUESTED", ({ data, res }) => {
  const { username, email, password } = data;

  const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";

  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: "Email exists" });
    }

    res.json({
      userId: result.insertId,
      username
    });
  });
});

// Login
eventBus.on("USER_LOGIN_REQUESTED", ({ data, res }) => {
  const { email, password } = data;

  db.query("SELECT * FROM users WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ message: "Not found" });

    const user = results[0];

    if (user.password !== password)
      return res.status(401).json({ message: "Wrong password" });

    res.json({
      username: user.username,
      userId: user.id
    });
  });
});