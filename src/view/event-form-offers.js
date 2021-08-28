export const createEventFormOffersTemplate = (point) => {
  const { id, offers } = point;

  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
    ${offers.map((offer) => (`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-${id}" type="checkbox" name="event-offer-${offer.title.split(' ').pop()}" checked>
        <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-${id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)).join('\n')}
    </div>
  </section>`;
};

// изменять checked в use it late есть код
