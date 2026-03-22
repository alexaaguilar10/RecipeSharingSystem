const authService = require("../services/authService");
exports.signup = (req, res) => {
  authService.signup(req.body, res);
};
//handle user signup req
exports.login = (req, res) => {
  authService.login(req.body, res);
};