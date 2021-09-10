import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getDurationTime, getDurationDiff } from '../utils/date.js';
import { StatsType } from '../const.js';

const moneyChart = (moneyCtx, points) => {

  const map = Array.from(
    points.reduce(
      (point, { type, basePrice }) =>
        point.set(type, (point.get(type) || 0) + basePrice),
      new Map),
  );

  const sortMap = map.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    }
    if (a[1] > b[1]) {
      return -1;
    }
    return 0;
  });

  const types = sortMap
    .slice()
    .map((item) => item[0].toUpperCase());

  const prices = sortMap
    .slice()
    .map((item) => item[1]);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: prices,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 34,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const typeChart = (typeCtx, points) => {

  const map = Array.from(
    points.reduce(
      (point, { type }) =>
        point.set(type, (point.get(type) || 0) + 1),
      new Map),
  );

  const sortMap = map.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    }
    if (a[1] > b[1]) {
      return -1;
    }
    return 0;
  });

  const types = sortMap
    .slice()
    .map((item) => item[0].toUpperCase());

  const times = sortMap
    .slice()
    .map((item) => item[1]);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: times,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 34,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const timeChart = (timeCtx, points) => {

  const map = Array.from(
    points.reduce(
      (point, { type, dateFrom, dateTo }) =>
        point.set(type, (point.get(type) || 0) + getDurationDiff(dateFrom, dateTo)),
      new Map),
  );

  const sortMap = map.sort((a, b) => {
    if (a[1] < b[1]) {
      return 1;
    }
    if (a[1] > b[1]) {
      return -1;
    }
    return 0;
  });

  const types = sortMap
    .slice()
    .map((item) => item[0].toUpperCase());

  const time = sortMap
    .slice()
    .map((item) => item[1]);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: time,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 45,
        },
      },
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDurationTime(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 34,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>
    ${Object.values(StatsType).map((type) => (`<div class="statistics__item">
      <canvas class="statistics__chart" id="${type}" width="900"></canvas>
    </div>`)).join('')}
  </section>`
);

export default class Stats extends SmartView {
  constructor(points) {
    super();
    this._points = points;
    this._renderMoneyChart = null;
    this._renderTypeChart = null;
    this._renderTimeChart = null;
    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  removeElement() {
    super.removeElement();

    if (this._renderMoneyChart !== null || this._renderTypeChart !== null || this._renderTimeChart !== null) {
      this._renderMoneyChart = null;
      this._renderTypeChart = null;
      this._renderTimeChart = null;
    }
  }

  _setCharts() {
    if (this._renderMoneyChart !== null || this._renderTypeChart !== null || this._renderTimeChart !== null) {
      this._renderMoneyChart = null;
      this._renderTypeChart = null;
      this._renderTimeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    const BAR_HEIGHT = 55;

    moneyCtx.height = BAR_HEIGHT * 5;
    typeCtx.height = BAR_HEIGHT * 5;
    timeCtx.height = BAR_HEIGHT * 5;

    this._renderMoneyChart = moneyChart(moneyCtx, this._points);
    this._renderTypeChart = typeChart(typeCtx, this._points);
    this._renderTimeChart = timeChart(timeCtx, this._points);
  }

  restoreHandlers() {
    this._setCharts();
  }
}
