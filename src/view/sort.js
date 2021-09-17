import AbstractView from './abstract.js';

const getSortChecked = (type, currentSortType) => type.name === currentSortType ? 'checked' : '';
const getSortDisabled = (type) => type.disabled ? 'disabled' : '';

const createSortTemplate = (sorts, currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${Object.values(sorts).map((type) => (`<div class="trip-sort__item  trip-sort__item--${type.name}">
  <input id="sort-${type.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type.name}" data-sort-type="${type.name}" ${getSortChecked(type, currentSortType)} ${getSortDisabled(type)}>
  <label class="trip-sort__btn" for="sort-${type.name}">${type.name}</label>
</div>`)).join('')}
  </form>`
);

export default class Sort extends AbstractView {
  constructor(sorts, currentSortType) {
    super();
    this._sorts = sorts;
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sorts, this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
