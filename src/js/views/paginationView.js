import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel 2
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();

      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }

    // Last Page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }
    // Other Page
    if (currentPage < numPages) {
      return `${this._generateMarkupButton(
        'prev'
      )} ${this._generateMarkupButton('next')}`;
    }
    // Page 1 and there are NO other pages
    return '';
  }
  _generateMarkupButton(state) {
    return `      
    <button data-goto="${
      state === 'prev' ? this._data.page - 1 : this._data.page + 1
    }" class="btn--inline pagination__btn--${state}">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-${
      state === 'prev' ? 'left' : 'right'
    }"></use>
    </svg>
    <span>Page ${
      state === 'prev' ? this._data.page - 1 : this._data.page + 1
    }</span>
  </button>
`;
  }
}

export default new PaginationView();
