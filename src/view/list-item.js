import { createElement } from '../utils.js';

const createListItemTemplate = () => (
  '<li class="trip-events__item"></li>'
);

export default class ListItem {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListItemTemplate();
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
