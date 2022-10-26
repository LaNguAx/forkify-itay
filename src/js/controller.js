// import icons from '../img/icons.svg'; // parcel 1
import 'core-js/stable';
import * as model from './model.js';
import { LISTENER_EVENTS } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import bookmarkViewMYCODE from './views/bookmarkViewMYCODE';

// if (module.hot) {
//   // not real JS. this is coming from parcel.
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// console.log('TEST, yaay, working!');
// console.log(model.state);
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarks
    bookmarksView.update(model.state.bookmarks);

    // 1) Loading recipe -- WOW AMAZING. it's async so it'll return a promise, so we need to await it.
    // It's really important that an async will return a promise that we then need to handle when we call that async function, if we want result or stop exec of other async func.
    await model.loadRecipe(id);
    //
    //
    // 2) Rendering Recipe
    recipeView.render(model.state.recipe);
    // console.log(recipeView);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // render something meanwhile the results didnt arrive
    resultsView.renderSpinner();

    // 2)
    // Fetch the data we want to fetch and store it in the state.
    await model.loadSearchResults(query);
    // 3) Render results
    // Render the results that are stored in the state.
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 4) Render initial pagination buttons
  paginationView.render(model.state.search);
};

/**
 * 
 * MY CODEEE FOR BOOKMARKS!!! 
const controlBookmarks = function () {
  const currentHash = window.location.hash.slice(1);

  // Update the state
  model.updateBookmarks(currentHash);

  // Render the bookmark
  bookmarkView.render(model.state.bookmarks);
};
*/

const controlAddBookmark = function () {
  // if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // else model.deleteBookmark(model.state.recipe.id);

  // 1) Add/remove bookmark
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
// keep calling it controllers because we use MVC pattern, they also could be used handler, they are simply event handler which'll run whenever some event happen.
// This controller will be executed when the user clicks on one of the servings button.
const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view.
  recipeView.update(model.state.recipe);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    // recipeView.renderSpinner();
    // show loading spinner and save previous html before clearing it.
    const prevHTML = addRecipeView.renderSpinner(true);

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // // Change the hash location
    // window.location.hash = model.state.recipe.id;
    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Render into bookmarks
    bookmarksView.render(model.state.bookmarks);

    setTimeout(() => {
      // Close form window
      addRecipeView.toggleWindow();
      setTimeout(() => addRecipeView.renderFormerHTML(prevHTML), 1000);
    }, MODAL_CLOSE_SEC * 1000);
    console.log(model.state.recipe);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError(error);
  }

  // try {
  // METHOD I CREATED TO TRANSFORM ARR TO OBJ, use fromEntries instead!!
  // const objFromArray = newRecipe.reduce(
  //   (acc, cur) => ({ ...acc, [cur[0]]: cur[1] }),
  //   {}
  // );
  //   model
  //     .uploadRecipe(newRecipe)
  //     .then(console.log(data))
  //     .catch(error => {
  //       throw error;
  //     });
  // } catch (error) {
  //   addRecipeView.renderError(error);
  // }
  // THIS CODE IS THE SAME AS ABOVE, IT'S JUST SO I CAN UNDERSTAND THE BEHAVIOR OF ASYNC BETTER. WE HAVE TO WAIT FOR THE .uploadRecipe because it happens async (at the same time). So we need to wait for it to finish and then continue on with our code.
  // model
  //   .uploadRecipe(newRecipe)
  //   .then(data => console.log(data))
  //   .catch(error => console.error('iaojsdioajdioja'));
};

const init = (() => {
  recipeView.addHandlerRender(controlRecipes, ...LISTENER_EVENTS);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  // recipeView.addHandlerRender()
  searchView.addHandlerSearch(controlSearchResults, 'submit');
  // resultsView.addHandlerResults(controlRecipes, 'click');

  paginationView.addHandlerClick(controlPagination);

  // bookmarkView.addHandlerClick(controlBookmarks);
  model.initStorage();
  bookmarksView.render(model.state.bookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();

// const searchField = document.querySelector('.search__field');
// const handleSearch = async function (ev) {
//   const userInput = searchField.value;
//   if (userInput.length <= 3) return;

//   const data = await getJSON('https://forkify-api.herokuapp.com/phrases.html');
//   console.log(data);
// };
// // e.g. url
// searchField.addEventListener('input', handleSearch);
// const obj = { a: 1, b: 2, c: 3, d: 4 };
// const clone = (({ b, c, ...o }) => o)(obj); // remove b and c
// console.log(clone); // returns -  obj {a: 1, d: 4}

// const loadPokemon = async () => {
//   const randomIds = new Set();
//   while (randomIds.size < 8) {
//     const randomNumber = Math.ceil(Math.random() * 150);
//     randomIds.add(randomNumber);
//   }
//   console.time('fast load');
//   const pokePromises = [...randomIds].map(id =>
//     fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
//   );
//   const result = await Promise.all(pokePromises);
//   const pokemon = Promise.all(result.map(res => res.json()));
//   console.timeEnd('fast load');
//   return pokemon;
// };

// const data = (() => {
//   const d = (async () => await loadPokemon())();
//   const r = 1;
//   return { d, r };
// })();

// console.log(data.d, data.r);

//
//
//
//
//
//

/** RENDERING THE RECIPE ::  */
// View code above 49
//
//
//
//
/** LISTENING FOR LOAD AND HASHCHANGE EVENTS ::  */
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
//
//
//
//
//
/** THE MVC ARCHITECTURE ::  */
/** Why worry about architecture ?
 * 1. The architecture will give our project the structure in which we can then write the code, just like a house software also needs structure. Structure means how we organized and divide our code into different modules functions and classes.
 *
 * 2. Maintainability, A project is never done! We need to be able to easily change it in the future and we'll need to maintain it.
 *
 * 3. Expandability, We also need to be able to easily add new features.
 *
 * The PERFECT architecture is one that allows for all these to harmonize.
 * In order to achieve that we can create our own architecture from scratch.
 * We can opt for a good architecture pattern, eg of that is Model view controller, MVP, Flux, etc. (this project)
 * -- Also we can use a framework like React, Angular, Vue, Svelte, etc.
 *
 * Components of Any Architecture ::
 *
 * Business Logic -
 * -- Code that solves the actual business problem.
 * -- Directly related to what the business does and what is needs
 * -- Example: sending messages, storing transactions, calculating taxes...
 * It's the logic that is really related to solve the problem that the busines set out to solve in the 1st place.
 *
 * State -
 * -- Essentially stores all the data about the application (data about app's front end)
 * -- Should be the single source of truth
 * -- UI should be kept in sync with the state (if some data changes in the state then the UI should change, same opposite)
 * -- State libraries exist.
 *
 * HTTP Library -
 * -- Responsible for making and receiving AJAX requests
 * -- Optional but almost always necessary in real-world apps.
 *
 * Application Logic (Router) -
 * -- Code that is only concerned about the implementation of applicaiton itself.
 * -- Handles navigation and UI events
 *
 * Presentation Logic (UI layer) -
 * -- Code that is concenrned about the visible part of the applicaiton
 * -- Essentially displays application state.
 *
 * Any good architecture has a way of seperating then instead of mixing them in 1 big file and 1 big mess. Lets look at a well established pattern:
 *
 * THE MODEL VIEW CONTROLLER (MVC) Architecture ::
 *
 * Model - Business Logic, State, HTTP Library
 * Controller - Application Logic (Bridge between model and views (which don't know about another).. It handles UI events and DISPATCHES tasks to MODEL and View.
 * View - Presentation Logic
 *
 */
//
//
//
//
//
/** HELPERS AND CONFIGURATION FILES ::  */
// Many real world apps have 2 special modules that are compleletly independnant of the rest of the architecture they are module for project config and a module for general helper functions that'll be useful for the entire project.

//
//
//
//
//

/** EVENT HANDLERS IN MVC: PUBLISHER-SUBSCRIBER PATTERN ::  */
// Lets analyze code for set up events
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipes)
// );

/**
 * INIT
 */
// const init = (() => {
//   recipeView.addHandlerRender(controlRecipes, ...LISTENER_EVENTS);

//   // recipeView.addHandlerRender()
//   searchView.addHandlerSearch(controlSearchResults, 'submit');
//   // resultsView.addHandlerResults(controlRecipes, 'click');
// })();

/** */

// Events should be listened for in the view but handled in the controller. We cant call controlRecipes from the view because the view doesn't know anything about the controller, so we cant call any of the functions that are in the controller in the view.

// The solution is Publisher-Subscriber design pattern. It's standard design pattern for a solution to generic problems.

// KEEPING THE HANDLER IN THE CONTROLLER AND THE LISTENER IN THE VIEW. The handler subscribes to the publisher which is the lsitener then when the event is called the subscriber is calling the handler.
//
//
//
//
//
/** IMPLEMENTING ERROR AND SUCCESS MESSAGES ::  */

//
//

//
//
//
//

/** IMPLEMENTING SEARCH FUNCTIONALITY ::  */

// class Person {
//   constructor(name, surname, age) {
//     this.name = name;
//     this.surname = surname;
//     this.age = age;
//   }
//   thisSitsOnPrototype() {
//     console.log(this.name, this.surname, this.age);
//   }
//   thisSitsOnTheObject = function () {
//     console.log(this.name, this.surname, this.age);
//   };
// }

// const itay = new Person('itay', 'aknin', '21');
// console.log(itay);
// itay.thisSitsOnPrototype();

/** WOWOOWOWW CONGRATULATIIONS U FINISHED IT!!
 *
 * Lecture: Wrapping up: Final Considerations
 *
 * Writing some documentation for us and other people.
 * Also some challenges and improvemenets that we can implement.
 * There's a standard way for js docs, it's called jsDocs, view the code in View.js
 *
 * Improvements & Features:
 * SIMPLE:
 * Display number of pages between the pagination buttons
 * Ability to SORT search results by duration or number of ingredients
 * Improve recipe ingredient input: seperate in multiple fields and allow more than 6 ingredients.
 *
 * HARDER:
 * Shopping List feature: button on recipe to add ingredients to a list
 *
 * Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calender and save to local-storage
 *
 * Get nutrition data on each ingredient from spoonacular API and calculate total calories of recipe
 */

//
//
//
//
//
//
/** SECTION 8: Deploy to git and netlify. */

/** Simple deployment to netlify.
 *
 * We need to build the final version of this project using the build command
 * WE NEED TO DELETE PARCEL CACHE AND DIST FOLDERS BEFORE WE DO BUILD COMMAND!
 *ALSO SET "main" inside package-json to "default"!
 *
 * AFTER RUNNING THE BUILD, it'll be the final code in DIST folder that is ready to upload.
 * Netlify allows us to upload static projects, just html css & js. No database or back-end. Only front-end applications allowed.
 */

/** GIT FUNDAMENTALS ::  */
/**
 * In each repo we need a .gitignore file!
 *
 *  //MODIFIED
 *
 */
