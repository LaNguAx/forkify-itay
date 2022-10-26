import icons from 'url:../../img/icons.svg';

import View from './View.js';
import previewView from './previewView.js';
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';
  _generateMarkup() {
    const markup = this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');

    return markup;
  }
}

export default new BookmarksView();
