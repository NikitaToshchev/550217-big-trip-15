import dayjs from 'dayjs';
import { getRandomNum } from './common.js';

export const generateDate = () => {
  const maxDaysGap = 10;
  const daysGap = getRandomNum(-maxDaysGap, maxDaysGap);
  const minuteGap = getRandomNum(0, 50);

  return dayjs().add(daysGap, 'day').add(minuteGap, 'minute').toDate();
};

const addleadingZero = (n) => String(n).padStart(2, '0');

export const getDurationTime = (dateTo, dateFrom) => {
  const diffDays = addleadingZero(dayjs(dateTo).diff(dayjs(dateFrom), 'day'));
  const diffHours = addleadingZero(dayjs(dateTo).subtract(diffDays, 'day').diff(dateFrom, 'hour'));
  const diffMinutes = addleadingZero(dayjs(dateTo).subtract(diffDays, 'day').subtract(diffHours, 'hour').diff(dateFrom, 'minute'));

  if (diffDays > 0) {
    return `${diffDays}D ${diffHours}H ${diffMinutes}M`;
  } else if (diffHours > 0) {
    return `${diffHours}H ${diffMinutes}M`;
  }
  return `${diffMinutes}M`;
};
