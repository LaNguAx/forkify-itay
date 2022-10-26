// Parent class, combining OOP.
// Exporting the class itself because we are not going to create instances of it, we are simply going to use it's prototype chain, which is basically how a class works.
import icons from 'url:../../img/icons.svg'; // parcel 2
export default class View {
  _data;

  // To write documentation we do code below
  /**
   * Render the received object to the DOM.
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false, create markup string instead of rendering to the DOM.
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Itay aknin
   * @todo Finish implmentation
   */
  // When we hover over 'render' we get the js docs we entered for it.
  render(data, render = true) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // update everything except the DOM elements
  update(data) {
    if (!data || (Array.isArray(data) && !data.length)) return;
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert the markup string to a DOM object that's living on the memory which we can compare to the current DOM object that's on the page.
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // console.log(newDOM);
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    const newElements = Array.from(newDOM.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      // const curEl = curElements[i];
      // // Method to compare nodes, 'isEqualNode'
      // // update changed TEXT
      // if (
      //   !newEl.isEqualNode(curEl) &&
      //   newEl.firstChild?.nodeValue.trim() !== ''
      // ) {
      //   console.log('asopdk', newEl.firstChild.nodeValue.trim());
      //   curEl.textContent = newEl.textContent;
      //   // Very nice property available on all nodes called 'nodeValue' - set to null if it's element, if its text then we get the content of the text node.
      // }

      // // Updates changed ATTRIBUTES
      const curEl = curElements[i];

      if (!newEl.isEqualNode(curEl)) {
        if (newEl.firstChild?.nodeValue.trim() !== '')
          curEl.textContent = newEl.textContent;

        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner(saveMarkup = false) {
    const prevHTML = this._parentElement.innerHTML;
    const markup = `
    <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
    if (saveMarkup) return prevHTML;
  }

  renderError(message = this._errorMessage) {
    this._clear();
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    this._clear();
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}_icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderFormerHTML(html) {
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
