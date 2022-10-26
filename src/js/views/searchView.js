class searchView {
  #parentElement = document.querySelector('.search');
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }
  addHandlerSearch(func, ...events) {
    events.forEach(ev =>
      this.#parentElement.addEventListener(ev, function (e) {
        e.preventDefault();
        func();
      })
    );
  }
}

export default new searchView();
