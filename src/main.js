import { generatePoint } from './mock/point.js';
import { RenderPosition, render, replace } from './utils/render.js';

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

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const navigationElement = document.querySelector('.trip-controls__navigation');
const eventsElement = document.querySelector('.trip-events');
const filtersElement = document.querySelector('.trip-controls__filters');
const mainElement = document.querySelector('.trip-main');
const infoComponent = new InfoView();

render(navigationElement, new MenuView(), RenderPosition.BEFOREEND);
render(mainElement, infoComponent, RenderPosition.AFTERBEGIN);
render(infoComponent, new TotalCostView(), RenderPosition.BEFOREEND);
render(infoComponent, new InfoMainView(), RenderPosition.AFTERBEGIN);
render(filtersElement, new FilterView(), RenderPosition.BEFOREEND);

const renderPoint = (listElement, point) => {
  const pointComponent = new PointView(point);
  const eventFormEditComponent = new EventFormEditView(point);
  const listItem = new ListItemView();

  const replacePointToForm = () => {
    replace(eventFormEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, eventFormEditComponent);
  };

  pointComponent.setRollupBtnClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  eventFormEditComponent.setFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  eventFormEditComponent.setRollupBtnClickHandler(() => {
    replaceFormToPoint();
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  render(listElement, listItem, RenderPosition.BEFOREEND);
  render(listItem, pointComponent, RenderPosition.BEFOREEND);
};

const renderList = (container, arrPoints) => {
  const listComponent = new ListView();

  if (arrPoints.length === 0) {
    render(container, new ListEmptyView(), RenderPosition.BEFOREEND);
    return;
  }

  render(eventsElement, new SortView(), RenderPosition.BEFOREEND);
  render(container, listComponent, RenderPosition.BEFOREEND);
  arrPoints.forEach((point) => {
    renderPoint(listComponent, point);
  });
};

renderList(eventsElement, points);
