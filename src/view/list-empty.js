import { createElement } from '../utils.js';

const createListEmptyTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

// Значение отображаемого текста зависит от выбранного фильтра:
//    Everthing – 'Click New Event to create your first point'
//   Past — 'There are no past events now';
//    Future — 'There are no future events now'.

export default class ListEmpty {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListEmptyTemplate();
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
