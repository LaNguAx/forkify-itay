import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel 2
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _windowElement = document.querySelector('.add-recipe-window');
  _overlayElement = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // this calls the code inside here automatically as soon as an object is created from this class, which is instant because we export an instance of the class at the bottom of the code.
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _addHandlerShowWindow() {
    // exporting the function to another one because of the change of the this keyword inside a handler function, basically if we didnt do that the 'this' keyword would refer to the btn instead of the AddRecipeView object.
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  toggleWindow() {
    this._overlayElement.classList.toggle('hidden');
    this._windowElement.classList.toggle('hidden');
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlayElement.addEventListener(
      'click',
      this.toggleWindow.bind(this)
    );
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // We can read all the data from those input elements but we can use something new called formData.
      // We have to pass an element which is a form
      // The 'this' keyword here is a the form._parentElement because we are inside a handler function.
      e.preventDefault();
      // raw array data
      const data = [...new FormData(this)];
      const dataObj = Object.fromEntries(data);
      handler(dataObj);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
