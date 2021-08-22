import { RenderPosition, render } from '../utils/render.js';
import { updateItem } from '../utils/common.js';

import InfoView from '../view/info.js';
import InfoMainView from '../view/info-main.js';
import TotalCostView from '../view/total-cost.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point.js';

export default class Trip {
  constructor(tripContainer, infoContainer) {
    this._tripContainer = tripContainer;
    this._infoContainer = infoContainer;

    this._sortComponent = new SortView();
    this._listComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._infoComponent = new InfoView();
    this._infoMainComponent = new InfoMainView(this._points);
    this._totalCostComponent = new TotalCostView(this._points);
    this._pointPresenter = new Map();

    this._handleDataChange = this._handleDataChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._renderTripList();
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderListEmpty() {
    render(this._tripContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._listComponent, this._handleDataChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderInfo() {
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderInfoMain() {
    render(this._infoComponent, this._infoMainComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTotalCost() {
    render(this._infoComponent, this._totalCostComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    render(this._tripContainer, this._listComponent, RenderPosition.BEFOREEND);
  }

  _clearList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTripList() {
    if (this._points.length === 0) {
      this._renderListEmpty();
      return;
    }

    this._renderSort();
    this._renderList();
    this._renderPoints();
    this._renderInfo();
    this._renderInfoMain();
    this._renderTotalCost();
  }

  _handleDataChange(updatePoint) {
    this._points = updateItem(this._points, updatePoint);
    this._pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }
}
