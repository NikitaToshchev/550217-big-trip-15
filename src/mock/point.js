import { getRandomNum, getRandomArrElement } from '../utils/common.js';
import { POINT_TYPES } from '../const.js';
import { generateDestination } from '../mock/destination.js';
import { generateDate } from './date.js';
import { OffersByType } from './mock-data.js';
import dayjs from 'dayjs';

export const generatePoint = () => {
  const type = getRandomArrElement(POINT_TYPES);
  const dateFrom = generateDate();
  const dateTo = dayjs(dateFrom).add(getRandomNum(100, 2000), 'minute').toDate();

  return {
    id: getRandomNum(1, 10000) + Date.now(),
    type,
    destination: generateDestination(),
    dateFrom,
    dateTo,
    basePrice: getRandomNum(20, 1000),
    offers: OffersByType[type],
    isFavorite: Boolean(getRandomNum(0, 1)),
  };
};
