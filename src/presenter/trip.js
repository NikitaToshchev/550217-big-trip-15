import { RenderPosition, render, remove } from '../utils/render.js';
import { sortPrice } from '../utils/common.js';
import { sortTimeDuration } from '../utils/date.js';

import InfoView from '../view/info.js';
import InfoMainView from '../view/info-main.js';
import TotalCostView from '../view/total-cost.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point.js';

export default class Trip {
  constructor(tripContainer, infoContainer, filterModel, pointsModel) {
    this._tripContainer = tripContainer;
    this._infoContainer = infoContainer;

    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DAY.name;
    this._filterType = FilterType.EVERYTHING;

    this._listComponent = new ListView();
    this._infoComponent = new InfoView();
    this._newPointPresenter = new NewPointPresenter();
    this._infoMainComponent = null;
    this._totalCostComponent = null;
    this._sortComponent = null;
    this._listEmptyComponent = null;

    this._pointPresenter = new Map();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({ resetSortType: true });

    remove(this._listComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DAY.name;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter = new NewPointPresenter(this._listComponent, this._handleViewAction);
    this._newPointPresenter.init(callback);
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME.name:
        return filteredPoints.sort(sortTimeDuration);
      case SortType.PRICE.name:
        return filteredPoints.sort(sortPrice);
      default:
        return filteredPoints.sort((pointA, pointB) => pointA.dateFrom - pointB.dateFrom);
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(SortType, this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderListEmpty() {
    if (this._listEmptyComponent !== null) {
      this._listEmptyComponent = null;
    }

    this._listEmptyComponent = new ListEmptyView(this._filterType);
    render(this._tripContainer, this._listEmptyComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._listComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderPoints() {
    this._getPoints().slice().forEach((point) => this._renderPoint(point));
  }

  _renderInfo() {
    render(this._infoContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderInfoMain() {
    this._infoMainComponent = new InfoMainView(this._pointsModel.getPoints());
    render(this._infoComponent, this._infoMainComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTotalCost() {
    this._totalCostComponent = new TotalCostView(this._pointsModel.getPoints());
    render(this._infoComponent, this._totalCostComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    render(this._tripContainer, this._listComponent, RenderPosition.BEFOREEND);
  }

  _clearBoard({ resetSortType = false } = {}) {
    this._newPointPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._sortComponent);
    remove(this._infoComponent);
    remove(this._infoMainComponent);
    remove(this._totalCostComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY.name;
    }
    if (this._listEmptyComponent) {
      remove(this._listEmptyComponent);
    }
  }

  _renderBoard() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    this.renderTripHeader();

    if (filteredPoints.length === 0) {
      this._renderListEmpty();
      return;
    }

    this._renderSort();
    this._renderList();
    this._renderPoints();
  }

  renderTripHeader() {
    this._renderInfo();
    this._renderInfoMain();
    this._renderTotalCost();
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({ resetSortType: true });
        this._renderBoard();
        break;
    }
  }
}
