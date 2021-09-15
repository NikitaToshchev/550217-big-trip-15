import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

// const disabledLinkStyle = 'style="pointer-events: none; opacity:0.5"';

// const isDasabled = (points) => !points.length ? disabledLinkStyle : '';

// const createMenuTemplate = (points) => (
//   `<nav class="trip-controls__trip-tabs trip-tabs">
//     <a class="trip-tabs__btn trip-tabs__btn--active" data-menu="${MenuItem.TABLE}" href="#">Table</a>
//     <a class="trip-tabs__btn" data-menu="${MenuItem.STATS}" href="#" ${isDasabled(points)} >Stats</a>
//   </nav>`
// );

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs trip-tabs">
    <a class="trip-tabs__btn trip-tabs__btn--active" data-menu="${MenuItem.TABLE}" href="#">Table</a>
    <a class="trip-tabs__btn" data-menu="${MenuItem.STATS}" href="#" >Stats</a>
  </nav>`
);

export default class Menu extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    // return createMenuTemplate(this._points);
    return createMenuTemplate(this._points);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menu);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = [...this.getElement().querySelectorAll('.trip-tabs__btn')];
    items.forEach((item) => {
      (item.dataset.menu === menuItem) ? item.classList.add('trip-tabs__btn--active') : item.classList.remove('trip-tabs__btn--active');
    });
  }
}
