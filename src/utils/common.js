import dayjs from 'dayjs';

export const sortPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortDay = (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

export const matchCity = (city, array) => array.some((it) => it === city);

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isOnline = () => window.navigator.onLine;
