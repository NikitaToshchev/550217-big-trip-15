import { RenderPosition, render, remove } from '../utils/render.js';
import { sortPrice, sortTimeDuration, updateItem } from '../utils/common.js';

import InfoView from '../view/info.js';
import InfoMainView from '../view/info-main.js';
import TotalCostView from '../view/total-cost.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point.js';
import { SortType } from '../const.js';

export default class Trip {
  constructor(tripContainer, infoContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._infoContainer = infoContainer;
    /// n
    this._pointsModel = pointsModel;

    this._listComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._infoComponent = new InfoView();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY.name;

    this._handleDataChange = this._handleDataChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();

    this._infoMainComponent = new InfoMainView(this._points);
    this._totalCostComponent = new TotalCostView(this._points);
    this._sortComponent = new SortView(this._currentSortType);

    this._renderTripList();
  }
  /// n

  _getPoints() {
    return this._pointsModel.getPoints();
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    remove(this._sortComponent);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME.name:
        this._points.sort(sortTimeDuration);
        break;
      case SortType.PRICE.name:
        this._points.sort(sortPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
    }

    this._currentSortType = sortType;
  }

  _renderTripList() {
    if (this._points.length === 0) {
      this._renderListEmpty();
      return;
    }
    this._renderTripHeader();
    this._renderSort();
    this._renderList();
    this._renderPoints();
  }

  _renderTripHeader() {
    this._renderInfo();
    this._renderInfoMain();
    this._renderTotalCost();
  }

  _handleDataChange(updatePoint) {
    this._points = updateItem(this._points, updatePoint);
    this._sourcedPoints = updateItem(this._sourcedPoints, updatePoint);
    this._pointPresenter.get(updatePoint.id).init(updatePoint);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearList();
    this._renderPoints();
    this._sortComponent = new SortView(sortType);
    this._renderSort();
  }
}
