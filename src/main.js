import { createMenuTemplate } from './view/menu.js';
import { createInfoTemplate } from './view/info.js';
import { createInfoMainTemplate } from './view/info-main.js';
import { createCostTemplate } from './view/cost.js';
import { createFiltersTemplate } from './view/filters.js';
import { createSortTemplate } from './view/sort.js';
import { createListTemplate } from './view/list.js';
import { createPointTemplate } from './view/point.js';
import { generatePoint } from './mock/point.js';
import { createEventFormEditTemplate } from './view/event-form-edit.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-main');

render(navigationElement, createMenuTemplate(), RenderPosition.BEFOREEND);
render(mainElement, createInfoTemplate(), RenderPosition.AFTERBEGIN);

const infoElement = document.querySelector('.trip-info');

render(infoElement, createInfoMainTemplate(), RenderPosition.AFTERBEGIN);
render(infoElement, createCostTemplate(), RenderPosition.BEFOREEND);
render(filtersElement, createFiltersTemplate(), RenderPosition.BEFOREEND);
render(eventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
render(eventsElement, createListTemplate(), RenderPosition.BEFOREEND);

const listElement = document.querySelector('.trip-events__list');

render(eventsElement, createEventFormEditTemplate(points[0]), RenderPosition.BEFOREEND);

points.forEach((point) => {
  render(listElement, createPointTemplate(point), RenderPosition.BEFOREEND);
});

