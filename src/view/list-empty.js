import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const emptyListTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

const createListEmptyTemplate = (filterType) => {
  const emptyListTextValue = emptyListTextType[filterType];

  `<p class="trip-events__msg">${emptyListTextValue}</p>`;
};

export default class ListEmpty extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createListEmptyTemplate(this._data);
  }
}
