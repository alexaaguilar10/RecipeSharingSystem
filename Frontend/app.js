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
      localStorage.setItem("userId", result.userId);
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
      <a href="favorites.html" class="btn btn-success me-2">
      My Favorites
      </a>
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

//load recipes
async function loadRecipes() {
  const res = await fetch("http://localhost:3000/recipes");
  const recipes = await res.json();

  const userId = localStorage.getItem("userId");

  // get all favorites for this user
  let favoriteIds = new Set();
  if (userId) {
    const favRes = await fetch(`http://localhost:3000/favorites/${userId}`);
    const favs = await favRes.json();
    favs.forEach(f => favoriteIds.add(f.id));
  }

  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  recipes.forEach(r => {
    let buttons = "";
    if (r.user_id == userId) {
      buttons = `
        <button class="btn btn-warning btn-sm" onclick="editRecipe(${r.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${r.id})">Delete</button>
      `;
    }

    // check if this recipe is favorited
    const isFav = favoriteIds.has(r.id);
    const favClass = isFav ? "btn-btn-success" : "btn-outline-success";

    list.innerHTML += `
      <div class="card mb-3 p-3">
        <h4>${r.title}</h4>
        <p><strong>By:</strong> ${r.username}</p>
        <p><strong>Ingredients:</strong><br>${r.ingredients}</p>
        <p><strong>Instructions:</strong><br>${r.instructions}</p>
        ${buttons}
        <button 
          id="fav-${r.id}"
          class="btn ${favClass} btn-sm"
          onclick="toggleFavorite(${r.id})">
          Favorite!
        </button>
      </div>
    `;
  });
}

//creating a new recipe 
const recipeForm = document.getElementById("recipeForm");
if (recipeForm) {
  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    // GUEST CHECK
    if (!userId) {
      alert("Please log in or sign up to add a recipe.");
      return;
    }

    const recipe = {
      userId,
      title: document.getElementById("title").value,
      ingredients: document.getElementById("ingredients").value,
      instructions: document.getElementById("instructions").value
    };

    await fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe)
    });

    recipeForm.reset();
    loadRecipes();
  });
}

//delete recipe
async function deleteRecipe(id) {
  await fetch(`http://localhost:3000/recipes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: localStorage.getItem("userId")
    })
  });

  loadRecipes();
}

//edit recipe
async function editRecipe(id) {
  const title = prompt("New title:");
  const ingredients = prompt("New ingredients:");
  const instructions = prompt("New instructions:");

  await fetch(`http://localhost:3000/recipes/${id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: localStorage.getItem("userId"),
    title,
    ingredients,
    instructions
  })
});

  loadRecipes();
}
//recipes show on main page if logged out
document.addEventListener("DOMContentLoaded", loadRecipes);


// add favorite function:
async function toggleFavorite(recipeId) {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    alert("You must be logged in to favorite recipes.");
    return;
  }

  // Check if already favorited
  const checkRes = await fetch(
    `http://localhost:3000/favorites/check/${userId}/${recipeId}`
  );
  const checkData = await checkRes.json();

  const btn = document.getElementById(`fav-${recipeId}`);

  if (checkData.favorited) {
    // REMOVE favorite
    await fetch("http://localhost:3000/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId })
    });

    // turn gray
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline-success");
  } else {
    // ADD favorite
    await fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId })
    });

    // turn red
    btn.classList.remove("btn-outline-success");
    btn.classList.add("btn-success");
  }
}

