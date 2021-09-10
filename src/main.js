import { RenderPosition, render, remove } from './utils/render.js';
import { MenuItem, UpdateType } from './const.js';
import Api from './api.js';

import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';

const AUTHORIZATION = 'Basic WegZnquFPYmp23n';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

const mainElement = document.querySelector('.trip-main');
const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

const menuComponent = new MenuView();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filterPresenter = new FilterPresenter(filtersElement, filterModel);
filterPresenter.init();
const tripPresenter = new TripPresenter(eventsElement, mainElement, filterModel, pointsModel, offersModel, destinationsModel, api);
tripPresenter.init();

addNewPointButton.disabled = true;
[...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = true);

const handleNewPointFormClose = () => {
  addNewPointButton.disabled = false;
};

addNewPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint(handleNewPointFormClose);
  addNewPointButton.disabled = true;
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

// api.getDestinations();
// api.setOffers();
// .then((points, offers, destinations) => {

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    // offersModel.setOffers(offers);
    // destinationsModel.setDestinations(destinations);
    render(navigationElement, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
    addNewPointButton.disabled = false;
    [...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = false);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(navigationElement, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
    addNewPointButton.disabled = false;
    [...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = false);
  });
