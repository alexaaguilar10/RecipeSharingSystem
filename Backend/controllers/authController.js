const userModel = require("../models/userModel");

exports.signup = (req, res) => {
  const { username, email, password } = req.body;

  userModel.createUser(username, email, password, (err) => {
    if (err) return res.status(400).json({ message: "Email exists" });

    // get the newly created user
    userModel.findUserByEmail(email, (err2, results) => {
      if (err2 || results.length === 0)
        return res.status(500).json({ message: "Signup error" });

      const user = results[0];
      res.json({
        message: "Signup successful",
        username: user.username,
        userId: user.id
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.findUserByEmail(email, (err, results) => {
    if (results.length === 0)
      return res.status(404).json({ message: "Account not found" });

    const user = results[0];

    if (user.password !== password)
      return res.status(401).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      username: user.username,
      userId: user.id
    });
  });
};

