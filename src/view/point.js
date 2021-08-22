import dayjs from 'dayjs';
import { getDurationTime } from '../mock/date.js';
import { createPointOffersListTemplate } from './point-offers.js';
import AbstractView from './abstract.js';

const createPointTemplate = (point) => {
  const { type, destination, basePrice, dateTo, dateFrom, isFavorite, offers } = point;

  const dateFromMonthDay = dayjs(dateFrom).format('MMM D');
  const dateFromHoursMinutes = dayjs(dateFrom).format('HH:mm');
  const dateToHoursMinutes = dayjs(dateTo).format('HH:mm');
  const durationTime = getDurationTime(dateTo, dateFrom);
  const dateTimeFrom = dayjs(dateFrom).format('YYYY-MM-DD');
  const dateTimeTo = dayjs(dateTo).format('YYYY-MM-DD');

  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const offersList = offers.length !== 0 ? createPointOffersListTemplate(offers) : '';

  return `<div class="event">
      <time class="event__date" datetime="${dateTimeFrom}">${dateFromMonthDay}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateTimeFrom}">${dateFromHoursMinutes}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTimeTo}">${dateToHoursMinutes}</time>
        </p>
        <p class="event__duration">${durationTime}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${offersList}
      <button class="event__favorite-btn ${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path
            d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z" />
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;
    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
