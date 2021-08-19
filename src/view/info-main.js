import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const ONE_POINT = 1;
const TWO_POINTS = 2;
const THREE_POINTS = 3;

const createInfoMainTemplate = (points) => {

  const getTitle = (arr) => {
    const firstPointName = arr.length ? arr[0].destination.name : '';
    const secondPointName = arr.length > 1 ? arr[1].destination.name : '';
    const lastPointName = arr.length > 2 ? arr[arr.length - 1].destination.name : '';
    let title = '';

    if (arr.length > THREE_POINTS) {
      title = `${firstPointName} &mdash; ... &mdash; ${lastPointName}`;
    } else if (arr.length === THREE_POINTS) {
      title = `${firstPointName} &mdash; ${secondPointName} &mdash; ${lastPointName}`;
    } else if (arr.length === TWO_POINTS) {
      title = `${firstPointName} &mdash; ${secondPointName}`;
    } else if (arr.length === ONE_POINT) {
      title = `${firstPointName}`;
    }
    return title;
  };
  const getDates = (arr) => {
    const firstPointStartDate = arr.length ? dayjs(arr[0].dateFrom).format('D MMM') : '';
    const firstPointFinishDate = arr.length ? dayjs(arr[0].dateTo).format('D MMM') : '';
    const lastPointFinishDate = arr.length > 1 ? dayjs(arr[arr.length - 1].dateTo).format('D MMM') : '';
    let dates = '';
    if (arr.length >= TWO_POINTS) {
      dates = `${firstPointStartDate}&nbsp;&mdash;&nbsp;${lastPointFinishDate}`;
    } else if (arr.length === ONE_POINT) {
      dates = `${firstPointStartDate}&nbsp;&mdash;&nbsp;${firstPointFinishDate}`;
    }
    return dates;
  };

  return `<div class="trip-info__main">
    <h1 class="trip-info__title">${getTitle(points)}</h1>

    <p class="trip-info__dates">${getDates(points)}</p>
  </div>`;
};

export default class InfoMain extends AbstractView {

  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createInfoMainTemplate(this._points);
  }
}
