import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createFilterTemplate = (currentFilterType = FilterType.EVERYTHING) => (
  `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
    ${Object.values(FilterType).map((name) => (`<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${name === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class Filter extends AbstractView {
  constructor(currentFilterType) {
    super();
    this._currentFilterType = currentFilterType;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._currentFilterType);
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
