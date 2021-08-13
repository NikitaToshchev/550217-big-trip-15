import { CITY_POINTS, PHOTOS, DESCRIPTIONS } from '../mock/mock-data.js';
import { getRandomArrElement, getRandomArray } from '../utils.js';

export const generateDestination = () => ({
  description: `${getRandomArray(DESCRIPTIONS).join(' ')}`,
  name: `${getRandomArrElement(CITY_POINTS)}`,
  pictures: getRandomArray(PHOTOS),
});
