import { generatePoint } from './mock/point.js';
import { RenderPosition, render } from './utils/render.js';

// import StatsView from './view/stats.js';
// import LoadingView from './view/loading.js';
// import EventFormNewPoint from './view/event-form-new-point.js';

import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';

const POINT_COUNT = 4;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');
const eventsElement = document.querySelector('.trip-events');

render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(filtersElement, new FilterView(), RenderPosition.BEFOREEND);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripPresenter = new TripPresenter(eventsElement, mainElement, pointsModel);
tripPresenter.init();
