import { RenderPosition, render, replace, remove } from '../utils/render.js';
import PointView from '../view/point.js';
import EventFormView from '../view/event-form/event-form.js';
import ListItemView from '../view/list-item.js';
import { Mode, UserAction, UpdateType, State } from '../const.js';

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._eventFormComponent = null;
    this._listItemComponent = new ListItemView();
    this._isEditForm = true;

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleRollupBtnClick = this._handleRollupBtnClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleRollupBtnFormClick = this._handleRollupBtnFormClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, offers, destinations) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevEventFormEditComponent = this._eventFormComponent;

    this._pointComponent = new PointView(point);
    this._eventFormComponent = new EventFormView(point, offers, destinations, this._isEditForm);

    this._pointComponent.setRollupBtnClickHandler(this._handleRollupBtnClick);
    this._eventFormComponent.setRollupBtnClickHandler(this._handleRollupBtnFormClick);
    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevEventFormEditComponent === null) {
      render(this._pointListContainer, this._listItemComponent, RenderPosition.BEFOREEND);
      render(this._listItemComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevEventFormEditComponent);
      this._mode === Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevEventFormEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._eventFormComponent);
    remove(this._listItemComponent);
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetFormState = () => {
      this._eventFormComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._eventFormComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._eventFormComponent.shake(resetFormState);
        break;
    }
  }

  _replacePointToForm() {
    replace(this._eventFormComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._eventFormComponent);
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
      this._eventFormComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handleRollupBtnClick() {
    this._replacePointToForm();
  }

  _handleRollupBtnFormClick() {
    this._eventFormComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleFormSubmit(update) {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update,
    );
    // this._replaceFormToPoint();
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }

  _handleDeleteClick(point) {
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}
