import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getDurationTime, getDurationDiff } from '../utils/date.js';
import { StatsType } from '../const.js';


const ChartTitle = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME',
};

const chartFormatter = {
  [ChartTitle.MONEY]: (value, context) => `€ ${context.chart.data.datasets[0].data[context.dataIndex]}`,

  [ChartTitle.TYPE]: (value, context) => `${context.chart.data.datasets[0].data[context.dataIndex]}x`,

  [ChartTitle.TIME]: (value, context) => `${getDurationTime(context.chart.data.datasets[0].data[context.dataIndex])}`,
};

const chartData = {
  [ChartTitle.MONEY]: (points) => {
    const map = Array.from(
      points.reduce(
        (point, { type, basePrice }) =>
          point.set(type, (point.get(type) || 0) + basePrice),
        new Map),
    ).sort((a, b) => b[1] - a[1]);

    const types = map
      .slice()
      .map((item) => item[0].toUpperCase());

    const prices = map
      .slice()
      .map((item) => item[1]);

    return {
      labels: types,
      data: prices,
    };
  },

  [ChartTitle.TYPE]: (points) => {
    const map = Array.from(
      points.reduce(
        (point, { type }) =>
          point.set(type, (point.get(type) || 0) + 1),
        new Map),
    ).sort((a, b) => b[1] - a[1]);


    const types = map
      .slice()
      .map((item) => item[0].toUpperCase());

    const times = map
      .slice()
      .map((item) => item[1]);

    return {
      labels: types,
      data: times,
    };
  },

  [ChartTitle.TIME]: (points) => {
    const map = Array.from(
      points.reduce(
        (point, { type, dateFrom, dateTo }) =>
          point.set(type, (point.get(type) || 0) + getDurationDiff(dateFrom, dateTo)),
        new Map),
    ).sort((a, b) => b[1] - a[1]);


    const types = map
      .slice()
      .map((item) => item[0].toUpperCase());

    const time = map
      .slice()
      .map((item) => item[1]);

    return {
      labels: types,
      data: time,
    };
  },
};

const renderChart = (chartCtx, points, title) => {
  const dataChart = chartData[title](points);
  const { labels, data } = dataChart;

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
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
          formatter: chartFormatter[title],
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

    this._renderMoneyChart = renderChart(moneyCtx, this._points, ChartTitle.MONEY);
    this._renderTypeChart = renderChart(typeCtx, this._points, ChartTitle.TYPE);
    this._renderTimeChart = renderChart(timeCtx, this._points, ChartTitle.TIME);
  }

  restoreHandlers() {
    this._setCharts();
  }
}
