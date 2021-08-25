import { RenderPosition, render, replace, remove } from '../utils/render.js';

import PointView from '../view/point.js';
import EventFormEditView from '../view/event-form-edit.js';
import ListItemView from '../view/list-item.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._editFormComponent = null;
    this._listItemComponent = new ListItemView();

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleRollupBtnClick = this._handleRollupBtnClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupBtnFormClick = this._handleRollupBtnFormClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEventFormEditComponent = this._eventFormEditComponent;

    this._pointComponent = new PointView(point);
    this._eventFormEditComponent = new EventFormEditView(point);

    this._pointComponent.setRollupBtnClickHandler(this._handleRollupBtnClick);
    this._eventFormEditComponent.setRollupBtnClickHandler(this._handleRollupBtnFormClick);
    this._eventFormEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevPointComponent === null || prevEventFormEditComponent === null) {
      render(this._pointListContainer, this._listItemComponent, RenderPosition.BEFOREEND);
      render(this._listItemComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventFormEditComponent, prevEventFormEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEventFormEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._eventFormEditComponent);
    remove(this._listItemComponent);
  }

  _replacePointToForm() {
    replace(this._eventFormEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._eventFormEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handleRollupBtnClick() {
    this._replacePointToForm();
  }

  _handleRollupBtnFormClick() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit() {
    this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
