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

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
