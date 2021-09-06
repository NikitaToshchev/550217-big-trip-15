import { generatePoint } from './mock/point.js';
import { RenderPosition, render } from './utils/render.js';

// import StatsView from './view/stats.js';
// import LoadingView from './view/loading.js';
// import EventFormNewPoint from './view/event-form-new-point.js';

import MenuView from './view/menu.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

const POINT_COUNT = 4;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');

render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filtersElement = document.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filtersElement, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(eventsElement, mainElement, filterModel, pointsModel);
tripPresenter.init();

const newPointButton = document.querySelector('.trip-main__event-add-btn');

newPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  // newPointButton.disabled = true;
  tripPresenter.createPoint();
});
