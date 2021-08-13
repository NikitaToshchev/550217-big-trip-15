import { RenderPosition, render } from './utils.js';
import { generatePoint } from './mock/point.js';

// import StatsView from './view/stats.js';
// import LoadingView from './view/loading.js';
// import EventFormNewPoint from './view/event-form-new-point.js';

import TotalCostView from './view/total-cost.js';
import FilterView from './view/filter.js';
import InfoMainView from './view/info-main.js';
import InfoView from './view/info.js';
import SortView from './view/sort.js';
import MenuView from './view/menu.js';
import ListView from './view/list.js';
import ListItemView from './view/list-item.js';
import ListEmptyView from './view/list-empty.js';
import PointView from './view/point.js';
import EventFormEditView from './view/event-form-edit.js';

const POINT_COUNT = 2;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-main');
const infoComponent = new InfoView();

render(navigationElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, infoComponent.getElement(), RenderPosition.AFTERBEGIN);
render(infoComponent.getElement(), new TotalCostView().getElement(), RenderPosition.BEFOREEND);
render(infoComponent.getElement(), new InfoMainView().getElement(), RenderPosition.AFTERBEGIN);
render(filtersElement, new FilterView().getElement(), RenderPosition.BEFOREEND);
render(eventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const renderPoint = (listElement, point) => {
  const pointComponent = new PointView(point);
  const eventFormEditComponent = new EventFormEditView(point);
  const listItem = new ListItemView();

  render(listElement, pointComponent.getElement(), RenderPosition.BEFOREEND);

  const replacePointToForm = () => {
    listElement.replaceChild(eventFormEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    listElement.replaceChild(pointComponent.getElement(), eventFormEditComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventFormEditComponent.getElement().addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventFormEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceFormToPoint();
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

};

const renderList = (container, arrPoints) => {
  const listComponent = new ListView();

  if (arrPoints.length !== 0) {
    render(container, listComponent.getElement(), RenderPosition.BEFOREEND);
    arrPoints.forEach((point) => {
      renderPoint(listComponent.getElement(), point);
    });
  } else {
    render(container, new ListEmptyView().getElement(), RenderPosition.BEFOREEND);
  }
};

renderList(eventsElement, points);
