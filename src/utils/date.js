import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getDurationDiff = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

export const sortTimeDuration = (pointA, pointB) => getDurationDiff(pointA.dateTo, pointA.dateFrom) - getDurationDiff(pointB.dateTo, pointB.dateFrom);

export const getDurationTime = (ms) => {
  const days = dayjs.duration(ms).format('DD');
  const hours = dayjs.duration(ms).format('HH');
  const minutes = dayjs.duration(ms).format('mm');

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};
