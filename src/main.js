// import { createMenuTemplate } from './view/menu.js';
// import { createInfoTemplate } from './view/info.js';
// import { createInfoMainTemplate } from './view/info-main.js';
// import { createCostTemplate } from './view/cost.js';
// import { createFiltersTemplate } from './view/filters.js';
// import { createSortTemplate } from './view/sort.js';
// import { createEventFormTemplate } from './view/event-form.js';
// import { createEventFormDetailsTemplate } from './view/event-form-details.js';
// import { createEventFormOffersTemplate } from './view/event-form-offers.js';
// import { createEventFormDestinationTemplate } from './view/event-form-destination.js';
// import { createStatsTemplate } from './view/stats.js';
// import { createLoadingTemplate } from './view/loading.js';
import { createListTemplate } from './view/list.js';
import { createListItemTemplate } from './view/list-item.js';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const POINTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
// const filtersElement = document.querySelector('.trip-controls__filters');
// const mainElement = document.querySelector('.trip-main');
// const detailsElement = document.querySelector('.details');

// render(navigationElement, createMenuTemplate(), RenderPosition.BEFOREEND);
// render(eventsElement, createLoadingTemplate(), RenderPosition.BEFOREEND);
// render(mainElement, createInfoTemplate(), RenderPosition.AFTERBEGIN);

// const infoElement = document.querySelector('.trip-info');
// render(infoElement, createInfoMainTemplate(), RenderPosition.AFTERBEGIN);
// render(infoElement, createCostTemplate(), RenderPosition.BEFOREEND);
// render(filtersElement, createFiltersTemplate(), RenderPosition.BEFOREEND);
// render(eventsElement, createSortTemplate(), RenderPosition.BEFOREEND);
// render(eventsElement, createEventFormTemplate(), RenderPosition.BEFOREEND);

// const editForm = document.querySelector('.event--edit');
// render(editForm, createEventFormDetailsTemplate(), RenderPosition.BEFOREEND);
// const editFormDetails = document.querySelector('.event__details');
// render(editFormDetails, createEventFormOffersTemplate(), RenderPosition.BEFOREEND);
// render(editFormDetails, createEventFormDestinationTemplate(), RenderPosition.BEFOREEND);
// render(eventsElement, createStatsTemplate(), RenderPosition.BEFOREEND);
render(eventsElement, createListTemplate(), RenderPosition.BEFOREEND);
const listElement = document.querySelector('.trip-events__list');

for (let i = 0; i < POINTS_COUNT; i++) {
  render(listElement, createListItemTemplate(), RenderPosition.BEFOREEND);
}
