import { POINT_TYPES } from '../../const.js';
import { CITY_POINTS, OffersByType } from '../../mock/mock-data.js';
import { generateDestination } from '../../mock/destination.js';
import { createEventFormOffersTemplate } from './event-form-offers.js';
import { createEventFormDestinationTemplate } from './event-form-destination.js';
import dayjs from 'dayjs';
import SmartView from '../smart.js';
import flatpickr from 'flatpickr';
import '../../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEventFormEditTemplate = (data) => {
  const { id, type, destination, basePrice, dateTo, dateFrom, offers } = data;
  const valueStartTime = dayjs(dateFrom).format('YY/MM/DD HH:MM');
  const valueFinishTime = dayjs(dateTo).format('YY/MM/DD HH:MM');

  const isSubmitDisabled = valueStartTime > valueFinishTime ? 'disabled' : '';
  const isOffersElement = offers.length !== 0 ? createEventFormOffersTemplate(data) : '';
  const isDestinationElement = Object.keys(destination).length !== 0 ? createEventFormDestinationTemplate(data) : '';

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
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
      <datalist id="destination-list-${id}">
      ${CITY_POINTS.map((cityPoint) => (
    `<option value="${cityPoint}"></option>`)).join('\n')}
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

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled}>Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
  ${isOffersElement}
  ${isDestinationElement}
  </section>
</form>`;
};

export default class EventFormEdit extends SmartView {
  constructor(point) {
    super();
    this._data = EventFormEdit.parsePointToData(point);

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);

    this._startTimeHandler = this._startTimeHandler.bind(this);
    this._endTimeHandler = this._endTimeHandler.bind(this);

    this._setInnerHandelers();
  }

  getTemplate() {
    return createEventFormEditTemplate(this._data);
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandelers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
  }

  _setInnerHandelers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
    this._setDatePicker();
  }

  reset(point) {
    this.updateData(EventFormEdit.parsePointToData(point));
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventFormEdit.parseDataToPoint(this._data));
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: OffersByType[evt.target.value],
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: {
        description: generateDestination().description,
        name: evt.target.value,
        pictures: generateDestination().pictures,
      },
    });
  }

  _startTimeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _endTimeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _setDatePicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }

    this._datepickerStart = flatpickr(
      this.getElement().querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this._startTimeHandler,
      },
    ),

      this._datepickerEnd = flatpickr(
        this.getElement().querySelector('input[name="event-end-time"]'),
        {
          dateFormat: 'd/m/y H:i',
          enableTime: true,
          minDate: this._datepickerStart.input.value,
          'time_24hr': true,
          onChange: this._endTimeHandler,
        },
      );
  }

  _resetDatepicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }
    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }
  // Метод задача которого взять инофрмацию и сделать ее снимок превратив в состояние

  static parsePointToData(point) {
    return Object.assign({}, point);
  }
  // Метод используется чтобы сохранить состояние в инофрмацию

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}
