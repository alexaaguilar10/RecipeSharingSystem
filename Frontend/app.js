//  signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (res.ok) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", user.username);
      window.location.href = "homepage.html";
    } else {
      alert("Signup failed");
    }
  });
}

// login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value
    };

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const msg = document.getElementById("loginMessage");

    if (res.ok) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", result.username);
      window.location.href = "homepage.html";
    } else {
      msg.textContent = result.message;
      msg.classList.remove("d-none");
    }
  });
}

// homepage
document.addEventListener("DOMContentLoaded", () => {
  const authDiv = document.getElementById("authButtons");
  const welcomeMsg = document.getElementById("welcomeMessage");

  if (!authDiv || !welcomeMsg) return;

  const loggedIn = localStorage.getItem("loggedIn");
  const username = localStorage.getItem("username");

  if (loggedIn === "true" && username) {
    welcomeMsg.textContent = `Welcome, ${username}!`;

    authDiv.innerHTML = `
      <button class="btn btn-danger">Logout</button>
    `;

    authDiv.querySelector("button").addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });
  } else {
    authDiv.innerHTML = `
      <a href="login.html" class="btn btn-primary">Login</a>
      <a href="signup.html" class="btn btn-success">Sign Up</a>
    `;
  }
});
