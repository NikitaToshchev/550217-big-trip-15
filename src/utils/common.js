export const sortPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const matchCity = (city, array) => array.some((it) => it === city);
