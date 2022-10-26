// this'll be the module we'll write the entire model.
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

// export const loadRecipe = async function (id) {
//   try {
//     const data = await getJSON(API_URL + id);
//     // const res = await fetch(API_URL + id);
//     // const data = await res.json();
//     state.recipe = (({ source_url, image_url, cooking_time, ...o }) => {
//       return {
//         ...o,
//         image: image_url,
//         sourceUrl: source_url,
//         cookingTime: cooking_time,
//       };
//     })(data.data.recipe);
//   } catch (error) {
//     // alert(error);
//     //temp error handling
//     // console.error(`${error} 💥`);
//     throw error;
//   }
// };

export const loadSearchResults = async function (query) {
  try {
    state.search.page = 1;
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.recipes.map(recipe => {
      return (({ image_url, ...o }) => {
        return { image: image_url, ...o };
      })(recipe);
    });
    console.log(state.search.results);
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  return state.search.results.slice(start, end);
};

// export const loadRecipe = async function (id) {
//   try {
//     const data = await getJSON(API_URL + id);
//     state.recipe = (({ image_url, source_url, cooking_time, ...o }) => {
//       return {
//         image: image_url,
//         sourceUrl: source_url,
//         cookingTime: cooking_time,
//         ...o,
//       };
//     })(data.data.recipe);
//   } catch (error) {
//     throw error;
//   }
// };

const createRecipeObject = data =>
  (({ source_url, image_url, cooking_time, ...o }) => ({
    sourceUrl: source_url,
    image: image_url,
    cookingTime: cooking_time,
    ...o,
  }))(data);

export const loadRecipe = async function (id) {
  try {
    const { data } = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // Updating the state
    state.recipe = createRecipeObject(data.recipe);

    const recipeFound = state.bookmarks.find(bookmark => bookmark.id === id);
    if (recipeFound) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

// MY CODE!!
// export const updateBookmarks = function (bookmarkID) {
//   if (state.recipe.id !== bookmarkID) return;
//   const recipeBookmarked = state.bookmarks.find(el => el.id === bookmarkID);

//   // remove bookmark if found in state.
//   if (recipeBookmarked) {
//     state.bookmarks = state.bookmarks.filter(el => el !== recipeBookmarked);
//     return;
//   }
//   // update bookmarks
//   state.bookmarks.push(state.recipe);
// };

export const updateServings = function (newServings) {
  // Reach in state (recipe ing) and change quantity in each ingredient.
  state.recipe.ingredients.forEach(ing => {
    return (ing.quantity =
      (ing.quantity * newServings) / state.recipe.servings);
    // new quantity = oldQuantity * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  updateStorage();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  state.recipe.bookmarked = false;
  updateStorage();
};

export const initStorage = function () {
  const storage = JSON.parse(localStorage.getItem('bookmarks'));
  if (!storage) return;
  state.bookmarks = storage;
};

export const updateStorage = () =>
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingArr = ingredient[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) {
          throw new Error('Wrong format used, please use correct format. :)');
        }
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
      // code below to conditionally add object properties.
      // ...(recipe.key && {key: recipe.key})
    };

    // get the data
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    // store into state
    state.recipe = createRecipeObject(data.data.recipe);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
