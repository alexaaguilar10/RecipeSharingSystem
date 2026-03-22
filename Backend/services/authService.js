const authRepo = require("../repositories/authRepository");
//do the signup
exports.signup = (data, res) => {
  authRepo.signup(data, res);
};
//do the login check
exports.login = (data, res) => {
  authRepo.login(data, res);
};