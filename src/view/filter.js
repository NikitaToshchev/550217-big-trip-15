import AbstractView from './abstract.js';
import { Filters } from '../const.js';

const createFilterTemplate = () => (
  `<div class="trip-controls__filters">
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters" action="#" method="get">
    ${Object.values(Filters).map((name) => (`<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}">
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`)).join('')}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  </div>`
);

export default class Filter extends AbstractView {
  getTemplate() {
    return createFilterTemplate();
  }
}
