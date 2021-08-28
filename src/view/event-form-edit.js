import { POINT_TYPES } from '../const.js';
import { CITY_POINTS } from '../mock/mock-data.js';
import { createEventFormOffersTemplate } from './event-form-offers.js';
import { createEventFormDestinationTemplate } from './event-form-destination.js';
import dayjs from 'dayjs';
import AbstractView from './abstract.js';
///////////////////////////////////////// s

// передавать данные о точке и флаг если это форма редактирования или нет, чтобы передавать разные кнопки в форме и другие различия если есть
// const createEventFormEditTemplate = (data ,isFormEdit) => {
// }
//////////////////////////////////////// f

const createEventFormEditTemplate = (point) => {
  const { id, type, destination, basePrice, dateTo, dateFrom, offers } = point;
  ///////////////////////////////////////// s
  // const { id, type, destination, basePrice, dateTo, dateFrom, offers } = data;
  // передавать в data флаги isDestinationPictures, isDestinationDescription, isOffers
  //////////////////////////////////////// f
  const valueStartTime = dayjs(dateFrom).format('YY/MM/DD HH:MM');
  const valueFinishTime = dayjs(dateTo).format('YY/MM/DD HH:MM');

  ///////////////////////////////////////// s
  // По заданию нужны оферы, описание и фотографии и еще смена типа точки
  // лучше убрать логику в sort из шаблона, но в демке есть логка в шаблоне
  const isDestinationPictures = (destination) => console.log(destination.pictures[0]);
  // isDestinationPictures(destination);
  const isDestinationDescription = (destination) => console.log(destination.description);
  // isDestinationDescription(destination);
  const isOffers = (offers) => console.log(offers);
  isOffers(offers);

  //////////////////////////////////////// f

  const IsOffersElement = offers.length !== 0 ? createEventFormOffersTemplate(point) : '';
  const IsDestinationElement = Object.keys(destination).length !== 0 ? createEventFormDestinationTemplate(point) : '';

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

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">

  //////////////////////////s

  const IsOffersElement = offers.length !== 0 ? createEventFormOffersTemplate(point) : '';
  ${IsOffersElement ? createEventFormOffersTemplate(point) : ''}
  //////////////////////////f

  ${IsOffersElement}
  ${IsDestinationElement}
  </section>
</form>`;
};
// отнаследовать от смарт
export default class EventFormEdit extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._rollupBtnClickHandler = this._rollupBtnClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    //////////////////////////s
    // вместо this._point = point; передавать строку ниже
    // this._data = EventFormEdit.parseTaskToData(point);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._setInnerHandelers();
    //////////////////////////f
  }

  getTemplate() {
    return createEventFormEditTemplate(this._point);
    // вместо точки передаем дату
    // return createEventFormEditTemplate(this._data);
  }

  ////////////////////////////////////////////////////////////s
  // парсит задачу которую передал презентер в reset
  reset(point) {
    this.updateData(EventFormEdit.parsePointToData(point));
  }
  // обновление состояния, которое вызывает обновление элемента
  // принимает объект с изменениями, конкретно что нужно изменить

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }
    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }
  // обновление элемента (перересуется вся форма)

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  ///////////////////////////////////////////////////////////f

  _rollupBtnClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupBtnClick();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
    //вместо колбека выше передаем для сохранения иноформации
    this._callback.formSubmit(EventFormEdit.parseDataToPoint(this._data));
  }
  ///////////////////////////////////////////////////////////s

  _typeChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value, // как установить новый тип
      // offers:
    });
  }
  // востановление обработчиков

  restoreHandlers() {
    this._setInnerHandelers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }
  // установка внутренних обработчиков

  _setInnerHandelers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  }
  ///////////////////////////////////////////////////////////f

  setRollupBtnClickHandler(callback) {
    this._callback.rollupBtnClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupBtnClickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }
  ///////////////////////////////////////////////////s
  // обработчик изменения типа на списке типов в самой view
  // пока тоже самое написано в _setInnerHandelers()

  // setTypeChangeHandler() {
  //   this.getElement().querySelector('.event__type-group').addEventListener('change', this._typeChangeHandler);
  // }

  // Метод задача которого взять инофрмацию и сделать ее снимок превратив в состояние
  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        // флаги
        // isDueDate: task.dueDate !== null,

        // IsOffersElement: point.offers.length !== 0,
      },
    );
  }

  // метод используется чтобы сохранить состояние в инофрмацию
  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    // флаги

    //если дата не выбрана то она равна null
    // if (!data.isDueDate) {
    //   data.dueDate = null;
    // }

    // delete data.isDueDate;

    return data;
  }
  //////////////////////////////////////f
}
