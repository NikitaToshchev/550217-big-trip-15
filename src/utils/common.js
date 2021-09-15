export const sortPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export const sortDay = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

export const matchCity = (city, array) => array.some((it) => it === city);

export const getRandomNum = (min, max, precision) => {
  if (min > max) {
    throw new Error('Числа должны быть в диапазоне от меньшего к большему');
  }

  const number = min + Math.random() * (max - min + 1);
  return !precision ? ~~number : number.toFixed(precision);
};

export const getRandomArray = (arr) => {
  const lengthArr = getRandomNum(0, arr.length - 1);
  const array = [];
  for (let i = 0; i <= lengthArr; i++) {
    array.push(arr[i]);
  }
  for (let i = array.length - 1; i > 0; i--) {
    const tmp = array[i];
    const rnd = ~~(Math.random() * (i + 1));

    array[i] = array[rnd];
    array[rnd] = tmp;
  }
  return array;
};

export const getRandomArrElement = (arr) => arr.length ? arr[getRandomNum(0, arr.length - 1)] : null;
