import { createElement } from '../utils.js';
import { Sorts } from '../const.js';

const createSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">

  ${Object.values(Sorts).map((name) => (`<div class="trip-sort__item  trip-sort__item--${name}">
  <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}">
  <label class="trip-sort__btn" for="sort-${name}">${name}</label>
</div>`)).join('')}
  </form>`
);

export default class Sort {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
