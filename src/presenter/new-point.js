import { RenderPosition, render, remove } from '../utils/render.js';
import EventFormView from '../view/event-form/event-form.js';
import ListItemView from '../view/list-item.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPoint {
  constructor(pointListContainer, changeData, pointsModel) {
    this._pointsModel = pointsModel;
    this.pointListContainer = pointListContainer;
    this._changeData = changeData;
    this._isEditForm = false;

    this._eventFormComponent = null;
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    this._listItemComponent = new ListItemView();
    render(this._pointListContainer, this._listItemComponent, RenderPosition.AFTERBEGIN);

    const point = {
      id: nanoid(),
      type: 'taxi',
      destination: {
        description: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        ],
        name: 'Amsterdam',
        pictures: [
          {
            src: 'http://picsum.photos/248/152?r=1',
            description: 'mountains',
          },
          {
            src: 'http://picsum.photos/248/152?r=2',
            description: 'foggy forest',
          },
          {
            src: 'http://picsum.photos/248/152?r=3',
            description: 'bumps',
          },
        ],
      },
      dateFrom: '2019-07-10T22:55:56.845Z',
      dateTo: '2019-07-11T11:22:13.375Z',
      basePrice: 0,
      offers: [
        {
          title: 'Upgrade to a business class',
          price: 120,
        },
        {
          title: 'Choose the radio station',
          price: 60,
        },
      ],
      isFavorite: false,
    };

    this._eventFormComponent = new EventFormView(point, this._isEditForm);
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
