// recipes.js

import { emitEvent } from "./events.js";

const list = document.getElementById("recipeList");
const userId = localStorage.getItem("userId");

// --- LOAD RECIPES ---
export async function loadRecipes() {
  const userId = localStorage.getItem("userId");
  if (!userId) return; // user not logged in, do nothing
  
  if (!list) return;

  // Fetch recipes from backend (fresh each time)
  const res = await fetch(`http://localhost:3000/recipes?timestamp=${Date.now()}`);
  const recipes = await res.json();

  // Fetch all favorites for logged-in user
  let favoriteIds = new Set();
  if (userId) {
    const favRes = await fetch(`http://localhost:3000/favorites/${userId}?ts=${Date.now()}`);
    const favs = await favRes.json();
    favs.forEach(f => favoriteIds.add(f.id));
  }

  list.innerHTML = "";

  recipes.forEach(r => {
    // Buttons for recipe owner
    let buttons = "";
    if (r.user_id == userId) {
      buttons = `
        <button class="btn btn-warning btn-sm" onclick="editRecipe(${r.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${r.id})">Delete</button>
      `;
    }

    // Favorite button
    const isFav = favoriteIds.has(r.id);
    const favClass = isFav ? "btn-success" : "btn-outline-success";

    // Card HTML
    list.innerHTML += `
      <div class="card mb-3 p-3" id="recipe-${r.id}">
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

// --- DELETE RECIPE ---
window.deleteRecipe = async function(id) {
  const userId = localStorage.getItem("userId");
  if (!userId) return alert("You must be logged in.");

  const res = await fetch(`http://localhost:3000/recipes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });

  if (res.ok) {
    const card = document.getElementById(`recipe-${id}`);
    if (card) card.remove();
  } else {
    alert("Failed to delete recipe.");
  }
};

// --- EDIT RECIPE ---
window.editRecipe = async function(id) {
  const title = prompt("New title:");
  const ingredients = prompt("New ingredients:");
  const instructions = prompt("New instructions:");

  if (!title || !ingredients || !instructions) return;

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

  // update only this card in the DOM
  const card = document.getElementById(`recipe-${id}`);
  if (card) {
    card.querySelector("h4").textContent = title;
    const ps = card.querySelectorAll("p");
    ps[1].innerHTML = `<strong>Ingredients:</strong><br>${ingredients}`;
    ps[2].innerHTML = `<strong>Instructions:</strong><br>${instructions}`;
  }
};

// --- TOGGLE FAVORITE ---
// At the bottom of the file
window.toggleFavorite = async function(recipeId) {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("You must be logged in to favorite recipes.");
    return;
  }

  const btn = document.getElementById(`fav-${recipeId}`);

  // Use the FAVORITE_CHECK_REQUESTED endpoint
  const checkRes = await fetch(
    `http://localhost:3000/favorites/check/${userId}/${recipeId}`
  );
  const checkData = await checkRes.json();

  if (checkData.favorited) {
    // Remove favorite
    await fetch("http://localhost:3000/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId })
    });
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline-success");
  } else {
    // Add favorite
    await fetch("http://localhost:3000/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, recipeId })
    });
    btn.classList.remove("btn-outline-success");
    btn.classList.add("btn-success");
  }
};

// --- CREATE RECIPE ---
const recipeForm = document.getElementById("recipeForm");
if (recipeForm) {
  const list = document.getElementById("recipeList"); // container for recipe cards

  recipeForm.addEventListener("submit", async e => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please log in to add a recipe.");

    const recipe = {
      userId,
      title: document.getElementById("title").value,
      ingredients: document.getElementById("ingredients").value,
      instructions: document.getElementById("instructions").value
    };

    const res = await fetch("http://localhost:3000/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(recipe)
    });

    if (res.ok) {
      const data = await res.json();
      recipeForm.reset();

      // Add new recipe card directly
      const r = data.recipe;
      const cardHtml = `
        <div class="card mb-3 p-3" id="recipe-${r.id}">
          <h4>${r.title}</h4>
          <p><strong>By:</strong> You</p>
          <p><strong>Ingredients:</strong><br>${r.ingredients}</p>
          <p><strong>Instructions:</strong><br>${r.instructions}</p>
          <button class="btn btn-warning btn-sm" onclick="editRecipe(${r.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${r.id})">Delete</button>
          <button id="fav-${r.id}" class="btn btn-outline-success btn-sm" onclick="toggleFavorite(${r.id})">
            Favorite!
          </button>
        </div>
      `;
      if (list) list.insertAdjacentHTML("afterbegin", cardHtml);
    } else {
      alert("Failed to create recipe.");
    }
  });
}

// --- INITIAL LOAD ---
document.addEventListener("DOMContentLoaded", loadRecipes);