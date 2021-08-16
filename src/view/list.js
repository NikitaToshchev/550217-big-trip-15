import AbstractView from './abstract.js';

const createListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class List extends AbstractView {
  getTemplate() {
    return createListTemplate();
  }
}
