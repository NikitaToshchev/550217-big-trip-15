import AbstractView from './abstract.js';

const createTotalCostTemplate = (points) => {
  const totalCost = points.length ? points.reduce((accumulator, point) => accumulator + point.basePrice, 0) : '';

  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
  </p>`;
};

export default class TotalCost extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTotalCostTemplate(this._points);
  }
}
