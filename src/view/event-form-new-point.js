import { POINT_TYPES } from '../const.js';
import { CITY_POINTS } from '../mock/mock-data.js';
import { createEventFormOffersTemplate } from './event-form-offers.js';
import { createEventFormDestinationTemplate } from './event-form-destination.js';
import dayjs from 'dayjs';
import { createElement } from '../utils.js';

export const createEventFormNewPointTemplate = (point) => {
  const { id, type, destination, basePrice, dateTo, dateFrom, offers } = point;
  const valueStartTime = dayjs(dateFrom).format('YY/MM/DD HH:MM');
  const valueFinishTime = dayjs(dateTo).format('YY/MM/DD HH:MM');

  const offersElement = offers.length !== 0 ? createEventFormOffersTemplate(point) : '';
  const destinationElement = Object.keys(destination).length !== 0 ? createEventFormDestinationTemplate(point) : '';

  return `<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${POINT_TYPES.map((pointType) => (`<div class="event__type-item">
          <input id="event-type-${pointType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointType}</label>
        </div>`)).join('\n')}

        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        Flight
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="Geneva" list="destination-list-${id}">
      <datalist id="destination-list-${id}">
      ${CITY_POINTS.map((cityPoint) => (`<option value="${cityPoint}"></option>`)).join('\n')}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${valueStartTime}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${valueFinishTime}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
  ${offersElement}
  ${destinationElement}
  </section>
</form>`;
};

export default class EventFormNewPoint {
  constructor(point) {
    this._element = null;
    this._point = point;
  }

  getTemplate() {
    return createEventFormNewPointTemplate(this._point);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
