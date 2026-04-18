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

//create a recipe for secure
function createRecipeCard(recipe, currentUserId) {
  const canManage = String(recipe.user_id) === String(currentUserId);

  const article = document.createElement("article");
  article.className = "recipe-card";

  const header = document.createElement("div");
  header.className = "d-flex justify-content-between align-items-start gap-3 mb-3";

  const titleWrap = document.createElement("div");

  const title = document.createElement("h3");
  title.className = "h5 mb-1";
  title.textContent = recipe.title;

  const meta = document.createElement("p");
  meta.className = "text-muted mb-0";
  meta.textContent = `Recipe #${recipe.id}`;
  titleWrap.append(title, meta);
  header.appendChild(titleWrap);

  if (canManage) 
  {
    const actions = document.createElement("div");
    actions.className = "d-flex gap-2";

    const editButton = document.createElement("button");
    editButton.className = "btn btn-outline-warning btn-sm";
    editButton.dataset.action = "edit";
    editButton.dataset.id = recipe.id;
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-danger btn-sm";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = recipe.id;
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    header.appendChild(actions);
  }

  const ingredientsSection = document.createElement("div");
  ingredientsSection.className = "mb-3";

  const ingredientsLabel = document.createElement("p");
  ingredientsLabel.className = "fw-semibold mb-1";
  ingredientsLabel.textContent = "Ingredients";
  const ingredientsText = document.createElement("p");
  ingredientsText.className = "mb-0 preserve-linebreaks";
  ingredientsText.textContent = recipe.ingredients;

  ingredientsSection.append(ingredientsLabel, ingredientsText);

  const instructionsSection = document.createElement("div");

  const instructionsLabel = document.createElement("p");
  instructionsLabel.className = "fw-semibold mb-1";
  instructionsLabel.textContent = "Instructions";
  const instructionsText = document.createElement("p");
  instructionsText.className = "mb-0 preserve-linebreaks";
  instructionsText.textContent = recipe.instructions;

  instructionsSection.append(instructionsLabel, instructionsText);

  article.append(header, ingredientsSection, instructionsSection);
  return article;
}


async function handleSignup(event) 
{
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

  if (!homepageActions) {
    return;
  }

  const user = getStoredUser();

  if (!user.loggedIn) {
    if (homepageMessage) {
      homepageMessage.textContent =
        "Sign up or log in to start sharing recipes through the microservices system.";
    }
    return;
  }

  homepageActions.innerHTML = 
  `
    <a href="recipes.html" class="btn btn-primary btn-lg px-4">Recipes Page</a>
    <button class="btn btn-outline-danger btn-lg px-4" id="homepageLogoutButton">Logout</button>
  `;

  if (homepageMessage) {
    homepageMessage.textContent = `Signed in as ${user.username}.`;
  }

  document.getElementById("homepageLogoutButton")?.addEventListener("click", logout);
}

//edit or delete can be done after recipe posted
function bindRecipeCardActions(currentUserId) {
  document.querySelectorAll("[data-action='delete']").forEach((button) => {
    button.addEventListener("click", async () => {
      const recipeId = button.dataset.id;

      const response = await fetch(`${recipeApiBase}/${recipeId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.error || result.message || "Unable to delete recipe.");
        return;
      }

      loadRecipesPage();
    });
  });

  document.querySelectorAll("[data-action='edit']").forEach((button) => {
    button.addEventListener("click", async () => {
      const recipeId = button.dataset.id;
      const recipeCard = button.closest(".recipe-card");
      const textBlocks = recipeCard.querySelectorAll(".preserve-linebreaks");

      const title = prompt(
        "Update recipe title:",
        recipeCard.querySelector("h3")?.textContent || ""
      );
      if (title === null)
      {
        return;
      }

      const ingredients = prompt(
        "Update ingredients:",
        textBlocks[0]?.textContent || ""
      );
      if (ingredients === null) 
      {
        return;
      }

      const instructions = prompt(
        "Update instructions:",
        textBlocks[1]?.textContent || ""
      );
      if (instructions === null)
      {
        return;
      }

      const response = await fetch(`${recipeApiBase}/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          title: title.trim(),
          ingredients: ingredients.trim(),
          instructions: instructions.trim()
        })
      });

      const result = await response.json();
      if (!response.ok) 
      {
        alert(result.error || result.message || "Unable to update recipe.");
        return;
      }

      loadRecipesPage();
    });
  });
}


// get and show recipes
async function loadRecipesPage() 
{
  const recipeList = document.getElementById("recipeList");
  const recipesWelcome = document.getElementById("recipesWelcome");
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

  if (recipesWelcome) 
  {
    recipesWelcome.textContent = `Welcome, ${user.username}.`;
  }

  try {
    const response = await fetch(recipeApiBase);
    const recipes = await response.json();

    if (!response.ok) 
    {
      throw new Error(recipes.error || recipes.message || "Unable to load recipes.");
    }

    if (!Array.isArray(recipes) || recipes.length === 0) 
    {
      recipeList.innerHTML = `
        <article class="recipe-card">
          <p class="mb-0">No recipes have been posted yet. Use the Create Recipe page to add the first one.</p>
        </article>
      `;
      return;
    }

    recipeList.innerHTML = "";
    const fragment = document.createDocumentFragment();

    recipes.forEach((recipe) => {
      fragment.appendChild(createRecipeCard(recipe, user.userId));
    });

    recipeList.appendChild(fragment);
    bindRecipeCardActions(user.userId);
  } catch (error) {
    recipeList.innerHTML = `
      <article class="recipe-card">
        <p class="mb-0 text-danger">${error.message}</p>
      </article>
    `;
  }
}

//send recipe info to gateway
function setupRecipeForm() {
  const recipeForm = document.getElementById("recipeForm");
  const recipeFormMessage = document.getElementById("recipeFormMessage");

  if (!recipeForm) 
  {
    return;
  }

  const user = getStoredUser();
  if (!user.loggedIn || !user.userId) 
  {
    window.location.href = "login.html";
    return;
  }

  recipeForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      userId: user.userId,
      title: document.getElementById("title").value.trim(),
      ingredients: document.getElementById("ingredients").value.trim(),
      instructions: document.getElementById("instructions").value.trim()
    };

    const response = await fetch(recipeApiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) 
    {
      recipeFormMessage.textContent = result.error || result.message || "Unable to create recipe.";
      recipeFormMessage.className = "small text-danger mt-3";
      return;
    }

    recipeForm.reset();
    recipeFormMessage.textContent =
      "Recipe posted successfully. Redirecting to the recipes page...";
    recipeFormMessage.className = "small text-success mt-3";

    window.setTimeout(() => {
      window.location.href = "recipes.html";
    }, 700);
  });
}

async function loadFavoritesTemplates() {
  const favoriteList = document.getElementById("favoriteList");

  if (!favoriteList) {
    return;
  }

  const user = getStoredUser();
  if (!user.loggedIn) {
    window.location.href = "login.html";
    return;
  }

  favoriteList.innerHTML = `
    <article class="recipe-card">
      <p class="mb-0">Favorites service is still a template, so this page will work after that service is implemented.</p>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm")?.addEventListener("submit", handleSignup);
  document.getElementById("loginForm")?.addEventListener("submit", handleLogin);

  renderHomepageState();
  loadRecipesPage();
  setupRecipeForm();
  loadFavoritesTemplates();
});
