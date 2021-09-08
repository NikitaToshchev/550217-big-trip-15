import { generatePoint } from './mock/point.js';
import { RenderPosition, render, remove } from './utils/render.js';
import { MenuItem } from './const.js';

// import LoadingView from './view/loading.js';

import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';

const POINT_COUNT = 4;

const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');

const menuComponent = new MenuView();

render(navigationElement, menuComponent, RenderPosition.BEFOREEND);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filtersElement = document.querySelector('.trip-controls__filters');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(filtersElement, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(eventsElement, mainElement, filterModel, pointsModel);
tripPresenter.init();

const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

const handleNewPointFormClose = () => {
  addNewPointButton.disabled = false;
};

addNewPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  addNewPointButton.disabled = true;
  tripPresenter.createPoint(handleNewPointFormClose);
});

let statsComponent = null;
let currentMenuItem = MenuItem.TABLE;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      if (currentMenuItem !== MenuItem.TABLE) {
        tripPresenter.destroy();
        tripPresenter.init();
        remove(statsComponent);
        statsComponent = null;
        currentMenuItem = MenuItem.TABLE;
        [...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = false);
        addNewPointButton.disabled = false;
        menuComponent.setMenuItem(MenuItem.TABLE);
      }
      break;
    case MenuItem.STATS:
      if (currentMenuItem !== MenuItem.STATS) {
        tripPresenter.destroy();
        tripPresenter.renderTripHeader();
        statsComponent = new StatsView(pointsModel.getPoints());
        render(eventsElement, statsComponent, RenderPosition.BEFOREEND);
        currentMenuItem = MenuItem.STATS;
        [...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = true);
        addNewPointButton.disabled = true;
        menuComponent.setMenuItem(MenuItem.STATS);
      }
      break;
    default:
      throw new Error('There is no such option');
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);
