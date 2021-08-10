import { getRandomNum, getRandomArrElement } from '../utils.js';
import { POINTS_TYPES } from '../const.js';
import { generateDestination } from '../mock/destination.js';
import { generateOffers } from '../mock/offers.js';

export const generateLocalPoint = () => ({
  type: getRandomArrElement(POINTS_TYPES),
  destination: generateDestination(),
  dateFrom: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  basePrice: getRandomNum(100, 5000),
  offers: generateOffers(), // должны быть связанны тип офера и тип точки
  isFavorite: false,
});
