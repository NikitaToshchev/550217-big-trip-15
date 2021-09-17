import dayjs from 'dayjs';

export const sortPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortDay = (pointA, pointB) => dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);

export const matchCity = (city, array) => array.some((it) => it === city);
