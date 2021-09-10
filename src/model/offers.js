import AbstractObserver from '../utils/abstract-observer.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }
}
