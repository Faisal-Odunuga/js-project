import icons from "url:../img/icons.svg";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { API_URL } from "./config";
const recipeContainer = document.querySelector(".recipe");
const searchField = document.querySelector(".search__field");
const searchBtn = document.querySelector(".search__btn");
const searchResult = document.querySelector(".results");

const renderSpinner = function (parentEl) {
  const html = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", html);
};

const showRecipe = async function () {
  const id = window.location.hash.slice(1);
  if (!id) return;
  try {
    // Loading Recipe
    renderSpinner(recipeContainer);
    const res = await fetch(`${API_URL}/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      image: recipe.image_url,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(recipe);

    // Rendering Recipe
    const markup = `
       <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              recipe.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--decrease-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients
              .map((ing) => {
                return `
                <li class="recipe__ingredient">
                  <svg class="recipe__icon">
                    <use href="${icons}#icon-check"></use>
                  </svg>
                  <div class="recipe__quantity">${ing.quantity}</div>
                  <div class="recipe__description">
                    <span class="recipe__unit">${ing.unit}</span>
                    ${ing.description}
                  </div>
                </li>`;
              })
              .join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              recipe.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
    `;
    recipeContainer.innerHTML = "";
    recipeContainer.insertAdjacentHTML("afterbegin", markup);
    return recipe;
  } catch (err) {
    console.error(err.message);
  }
};
showRecipe();

["hashchange", "load"].forEach((e) => {
  window.addEventListener(e, showRecipe);
});

const loadSearchResult = async function () {
  const searchQuery = searchField.value;
  if (!searchQuery) return;
  try {
    renderSpinner(searchResult);
    const res = await fetch(`${API_URL}?search=${searchQuery}`);
    const data = await res.json();
    const { recipes } = data.data;
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(data);

    const markups = recipes.map((recipe) => {
      return `
        <li class="preview">
          <a class="preview__link preview__link--active" href="#${recipe.id}">
            <figure class="preview__fig">
              <img src="${recipe.image_url}" alt="Test" /> 
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
              <div class="preview__user-generated">
                <svg>
                  <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>
      `;
    });
    const html = markups.join();
    searchResult.innerHTML = "";
    searchResult.insertAdjacentHTML("afterbegin", html);
  } catch (err) {
    console.log(err);
  }
};

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  loadSearchResult();
});

///////////////////////////////////////
// https://forkify-api.herokuapp.com/v2
