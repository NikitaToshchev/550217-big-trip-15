export const createPointOffersListTemplate = (offers) => (
  `<ul class="event__selected-offers">
  ${offers.map((offer) => (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `)).join('\n')}
  </ul>`
);
