import { emitEvent } from "./events.js";

async function loadFavorites() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const res = await fetch(`http://localhost:3000/favorites/${userId}`);
  const favorites = await res.json();

  const list = document.getElementById("favoriteList");
  if (!list) return;
  list.innerHTML = "";

  favorites.forEach(r => {
    list.innerHTML += `
      <div class="col-md-4">
        <div class="card mb-3 p-3 h-100" id="fav-${r.id}">
          <h4>${r.title}</h4>
          <p><strong>Ingredients:</strong><br>${r.ingredients}</p>
          <p><strong>Instructions:</strong><br>${r.instructions}</p>
          <button class="btn btn-danger btn-sm"
            onclick="removeFavorite(${r.id})">
            Remove
          </button>
        </div>
      </div>
    `;
  });
}

window.removeFavorite = async function(recipeId) {
  const userId = localStorage.getItem("userId");

  await fetch("http://localhost:3000/favorites", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, recipeId })
  });

  loadFavorites(); // Refresh favorites list

  // Update homepage button if visible
  const btn = document.getElementById(`fav-${recipeId}`);
  if (btn) {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-outline-success");
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", loadFavorites);