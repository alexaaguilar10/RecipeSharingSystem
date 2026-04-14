const userApiBase = "/api/users";
const recipeApiBase = "/api/recipes";
const favoritesApiBase = "/api/favorites";

function goBackOrHome() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = "/";
}

function getStoredUser() {
  return {
    loggedIn: localStorage.getItem("loggedIn") === "true",
    username: localStorage.getItem("username"),
    userId: localStorage.getItem("userId")
  };
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

async function handleSignup(event) {
  event.preventDefault();

  const signupMessage = document.getElementById("signupMessage");
  const payload = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const response = await fetch(`${userApiBase}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (response.ok) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", payload.username);
    localStorage.setItem("userId", String(result.userId));
    window.location.href = "recipes.html";
    return;
  }

  signupMessage.textContent = result.message || "Signup failed.";
  signupMessage.classList.remove("d-none");
}

async function handleLogin(event) {
  event.preventDefault();

  const loginMessage = document.getElementById("loginMessage");
  const payload = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const response = await fetch(`${userApiBase}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (response.ok) {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", result.username);
    localStorage.setItem("userId", String(result.userId));
    window.location.href = "recipes.html";
    return;
  }

  loginMessage.textContent = result.message || "Login failed.";
  loginMessage.classList.remove("d-none");
}

function renderHomepageState() {
  const homepageActions = document.getElementById("homepageActions");
  const homepageMessage = document.getElementById("homepageMessage");

  if (!homepageActions || !homepageMessage) {
    return;
  }

  const user = getStoredUser();

  if (!user.loggedIn) {
    homepageMessage.textContent = "The gateway is live on port 3000 and routing auth traffic to the user-service.";
    return;
  }

  homepageMessage.innerHTML = `Signed in as ${user.username}. <a href="recipes.html">Go to the recipes page</a> or <a href="#" id="homepageLogoutLink">logout</a>.`;
  document.getElementById("homepageLogoutLink")?.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });
}


async function loadRecipeTemplates() {
  const recipeList = document.getElementById("recipeList");
  const recipeServiceStatus = document.getElementById("recipeServiceStatus");
  const recipesWelcome = document.getElementById("recipesWelcome");
  const toggleButton = document.getElementById("toggleRecipeFormButton");
  const formPanel = document.getElementById("recipeFormPanel");
  const recipeForm = document.getElementById("recipeForm");
  const recipeFormMessage = document.getElementById("recipeFormMessage");
  const logoutButton = document.getElementById("logoutButton");

  if (!recipeList) {
    return;
  }

  const user = getStoredUser();
  if (!user.loggedIn) {
    window.location.href = "login.html";
    return;
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  if (recipesWelcome) {
    recipesWelcome.textContent = `Welcome, ${user.username}.`;
  }

  if (toggleButton && formPanel) {
    toggleButton.addEventListener("click", () => {
      formPanel.classList.toggle("d-none");
    });
  }

  if (recipeForm) {
    recipeForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      recipeFormMessage.textContent =
        "Recipe creation template";
    });
  }

  recipeList.innerHTML = [
    renderTemplateCard(
      "recipe later implementation"
    )
  ].join("");
}

async function loadFavoritesTemplates() {
  const favoriteList = document.getElementById("favoriteList");
  const favoritesServiceStatus = document.getElementById("favoritesServiceStatus");

  if (!favoriteList) {
    return;
  }

  const user = getStoredUser();
  if (!user.loggedIn) {
    window.location.href = "login.html";
    return;
  }


  favoriteList.innerHTML = [
    renderTemplateCard(
      "template for favorites coming soon"
    ),
  ].join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm")?.addEventListener("submit", handleSignup);
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);

  renderHomepageState();
  loadRecipeTemplates();
  loadFavoritesTemplates();
});
