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
  //get the recipes from the backend
  const res = await fetch("http://localhost:3000/recipes");
  const recipes = await res.json();

  const list = document.getElementById("recipeList");
  list.innerHTML = "";

  recipes.forEach(r => {
    let buttons = "";
    //edit and delete btn will only show for the user that owns it
    if (r.user_id == localStorage.getItem("userId")) 
    {
      buttons = 
      ` <button class="btn btn-warning btn-sm" onclick="editRecipe(${r.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${r.id})">Delete</button>`;
    }
    //display the recipe card
    list.innerHTML += 
    ` <div class="card mb-3 p-3">
        <h4>${r.title}</h4>
        <p><strong>By:</strong> ${r.username}</p>
        <p><strong>Ingredients:</strong><br>${r.ingredients}</p>
        <p><strong>Instructions:</strong><br>${r.instructions}</p>
        ${buttons}
      </div>
    `;
  });
}
//creating a new recipe 
const recipeForm = document.getElementById("recipeForm");
if (recipeForm) 
{
  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recipe = 
    {
      userId: localStorage.getItem("userId"),
      title: document.getElementById("title").value,
      ingredients: document.getElementById("ingredients").value,
      instructions: document.getElementById("instructions").value
    };
    //send the recipe to backend
    fetch("http://localhost:3000/recipes", {
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

