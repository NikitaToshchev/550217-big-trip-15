import { DESTINATION_NAMES, PHOTOS, DESCRIPTIONS } from '../mock/mock-data.js';
import { getRandomArrElement, getRandomArray } from '../utils.js';

export const generateDestination = () => ({
  description: `${getRandomArray(DESCRIPTIONS).join(' ')}`,
  name: `${getRandomArrElement(DESTINATION_NAMES)}`,
  pictures: getRandomArray(PHOTOS),
});
