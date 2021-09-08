import AbstractView from './abstract.js';

// const createFilterTemplate = (filters, currentFilterType) => {

//   // так же сделать в sort и закрыть резолвед в пр. Не понимаю как вынести логику если я использую внутри конструкции
//   const isFilterChecked = name.type === currentFilterType ? 'checked' : '';

//   return `<div class="trip-controls__filters">
//     <h2 class="visually-hidden">Filter events</h2>
//     <form class="trip-filters" action="#" method="get">
//     ${filters.map((name) => (
//     `<div class="trip-filters__filter">
//     <input id="filter-${name.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.type}" ${name.type === currentFilterType ? 'checked' : ''}>
//     <label class="trip-filters__filter-label" for="filter-${name.type}">${name.type}</label>
//   </div>`)).join('')}

//       <button class="visually-hidden" type="submit">Accept filter</button>
//     </form>
//   </div>`
// };


const createFilterTemplate = (filters, currentFilterType) => (
  `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
    ${filters.map((name) => (
    `<div class="trip-filters__filter">
    <input id="filter-${name.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.type}" ${name.type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name.type}">${name.type}</label>
  </div>`)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}
