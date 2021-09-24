import { RenderPosition, render, remove } from './utils/render.js';
import { EndPoints, MenuItem, UpdateType } from './const.js';
import Api from './api/api.js';

import MenuView from './view/menu.js';
import StatsView from './view/stats.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';

import { isOnline } from './utils/common.js';
import { toast } from './utils/toast.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const AUTHORIZATION = 'Basic 1egznq2FPYmp121';
const END_POINT = 'https://15.ecmascript.pages.academy/big-trip';
const STORE_PREFIX = 'big-trip-localstorage';
const STORE_VER = 'v15';
const STORE_NAME_POINTS = `${STORE_PREFIX}-${STORE_VER}-${EndPoints.POINTS}`;
const STORE_NAME_DESTINATIONS = `${STORE_PREFIX}-${STORE_VER}-${EndPoints.DESTINATIONS}`;
const STORE_NAME_OFFERS = `${STORE_PREFIX}-${STORE_VER}-${EndPoints.OFFERS}`;

const api = new Api(END_POINT, AUTHORIZATION);
const storePoints = new Store(STORE_NAME_POINTS, window.localStorage);
const storeDestinations = new Store(STORE_NAME_DESTINATIONS, window.localStorage);
const storeOffers = new Store(STORE_NAME_OFFERS, window.localStorage);
const apiWithProviderPoints = new Provider(api, storePoints);
const apiWithProviderDestinations = new Provider(api, storeDestinations);
const apiWithProviderOffers = new Provider(api, storeOffers);

const mainElement = document.querySelector('.trip-main');
const eventsElement = document.querySelector('.trip-events');
const navigationElement = mainElement.querySelector('.trip-controls__navigation');
const filtersElement = mainElement.querySelector('.trip-controls__filters');
const addNewPointButton = mainElement.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const menuComponent = new MenuView();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const tripPresenter = new TripPresenter(eventsElement, mainElement, filterModel, pointsModel, offersModel, destinationsModel, apiWithProviderPoints);
tripPresenter.init();

const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);
filterPresenter.init();

[...filtersElement.querySelectorAll('.trip-filters__filter-input')].map((input) => input.disabled = true);
addNewPointButton.disabled = true;

const handleNewPointFormClose = () => {
  addNewPointButton.disabled = false;
};

addNewPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  if (!isOnline()) {
    toast('You can\'t create new task offline');
    return;
  }
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
        filterPresenter.init();
        addNewPointButton.disabled = false;
        menuComponent.setMenuItem(MenuItem.TABLE);
      }
      break;
    case MenuItem.STATS:
      if (currentMenuItem !== MenuItem.STATS) {
        tripPresenter.destroy();
        statsComponent = new StatsView(pointsModel.getPoints());
        tripPresenter.renderTripHeader();
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

Promise.all([
  apiWithProviderDestinations.getDestinations(),
  apiWithProviderOffers.getOffers(),
  apiWithProviderPoints.getPoints(),
])
  .then((values) => {
    const [destinations, offers, points] = values;
    destinationsModel.setDestinations(UpdateType.INIT, destinations);
    offersModel.setOffers(UpdateType.INIT, offers);
    pointsModel.setPoints(UpdateType.INIT, points);
    filterPresenter.init();
    addNewPointButton.disabled = false;
    render(navigationElement, menuComponent, RenderPosition.BEFOREEND);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProviderPoints.sync();
  if (document.querySelector('.event__type-btn')) {
    document.querySelector('.event__type-btn').style.pointerEvents = 'auto';
    document.querySelector('.event__type-btn').style.opacity = 1;
  }
  if (document.querySelector('.event__input--destination')) {
    document.querySelector('.event__input--destination').disabled = false;
  }
  tripPresenter.destroy();
  tripPresenter.init();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  if (document.querySelector('.event__type-btn')) {
    document.querySelector('.event__type-btn').style.pointerEvents = 'none';
    document.querySelector('.event__type-btn').style.opacity = 0.5;
  }
  if (document.querySelector('.event__input--destination')) {
    document.querySelector('.event__input--destination').disabled = true;
  }
  const refresh = window.localStorage.getItem('refresh');
  if (refresh === null) {
    window.location.reload();
    window.localStorage.setItem('refresh', '1');
  }
});
