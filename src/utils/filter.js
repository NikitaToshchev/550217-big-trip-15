import { FilterType } from '../const.js';
import dayjs from 'dayjs';

const getFutureDate = (dateFrom) => dayjs(dateFrom) >= dayjs();
const getPastDate = (dateTo) => dayjs(dateTo) <= dayjs();

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => getFutureDate(point.dateFrom)),
  [FilterType.PAST]: (points) => points.filter((point) => getPastDate(point.dateTo)),
};
