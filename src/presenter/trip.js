import { RenderPosition, render, remove } from '../utils/render.js';
import { sortPrice, sortTimeDuration } from '../utils/common.js';

import InfoView from '../view/info.js';
import InfoMainView from '../view/info-main.js';
import TotalCostView from '../view/total-cost.js';
import SortView from '../view/sort.js';
import ListView from '../view/list.js';
import ListEmptyView from '../view/list-empty.js';
import PointPresenter from './point.js';
import { SortType, UserAction, UpdateType } from '../const.js';


export default class Trip {
  constructor(tripContainer, infoContainer, pointsModel) {
    this._tripContainer = tripContainer;
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;

    this._listComponent = new ListView();
    this._listEmptyComponent = new ListEmptyView();
    this._infoComponent = new InfoView();
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DAY.name;
    this._infoMainComponent = new InfoMainView();
    this._totalCostComponent = new TotalCostView();
    this._sortComponent = new SortView(this._currentSortType);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    // this._tasksModel.addObserver(this._handleModelEvent);
  }

  init() {
    // пока сделал так чтобы работало, возможно куда-то нужно будет перенести
    this._infoMainComponent = new InfoMainView(this._getPoints());
    this._totalCostComponent = new TotalCostView(this._getPoints());
    this._renderTripList();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME.name:
        return this._pointsModel.getPoints().slice().sort(sortTimeDuration);
      case SortType.PRICE.name:
        return this._pointsModel.getPoints().slice().sort(sortPrice);
    }
    return this._pointsModel.getPoints().sort((pointA, pointB) => pointA.dateFrom - pointB.dateFrom);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderListEmpty() {
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

  _renderTripList() {
    if (this._pointsModel.getPoints().length === 0) {
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

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearList();
    this._renderPoints();
    this._sortComponent = new SortView(sortType);
    this._renderSort();
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
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
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  }
}
