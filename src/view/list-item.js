import AbstractView from './abstract.js';

const createListItemTemplate = () => (
  '<li class="trip-events__item"></li>'
);

export default class ListItem extends AbstractView {
  getTemplate() {
    return createListItemTemplate();
  }
}
