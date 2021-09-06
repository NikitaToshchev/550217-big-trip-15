import { RenderPosition, render, remove } from '../utils/render.js';
import EventFormView from '../view/event-form/event-form.js';
import ListItemView from '../view/list-item.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPoint {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._isEditForm = false;
    this._eventFormComponent = null;

    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventFormComponent !== null) {
      return;
    }
    this._listItemComponent = new ListItemView();
    this._eventFormComponent = new EventFormView(this._isEditForm);

    render(this._pointListContainer, this._listItemComponent, RenderPosition.AFTERBEGIN);
    render(this._listItemComponent, this._eventFormComponent, RenderPosition.AFTERBEGIN);

    this._eventFormComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventFormComponent.setDeleteClickHandler(this._handleDeleteClick);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventFormComponent === null) {
      return;
    }

    remove(this._eventFormComponent);
    remove(this._listItemComponent);
    this._eventFormComponent === null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(newPoint) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({ id: nanoid() }, newPoint),
    );

    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleDeleteClick() {
    this.destroy();
  }
}
