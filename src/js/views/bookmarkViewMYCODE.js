import View from './View';
import icons from 'url:../../img/icons.svg'; // parcel 2

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _btnParentElement = document.querySelector('.recipe');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerClick(handler) {
    this._btnParentElement.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.btn--round');
      if (!btn) return;
      handler();
      this._updateBookmarkIcon(btn.querySelector('use'));
    });
  }
  _updateBookmarkIcon(icon) {
    const curHref = icon.getAttribute('href');
    const newHref = curHref.includes('fill')
      ? curHref.slice(0, -5)
      : `${curHref}-fill`;

    icon.setAttribute('href', newHref);
  }
  _generateMarkup() {
    return this._data
      .map(
        el => `                  
    <li class="preview">
    <a class="preview__link" href="#${el.id}">
      <figure class="preview__fig">
        <img src="${el.image}" alt="${el.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">
          ${el.title}hg
        </h4>
        <p class="preview__publisher">${el.publisher}</p>
      </div>
    </a>
  </li>
`
      )
      .join('');
  }
}
export default new BookmarkView();
