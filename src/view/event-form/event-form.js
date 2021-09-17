import { createEventFormOffersTemplate } from './event-form-offers.js';
import { createEventFormDestinationTemplate } from './event-form-destination.js';
import dayjs from 'dayjs';
import SmartView from '../smart.js';
import flatpickr from 'flatpickr';
import '../../../node_modules/flatpickr/dist/flatpickr.min.css';
import { matchCity } from '../../utils/common.js';

const createEventFormEditTemplate = (data, allOffers, destinations, isEditForm) => {
  const { id, type, basePrice, dateTo, dateFrom, offers, destination, isDisabled, isSaving, isDeleting } = data;
  const valueStartTime = dayjs(dateFrom).format('YY/MM/DD HH:MM');
  const valueFinishTime = dayjs(dateTo).format('YY/MM/DD HH:MM');

  const offersByType = allOffers.find((offer) => offer.type === type).offers;
  const typeCities = destinations.map((item) => item.name);
  const typePoints = allOffers.map((item) => item.type);

  const getSubmitSaving = isSaving ? 'Saving...' : 'Save';
  const getInputDisabled = isDisabled ? 'disabled' : '';
  const getSubmitDisabled = valueStartTime > valueFinishTime || !destination.name || isDisabled ? 'disabled' : '';

  const getOffersElement = offersByType.length !== 0 ? createEventFormOffersTemplate(id, offers, offersByType) : '';
  const getDestinationElement = destination.name.length !== 0 ? createEventFormDestinationTemplate(destination) : '';

  const createEventRollupBtn = `${isEditForm ? `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
  <span class="visually-hidden">Open event</span>
</button>`: ''}`;

  const createEventResetBtnName = (isEditFormFlag, isDeletingFlag) => {
    if (!isEditFormFlag) {
      return 'Cancel';
    }

    return (isDeletingFlag) ? 'Deleting...' : 'Delete';
  };

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

          ${typePoints.map((pointType) => (`<div class="event__type-item">
          <input id="event-type-${pointType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${getInputDisabled}>
          <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointType}</label>
        </div>`)).join('\n')}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}" ${getInputDisabled}>
      <datalist id="destination-list-${id}">
      ${typeCities.map((cityPoint) => (
    `<option value="${cityPoint}"></option>`)).join('\n')}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${valueStartTime}" ${getInputDisabled}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${valueFinishTime}" ${getInputDisabled}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}" ${getInputDisabled}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit"${getSubmitDisabled}> ${getSubmitSaving}</button>
    <button class="event__reset-btn" type="reset" ${getInputDisabled}>${createEventResetBtnName(isEditForm, isDeleting)}</button>
    ${createEventRollupBtn}
  </header>
  <section class="event__details">
  ${getOffersElement}
  ${getDestinationElement}
  </section>
</form>`;
};

const BLANK_POINT = {
  type: 'taxi',
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: 1,
  offers: [],
  isFavorite: false,
};

export default class EventForm extends SmartView {
  constructor(point = BLANK_POINT, offers, destinations, isEditForm) {
    super();
    this._data = EventForm.parsePointToData(point);
    this._offers = offers;
    this._destinations = destinations;
    this._isEditForm = isEditForm;

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._cityChangeHandler = this._cityChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._startTimeHandler = this._startTimeHandler.bind(this);
    this._endTimeHandler = this._endTimeHandler.bind(this);
    this._offersСhangeHandler = this._offersСhangeHandler.bind(this);

    this._setInnerHandelers();
  }

  getTemplate() {
    return createEventFormEditTemplate(this._data, this._offers, this._destinations, this._isEditForm);
  }

  removeElement() {
    super.removeElement();
    this._resetDatepicker();
  }

  restoreHandlers() {
    this._setInnerHandelers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupBtnClickHandler(this._callback.rollupBtnClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandelers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._cityChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('change', this._priceInputHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement().querySelector('.event__available-offers').addEventListener('change', this._offersСhangeHandler);
    }

    this._setDatePicker();
  }

  reset(point) {
    this.updateData(EventForm.parsePointToData(point));
  }

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EventForm.parseDataToPoint(this._data));
  }

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: [],
    });
  }

  _cityChangeHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value;
    const inputValue = this.getElement().querySelector('.event__input--destination');
    const typeCities = this._destinations.map((destination) => destination.name);
    if (!city || !matchCity(city, typeCities)) {
      inputValue.setCustomValidity('Сhoose a city from the list');
    } else {
      inputValue.setCustomValidity('');
      this.updateData({
        destination: {
          description: this._destinations.find((destination) => destination.name === city).description,
          name: city,
          pictures: this._destinations.find((destination) => destination.name === city).pictures,
        },
      });
    }
    inputValue.reportValidity();
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const inputValue = this.getElement().querySelector('.event__input--price');
    const price = Number(evt.target.value);

    if (!price || price < 0) {
      inputValue.setCustomValidity('The field must be filled with a positive number');
    } else {
      inputValue.setCustomValidity('');
      this.updateData({
        basePrice: price,
      });
    }

    inputValue.reportValidity();
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventForm.parseDataToPoint(this._data));
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
        dateFormat: 'y/m/d H:i',
        enableTime: true,
        'time_24hr': true,
        onChange: this._startTimeHandler,
      },
    );

    this._datepickerEnd = flatpickr(
      this.getElement().querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'y/m/d H:i',
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

  _offersСhangeHandler(evt) {
    evt.preventDefault();
    const checkboxes = [...this.getElement().querySelectorAll('.event__offer-checkbox')];
    const checkedCheckboxes = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedCheckboxes.push({
          title: checkbox.dataset.title,
          price: +checkbox.dataset.price,
        });
      }
    });

    this.updateData({
      offers: checkedCheckboxes,
    });
  }

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    if (this.getElement().querySelector('.event__rollup-btn')) {

      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
    }
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parsePointToData(point) {
    return Object.assign({}, point, {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
