import { emitEvent } from "./events.js";
import { loadRecipes } from "./recipes.js";

// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      username: username.value,
      email: email.value,
      password: password.value
    };

    const res = await emitEvent("USER_SIGNUP_REQUESTED", user);

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      window.location.href = "homepage.html";
    }
  });
}if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      username: username.value,
      email: email.value,
      password: password.value
    };

    const res = await emitEvent("USER_SIGNUP_REQUESTED", user);

    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      window.location.href = "homepage.html";
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: loginEmail.value,
      password: loginPassword.value
    };

    const res = await emitEvent("USER_LOGIN_REQUESTED", data);

    if (res.ok) {
      const result = await res.json();

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", result.username);
      localStorage.setItem("userId", result.userId);

      window.location.href = "homepage.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const authDiv = document.getElementById("authButtons");
  const welcomeMsg = document.getElementById("welcomeMessage");

  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const username = localStorage.getItem("username");

  if (loggedIn && username) {
    welcomeMsg.textContent = `Welcome, ${username}!`;
    authDiv.innerHTML = `
      <a href="/favorites.html" class="btn btn-success me-2">My Favorites</a>
      <button id="logoutBtn" class="btn btn-danger">Logout</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });
  } else {
    welcomeMsg.textContent = "";
    authDiv.innerHTML = `
      <a href="/login.html" class="btn btn-primary me-2">Login</a>
      <a href="/signup.html" class="btn btn-secondary">Sign Up</a>
    `;
  }

  loadRecipes();
});