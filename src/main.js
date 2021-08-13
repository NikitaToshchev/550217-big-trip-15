import { RenderPosition, render } from './utils.js';
import { generatePoint } from './mock/point.js';

// import ListEmptyView from './view/list-empty.js';
// import StatsView from './view/stats.js';
// import LoadingView from './view/loading.js';
// import EventFormNewPoint from './view/event-form-new-point.js';

import TotalCostView from './view/total-cost.js';
import FilterView from './view/filter.js';
import InfoMainView from './view/info-main.js';
import InfoView from './view/info.js';
import ListView from './view/list.js';
import SortView from './view/sort.js';
import MenuView from './view/menu.js';
import PointView from './view/point.js';
import EventFormEditView from './view/event-form-edit.js';

const POINT_COUNT = 20;
export const points = new Array(POINT_COUNT).fill().map(generatePoint);

const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-main');
const infoComponent = new InfoView();
const listComponent = new ListView();

render(navigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, infoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(infoComponent.getElement(), new TotalCostView().getElement(), RenderPosition.BEFOREEND);
render(infoComponent.getElement(), new InfoMainView().getElement(), RenderPosition.AFTERBEGIN);
render(filtersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(eventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(eventsElement, listComponent.getElement(), RenderPosition.BEFOREEND);

const renderPoint = (listElement, point) => {
  const pointComponent = new PointView(point);
  const eventFormEditComponent = new EventFormEditView(point);

  const replacePointToForm = () => {
    listElement.replaceChild(eventFormEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    listElement.replaceChild(pointComponent.getElement(), eventFormEditComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
  });

  eventFormEditComponent.getElement().addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
  });
  render(listElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

points.forEach((point) => {
  renderPoint(listComponent.getElement(), point);
});
