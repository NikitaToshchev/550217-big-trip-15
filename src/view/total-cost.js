import AbstractView from './abstract.js';

const calculateTotalCost = (points) => {
  const priceTotal = points.reduce((total, point) => {
    const { basePrice, offers } = point;
    let offersTotal = 0;

    if (offers.length > 0) {
      offersTotal = offers.reduce((sum, offer) => (sum += offer.price), 0);
    }

    return total += basePrice + offersTotal;
  }, 0);

  return priceTotal;
};

const createTotalCostTemplate = (points) => {
  const totalCost = points.length ? calculateTotalCost(points) : '';

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
